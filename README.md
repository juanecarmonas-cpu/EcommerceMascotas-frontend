# EcommerceMascotas · Frontend (Entrega 3)

Marketplace de productos para **perros y gatos**: las tiendas publican sus productos con su stock y los compradores compran sin que se les venda algo que ya no hay. Este repositorio es la aplicación en **Angular 22** que usa el backend de la Entrega 2.

- Backend (Spring Boot): https://github.com/ImEstebanCS/EcommerceMascotas

## Integrantes

| Nombre | GitHub |
|---|---|
| Jesús Andrés Luligo Peña | [YisusLuligo](https://github.com/YisusLuligo) |
| Juan Esteban Carmona Salazar | [juanecarmonas-cpu](https://github.com/juanecarmonas-cpu) |
| Nicol Dayanna Marín Moreno | [Nicolmarin12](https://github.com/Nicolmarin12) |

## Cómo ejecutarlo

**1. Backend** (en la carpeta `ecommerce` del repositorio del backend, con Java 21):

```bash
gradlew.bat bootRun
```

Queda en `http://localhost:8080` con los datos de prueba de `data.sql`. El backend ya permite el origen `http://localhost:4200` (CORS).

**2. Frontend** (en esta carpeta, con Node 24):

```bash
npm install
npm start
```

Se abre en `http://localhost:4200`.

> En Windows, si PowerShell no deja ejecutar `npm` ("la ejecución de scripts está deshabilitada"), usen `npm.cmd start` o la terminal de VS Code, que en este proyecto abre con *Símbolo del sistema*.

## Usuarios de prueba

| Correo | Contraseña | Rol |
|---|---|---|
| `bruno@mascotas.com` | `comprador123` | COMPRADOR (compra más para gato) |
| `carla@mascotas.com` | `comprador123` | COMPRADOR (compra más para perro) |
| `ana@mascotas.com` | `comprador123` | COMPRADOR |
| `patitas@mascotas.com` | `vendedor123` | VENDEDOR |
| `michi@mascotas.com` | `vendedor123` | VENDEDOR |

## Pantallas

| Ruta | Quién entra | Qué hace |
|---|---|---|
| `/catalogo` | Todos | Catálogo paginado (Anterior / Siguiente, "Página X de Y"), búsqueda mientras se escribe y filtro por especie. Al comprador le muestra arriba **Recomendados para tu mascota** |
| `/login` | Solo sin sesión | Formulario con validaciones; si el correo o la contraseña están mal, lo dice |
| `/comprar/:id` | COMPRADOR | Compra un producto: crea el pedido y lo confirma (POST y PUT protegidos con el token) |
| `/mis-pedidos` | COMPRADOR | Los pedidos del comprador de la sesión |
| `/publicar` | VENDEDOR | Publica un producto nuevo (POST protegido con el token) |

## Qué pide la guía y dónde está

| Punto | Dónde |
|---|---|
| 2.1 Conexión con el backend | `core/models` (interfaces espejo de los DTOs, mismos nombres de campos) y `core/services` (un servicio por grupo de endpoints). La dirección de la API solo está en `environments/environment.ts` |
| 2.2 Login con JWT | `features/auth/login`, `core/services/auth.service.ts` (token en localStorage y señales para el menú) |
| 2.3 Interceptor | `core/interceptors/auth.interceptor.ts`: pone `Authorization: Bearer …` en todas las peticiones y, con un 401, cierra la sesión, avisa y manda al login |
| 2.4 Guards | `core/guards/sesion.guard.ts` (rutas privadas) e `invitado.guard.ts` (saca de `/login` a quien ya tiene sesión) |
| 2.5 Catálogo | `features/catalogo`: la página y la búsqueda las hace el backend (`pagina`, `tamano`, `texto`); los retirados no salen |
| 2.6 Operación de negocio | Comprar (`features/pedidos/comprar`) y Publicar (`features/publicaciones/publicar`): formularios reactivos, botón que se apaga y códigos HTTP traducidos en `core/models/error.models.ts` |
| 2.7 Avisos | `core/services/avisos.service.ts` y `shared/avisos` |
| 2.8 Bootstrap | Instalado en `angular.json` (`styles` y `scripts`); navbar con menú hamburguesa, tarjetas y formularios con sus clases |
| 2.9 Funcionalidad propia | **Recomendados para tu mascota** (ver abajo) |

### Funcionalidad propia: Recomendados para tu mascota

El backend (`GET /api/publicaciones/recomendadas`, solo COMPRADOR) mira lo que el comprador ya compró, saca para qué especie compra más (perro o gato) y le recomienda productos de esa especie que todavía no tiene. En Angular se ve arriba del catálogo (`features/catalogo/recomendados`). Por ejemplo, a Bruno le salen productos de gato y, cuando compra uno, deja de aparecerle.

### Extras

- **Guard por rol** (`core/guards/rol.guard.ts`): `/publicar` es solo para el VENDEDOR y `/comprar` y `/mis-pedidos` solo para el COMPRADOR. Quien tiene otro rol no entra, y el menú no le muestra esa opción.
- **Búsqueda reactiva con Signals** (`features/catalogo/catalogo.ts`): el texto, la especie y la página son señales que se combinan en una sola (`computed`). La búsqueda espera 400 ms después de la última tecla (debounce) antes de pedirle la página al backend.

## Estructura

```
src/app/
├── core/          lo que usa toda la app: models, services, interceptors, guards
├── shared/        componentes reutilizables: navbar, avisos, tarjeta-publicacion
└── features/      una carpeta por funcionalidad: auth, catalogo, pedidos, publicaciones
```

## Nota técnica

En el PC de uno de los integrantes, el Control de aplicaciones inteligente de Windows bloquea `esbuild.exe`, el programa con el que Angular compila por defecto. Por eso el proyecto compila con el builder de **webpack** (`@angular-devkit/build-angular`), que es todo JavaScript, y en `package.json` `esbuild` se reemplaza por su versión WebAssembly. En cualquier otro PC funciona igual.

import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { mensajeDeError } from '../../../core/models/error.models';
import { AuthService } from '../../../core/services/auth.service';
import { AvisosService } from '../../../core/services/avisos.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly avisos = inject(AvisosService);
  private readonly router = inject(Router);

  protected readonly formulario = inject(NonNullableFormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected readonly enviando = signal(false);
  protected readonly errorLogin = signal<string | null>(null);

  protected invalido(campo: 'email' | 'password'): boolean {
    const control = this.formulario.controls[campo];
    return control.invalid && control.touched;
  }

  protected iniciarSesion(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.errorLogin.set(null);
    this.auth.login(this.formulario.getRawValue()).subscribe({
      next: (respuesta) => {
        this.avisos.exito(`¡Hola, ${respuesta.email}!`);
        this.router.navigate(['/catalogo']);
      },
      error: (error: HttpErrorResponse) => {
        this.enviando.set(false);
        this.errorLogin.set(error.status === 401 ? 'Correo o contraseña incorrectos.' : mensajeDeError(error));
      },
    });
  }
}

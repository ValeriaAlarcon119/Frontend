import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="container mt-5">
      <h2 class="text-center">Registro</h2>
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form" style="max-width: 400px; margin: auto;">
        <div class="mb-3">
          <label for="name">Nombre:</label>
          <input type="text" id="name" formControlName="name" class="form-control" required>
          <div *ngIf="formSubmitted && errorMessages.name" class="text-danger">{{ errorMessages.name }}</div>
        </div>
        <div class="mb-3">
          <label for="email">Correo Electrónico:</label>
          <input type="email" id="email" formControlName="email" class="form-control" required>
          <div *ngIf="formSubmitted && errorMessages.email" class="text-danger">{{ errorMessages.email }}</div>
        </div>
        <div class="mb-3">
          <label for="password">Contraseña:</label>
          <input type="password" id="password" formControlName="password" class="form-control" required>
          <div *ngIf="formSubmitted && errorMessages.password" class="text-danger">{{ errorMessages.password }}</div>
        </div>
        <div class="mb-3">
          <label for="confirmPassword">Confirmar Contraseña:</label>
          <input type="password" id="confirmPassword" formControlName="confirmPassword" class="form-control" required>
          <div *ngIf="formSubmitted && errorMessages.confirmPassword" class="text-danger">{{ errorMessages.confirmPassword }}</div>
        </div>
        <button type="submit" class="btn btn-success">Registrarse</button>
        <div *ngIf="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
        <div *ngIf="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
      </form>
    </div>
  `,
  styles: []
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  formSubmitted: boolean = false;
  errorMessages: any = {};
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  onSubmit(): void {
    this.formSubmitted = true;
    this.errorMessages = {};

    if (this.registerForm.invalid) {
      if (this.registerForm.get('name')?.hasError('required')) {
        this.errorMessages.name = 'Este campo es requerido.';
      }
      if (this.registerForm.get('email')?.hasError('required')) {
        this.errorMessages.email = 'Este campo es requerido.';
      }
      if (this.registerForm.get('email')?.hasError('email')) {
        this.errorMessages.email = 'Formato de correo inválido.';
      }
      if (this.registerForm.get('password')?.hasError('required')) {
        this.errorMessages.password = 'Este campo es requerido.';
      }
      if (this.registerForm.get('password')?.hasError('minlength')) {
        this.errorMessages.password = 'La contraseña debe tener al menos 6 caracteres.';
      }
      if (this.registerForm.get('confirmPassword')?.hasError('required')) {
        this.errorMessages.confirmPassword = 'Este campo es requerido.';
      }
      return;
    }

    this.http.post('http://localhost:8000/api/auth/register', this.registerForm.value).subscribe({
      next: (response: any) => {
        this.successMessage = 'Usuario registrado con éxito';
        this.errorMessage = '';
        this.registerForm.reset();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        if (error.status === 422) {
          this.errorMessage = error.error.errors.email ? error.error.errors.email[0] : 'Ocurrió un error inesperado.';
        } else {
          this.errorMessage = 'Ocurrió un error inesperado. Inténtelo más tarde.';
        }
      }
    });
  }
}

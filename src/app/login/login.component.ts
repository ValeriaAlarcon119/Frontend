import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  email: string = '';
  password: string = '';
  formSubmitted: boolean = false;
  errorMessages: any = {};

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.formSubmitted = true;
    this.errorMessages = {};

    if (this.loginForm.invalid) {
      if (this.loginForm.get('name')?.hasError('required')) {
        this.errorMessages.name = 'Este campo es requerido.';
      }
      if (this.loginForm.get('email')?.hasError('required')) {
        this.errorMessages.email = 'Este campo es requerido.';
      }
      if (this.loginForm.get('email')?.hasError('email')) {
        this.errorMessages.email = 'Formato de correo inválido.';
      }
      if (this.loginForm.get('password')?.hasError('required')) {
        this.errorMessages.password = 'Este campo es requerido.';
      }
      return;
    }

    this.http.post('http://localhost:8000/api/auth/login', { email: this.email, password: this.password })
      .subscribe((response: any) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/dashboard']);
      }, error => {
        console.error('Error de inicio de sesión', error);
      });
  }

  openRegisterForm(): void {
    this.router.navigate(['/register']); 
  }
} 
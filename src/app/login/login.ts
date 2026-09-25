import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: FormGroup;
  showPassword = false;
  isSubmitting = false;
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.loginError = '';

    // if (this.loginForm.invalid) {
    //   this.loginForm.markAllAsTouched();
    //   return;
    // }

    this.isSubmitting = true;
    const { username, password } = this.loginForm.value;

    // TODO: replace with real auth call
    // this.authService.login(username, password).subscribe({
    //   next: () => this.router.navigate(['/dashboard']),
    //   error: (err) => {
    //     this.loginError = 'Invalid username or password';
    //     this.isSubmitting = false;
    //   }
    // });

    setTimeout(() => {
      this.isSubmitting = false;
      this.router.navigate(['/master/department']);
    }, 600);
  }
}

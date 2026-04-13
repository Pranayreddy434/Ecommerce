import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSnackBarModule],
  template: `
    <section class="page-shell auth-layout">
      <div class="auth-copy">
        <span class="pill">Secure account access</span>
        <h1>{{ isRegister() ? 'Create your ShopVerse account' : 'Welcome back to ShopVerse' }}</h1>
        <p class="section-copy">
          Sign in to save your cart, place mock payments, and track recent orders from a clean dashboard.
        </p>
      </div>

      <mat-card class="glass-card auth-card">
        <h2>{{ isRegister() ? 'Register' : 'Login' }}</h2>

        <form [formGroup]="form" (ngSubmit)="submit()">
          @if (isRegister()) {
            <mat-form-field appearance="outline">
              <mat-label>Full name</mat-label>
              <input matInput formControlName="fullName">
            </mat-form-field>
          }

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password">
          </mat-form-field>

          <button mat-flat-button color="primary" class="submit-btn" type="submit">
            {{ isRegister() ? 'Create Account' : 'Login' }}
          </button>
        </form>

        <p class="muted">
          {{ isRegister() ? 'Already registered?' : 'New here?' }}
          <a [routerLink]="isRegister() ? '/login' : '/register'">{{ isRegister() ? 'Login' : 'Create an account' }}</a>
        </p>

        <p class="demo muted">Demo admin: admin@shopverse.com / Admin@123</p>
      </mat-card>
    </section>
  `,
  styles: [`
    .auth-layout {
      display: grid;
      grid-template-columns: 1fr 0.85fr;
      gap: 24px;
      align-items: center;
      min-height: calc(100vh - 220px);
    }

    .auth-copy h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(2rem, 4vw, 4rem);
      margin: 18px 0 12px;
    }

    .auth-card {
      padding: 28px;
    }

    form {
      display: grid;
      gap: 14px;
      margin: 18px 0;
    }

    .submit-btn {
      min-height: 50px;
    }

    .demo {
      margin-top: 16px;
    }

    @media (max-width: 900px) {
      .auth-layout {
        grid-template-columns: 1fr;
        padding: 28px 0;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  readonly isRegister = signal(this.route.snapshot.data['mode'] === 'register');
  readonly form = this.fb.group({
    fullName: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor() {
    if (this.isRegister()) {
      this.form.controls.fullName.addValidators([Validators.required, Validators.minLength(3)]);
      this.form.controls.fullName.updateValueAndValidity();
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const request = this.isRegister()
      ? this.authService.register({
          fullName: value.fullName || '',
          email: value.email || '',
          password: value.password || ''
        })
      : this.authService.login({
          email: value.email || '',
          password: value.password || ''
        });

    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.snackBar.open(this.isRegister() ? 'Account created successfully' : 'Logged in successfully', 'Close', { duration: 2500 });
        this.router.navigateByUrl('/');
      },
      error: () => this.snackBar.open('Authentication failed. Check your credentials.', 'Close', { duration: 3000 })
    });
  }
}

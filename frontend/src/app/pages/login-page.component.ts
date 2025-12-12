import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

import { AuthService } from '../auth.service';
import { User } from '../user.model';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
      <!-- Shop Login Link (top right, small) -->
      <button
        (click)="toggleShopLogin()"
        class="absolute top-4 right-4 text-xs font-semibold text-gray-600 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50"
      >
        Shop Login
      </button>

      <!-- Logo -->
      <div class="flex justify-center mb-8 pt-4">
        <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>

      <!-- Heading - Customer Focused -->
      <div *ngIf="!isShopLogin()">
        <h1 class="text-3xl font-bold text-center text-gray-900 mb-2">Welcome Back</h1>
        <p class="text-center text-gray-600 mb-8">Access your vehicles and service history</p>
      </div>

      <!-- Heading - Shop Login -->
      <div *ngIf="isShopLogin()">
        <h1 class="text-3xl font-bold text-center text-gray-900 mb-2">Shop Admin Login</h1>
        <p class="text-center text-gray-600 mb-8">Manage your auto shop</p>
        <button
          (click)="toggleShopLogin()"
          class="absolute top-4 right-4 text-xs font-semibold text-gray-600 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50"
        >
          Back to Customer
        </button>
      </div>

      <!-- Error Banner -->
      <div *ngIf="errorMessage()" class="mb-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">
        {{ errorMessage() }}
      </div>

      <!-- Form -->
      <form (submit)="onLogin($event)" class="space-y-5">
        <!-- Email/Phone Input -->
        <div>
          <label class="block text-sm font-semibold text-gray-900 mb-2">
            {{ isShopLogin() ? 'Email Address' : 'Phone Number or Email' }}
          </label>
          <input
            type="text"
            [placeholder]="isShopLogin() ? 'admin@yourshop.com' : '+1 (555) 123-4567 or email@example.com'"
            [(ngModel)]="email"
            name="email"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <!-- Password Input -->
        <div>
          <label class="block text-sm font-semibold text-gray-900 mb-2">Password</label>
          <div class="relative">
            <input
              [type]="showPassword() ? 'text' : 'password'"
              placeholder="••••••••"
              [(ngModel)]="password"
              name="password"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              type="button"
              (click)="togglePassword()"
              class="absolute right-3 top-2.5 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg *ngIf="!showPassword()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <svg *ngIf="showPassword()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m4.753-4.753L3.596 3.039m10.318 10.318L3.596 3.039M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Remember & Forgot -->
        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-blue-600" />
            <span class="text-gray-700">Remember me</span>
          </label>
          <a href="#" class="text-blue-600 hover:text-blue-700 font-semibold">Forgot password?</a>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          [disabled]="isLoading()"
          class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg font-bold hover:shadow-lg transition-all mt-6 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {{ isLoading() ? 'Signing In...' : 'Sign In' }}
        </button>
      </form>

      <!-- Divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-600">Or continue with</span>
        </div>
      </div>

      <!-- Social Login -->
      <div class="grid grid-cols-2 gap-3">
        <button class="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>
          </svg>
          Google
        </button>
        <button class="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"></path>
          </svg>
          Facebook
        </button>
      </div>

      <!-- Bottom Text - Customer Focused -->
      <div *ngIf="!isShopLogin()" class="text-center text-gray-600 mt-8">
        <p>Don't have an account yet?</p>
        <p class="text-sm text-gray-500 mt-1">Contact your auto shop to request registration</p>
      </div>

      <!-- Bottom Text - Shop Focused -->
      <div *ngIf="isShopLogin()" class="text-center text-gray-600 mt-8">
        <p>Don't have a shop account?</p>
        <a routerLink="/auth/shop-register" class="text-blue-600 hover:text-blue-700 font-bold">
          Register your shop
        </a>
      </div>
    </div>
  `,
  styles: []
})
export class LoginPageComponent {
  email = '';
  password = '';
  showPassword = signal(false);
  isShopLogin = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  togglePassword() {
    this.showPassword.update(val => !val);
  }

  toggleShopLogin() {
    this.isShopLogin.update(val => !val);
  }

  onLogin(e: Event) {
    e.preventDefault();

    if (!this.email || !this.password) {
      this.errorMessage.set('Email/phone and password are required.');
      return;
    }

    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.auth
      .login(this.email.trim(), this.password)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (user) => {
          const targetRoute = this.getDestinationRoute(user);
          this.router.navigate([targetRoute]);
        },
        error: (err) => {
          const detail = err?.error?.detail || 'Unable to sign in, please check your credentials.';
          this.errorMessage.set(detail);
        }
      });
  }

  private getDestinationRoute(user: User): string {
    if (user.role === 'customer') {
      return '/dashboard/customer';
    }
    if (user.role === 'mechanic') {
      return '/mechanic';
    }
    return '/dashboard/shop';
  }
}

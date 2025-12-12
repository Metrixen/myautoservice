import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <!-- Logo -->
      <div class="flex justify-center mb-8">
        <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>

      <!-- Heading -->
      <h1 class="text-3xl font-bold text-center text-gray-900 mb-2">Register Your Shop</h1>
      <p class="text-center text-gray-600 mb-8">Start managing your auto shop today</p>

      <!-- Form -->
      <form (submit)="onRegister($event)" class="space-y-4">
        <!-- Step Indicator -->
        <div class="flex gap-2 mb-6">
          <div [class.bg-blue-600]="step() >= 1" [class.bg-gray-300]="step() < 1" class="h-1 flex-1 rounded-full transition-all"></div>
          <div [class.bg-blue-600]="step() >= 2" [class.bg-gray-300]="step() < 2" class="h-1 flex-1 rounded-full transition-all"></div>
          <div [class.bg-blue-600]="step() >= 3" [class.bg-gray-300]="step() < 3" class="h-1 flex-1 rounded-full transition-all"></div>
        </div>

        <!-- Step 1: Shop Info -->
        <div *ngIf="step() === 1" class="space-y-4">
          <h3 class="font-bold text-lg text-gray-900">Shop Information</h3>
          
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">Shop Name</label>
            <input
              type="text"
              placeholder="ABC Auto Service"
              [(ngModel)]="shopName"
              name="shopName"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="admin@yourshop.com"
              [(ngModel)]="shopEmail"
              name="shopEmail"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
            <input
              type="tel"
              placeholder="+1 (555) 123-4567"
              [(ngModel)]="shopPhone"
              name="shopPhone"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Step 2: Address -->
        <div *ngIf="step() === 2" class="space-y-4">
          <h3 class="font-bold text-lg text-gray-900">Shop Address</h3>
          
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">Street Address</label>
            <input
              type="text"
              placeholder="123 Main Street"
              [(ngModel)]="address"
              name="address"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">City</label>
              <input
                type="text"
                placeholder="New York"
                [(ngModel)]="city"
                name="city"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">State</label>
              <input
                type="text"
                placeholder="NY"
                [(ngModel)]="state"
                name="state"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">ZIP Code</label>
            <input
              type="text"
              placeholder="10001"
              [(ngModel)]="zipCode"
              name="zipCode"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Step 3: Account -->
        <div *ngIf="step() === 3" class="space-y-4">
          <h3 class="font-bold text-lg text-gray-900">Account Setup</h3>
          
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">Admin Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              [(ngModel)]="adminName"
              name="adminName"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">Password</label>
            <input
              [type]="showPassword() ? 'text' : 'password'"
              placeholder="••••••••"
              [(ngModel)]="password"
              name="password"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">Confirm Password</label>
            <input
              [type]="showPassword() ? 'text' : 'password'"
              placeholder="••••••••"
              [(ngModel)]="confirmPassword"
              name="confirmPassword"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <label class="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" [(ngModel)]="agreeToTerms" name="agreeToTerms" class="w-4 h-4 rounded border-gray-300 text-blue-600 mt-0.5" />
            <span class="text-sm text-gray-700">
              I agree to the Terms of Service and Privacy Policy
            </span>
          </label>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex gap-3 mt-8">
          <button
            type="button"
            (click)="previousStep()"
            *ngIf="step() > 1"
            class="flex-1 py-2.5 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="button"
            (click)="nextStep()"
            *ngIf="step() < 3"
            class="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Next
          </button>
          <button
            type="submit"
            *ngIf="step() === 3"
            class="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Create Account
          </button>
        </div>
      </form>

      <!-- Login Link -->
      <p class="text-center text-gray-600 mt-6">
        Already registered?
        <a routerLink="/auth/login" class="text-blue-600 hover:text-blue-700 font-bold ml-1">
          Sign in
        </a>
      </p>
    </div>
  `,
  styles: []
})
export class ShopRegisterPageComponent {
  step = signal(1);
  showPassword = signal(false);

  // Step 1
  shopName = '';
  shopEmail = '';
  shopPhone = '';

  // Step 2
  address = '';
  city = '';
  state = '';
  zipCode = '';

  // Step 3
  adminName = '';
  password = '';
  confirmPassword = '';
  agreeToTerms = false;

  nextStep() {
    if (this.step() < 3) {
      this.step.update(s => s + 1);
    }
  }

  previousStep() {
    if (this.step() > 1) {
      this.step.update(s => s - 1);
    }
  }

  onRegister(e: Event) {
    e.preventDefault();
    console.log('Registration attempt:', {
      shopName: this.shopName,
      shopEmail: this.shopEmail,
      shopPhone: this.shopPhone,
      address: this.address,
      city: this.city,
      state: this.state,
      zipCode: this.zipCode,
      adminName: this.adminName,
      agreeToTerms: this.agreeToTerms
    });
    // TODO: Connect to FastAPI backend
  }
}

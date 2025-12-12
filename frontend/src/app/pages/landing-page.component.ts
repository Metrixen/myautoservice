import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-white">
      <!-- Navigation Header -->
      <nav class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h1 class="text-2xl font-bold text-gray-900">MyAutoService</h1>
            </div>
            <div class="flex items-center gap-4">
              <a
                routerLink="/auth/login"
                class="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </a>
              <a
                routerLink="/auth/shop-register"
                class="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-shadow font-medium"
              >
                Register Shop
              </a>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
        <div class="absolute inset-0 opacity-40">
          <svg class="absolute top-0 left-0 w-96 h-96 text-blue-100" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.1"></circle>
          </svg>
          <svg class="absolute bottom-0 right-0 w-96 h-96 text-indigo-100" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.1"></circle>
          </svg>
        </div>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <!-- Left Content -->
            <div>
              <h2 class="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Manage Your Auto Shop
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Effortlessly
                </span>
              </h2>
              <p class="text-xl text-gray-600 mb-8">
                MyAutoService is a comprehensive shop-management platform built for modern automotive shops. Track vehicles, manage appointments, and keep customers informed—all in one place.
              </p>
              <div class="flex flex-col sm:flex-row gap-4">
                <a
                  routerLink="/auth/shop-register"
                  class="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-shadow font-semibold"
                >
                  Register Your Shop
                  <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </a>
                <a
                  routerLink="/auth/login"
                  class="inline-flex items-center justify-center px-8 py-3 border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Already a member? Sign In
                </a>
              </div>
            </div>

            <!-- Right Illustration -->
            <div class="relative">
              <div class="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-3xl p-1">
                <div class="bg-white rounded-3xl p-8">
                  <div class="space-y-4">
                    <div class="flex items-center gap-4 bg-blue-50 p-4 rounded-xl">
                      <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                      </div>
                      <div>
                        <p class="text-sm font-semibold text-gray-900">Quick Search</p>
                        <p class="text-xs text-gray-600">Find vehicles by plate or VIN</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-4 bg-indigo-50 p-4 rounded-xl">
                      <div class="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <div>
                        <p class="text-sm font-semibold text-gray-900">Schedule Visits</p>
                        <p class="text-xs text-gray-600">Manage appointments seamlessly</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-4 bg-purple-50 p-4 rounded-xl">
                      <div class="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                        </svg>
                      </div>
                      <div>
                        <p class="text-sm font-semibold text-gray-900">Smart Reminders</p>
                        <p class="text-xs text-gray-600">Automated service reminders</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-20 sm:py-32 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Run Your Shop
            </h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for auto shops by people who understand the industry
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Feature 1 -->
            <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div class="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">Vehicle Management</h3>
              <p class="text-gray-600">
                Easily manage all customer vehicles. Search by license plate or VIN, track service history, and monitor current status.
              </p>
              <button class="mt-6 inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group">
                Register Vehicle
                <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>

            <!-- Feature 2 -->
            <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div class="w-14 h-14 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-xl flex items-center justify-center mb-6">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">Appointment Scheduling</h3>
              <p class="text-gray-600">
                Schedule appointments with ease. Manage availability, send confirmations, and never double-book your service bays.
              </p>
              <button class="mt-6 inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold group">
                Log Appointment
                <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>

            <!-- Feature 3 -->
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div class="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">Smart Reminders</h3>
              <p class="text-gray-600">
                Automatically remind customers about scheduled maintenance. Generate reminders and keep customers engaged.
              </p>
              <button class="mt-6 inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold group">
                Generate Reminder
                <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>

            <!-- Feature 4 -->
            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div class="w-14 h-14 bg-gradient-to-br from-green-600 to-green-500 rounded-xl flex items-center justify-center mb-6">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM16 11a4 4 0 11-8 0 4 4 0 018 0zM9 20H3v-2a6 6 0 0112 0v2z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">Customer Management</h3>
              <p class="text-gray-600">
                Keep detailed customer profiles, track their vehicles, and maintain communication history in one centralized system.
              </p>
              <button class="mt-6 inline-flex items-center text-green-600 hover:text-green-700 font-semibold group">
                Add Shop
                <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>

            <!-- Feature 5 -->
            <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div class="w-14 h-14 bg-gradient-to-br from-orange-600 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">Analytics & Insights</h3>
              <p class="text-gray-600">
                Get actionable insights into your business. Track revenue, monitor peak hours, and plan staffing accordingly.
              </p>
              <button class="mt-6 inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold group">
                View Analytics
                <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>

            <!-- Feature 6 -->
            <div class="bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div class="w-14 h-14 bg-gradient-to-br from-rose-600 to-rose-500 rounded-xl flex items-center justify-center mb-6">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">Secure & Reliable</h3>
              <p class="text-gray-600">
                Built with JWT authentication and industry-standard security practices to protect your data and your customers'.
              </p>
              <button class="mt-6 inline-flex items-center text-rose-600 hover:text-rose-700 font-semibold group">
                Learn More
                <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="bg-gradient-to-r from-blue-600 to-indigo-600 py-16 sm:py-24">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Shop?
          </h2>
          <p class="text-xl text-blue-100 mb-8">
            Join hundreds of auto shops already using MyAutoService to streamline their operations.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              routerLink="/auth/shop-register"
              class="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-bold text-lg"
            >
              Get Started Today
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>
            <a
              href="#features"
              class="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors font-bold text-lg"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-gray-900 text-gray-300 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div class="flex items-center gap-2 mb-4">
                <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-bold text-white">MyAutoService</h3>
              </div>
              <p class="text-sm">Modern shop management for the automotive industry.</p>
            </div>
            <div>
              <h4 class="font-bold text-white mb-4">Product</h4>
              <ul class="space-y-2 text-sm">
                <li><a href="#" class="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 class="font-bold text-white mb-4">Company</h4>
              <ul class="space-y-2 text-sm">
                <li><a href="#" class="hover:text-white transition-colors">About</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 class="font-bold text-white mb-4">Legal</h4>
              <ul class="space-y-2 text-sm">
                <li><a href="#" class="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div class="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 MyAutoService. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: []
})
export class LandingPageComponent {}

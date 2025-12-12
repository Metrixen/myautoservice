import { Component } from '@angular/core';

@Component({
  selector: 'app-placeholder-page',
  standalone: true,
  imports: [],
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div class="text-center max-w-md">
        <div class="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-3">Page Under Development</h1>
        <p class="text-gray-600 mb-8">
          This page is currently being built. Our team is working hard to bring you amazing features soon.
        </p>
        <div class="space-y-3">
          <p class="text-sm text-gray-500">
            In the meantime, explore other sections of MyAutoService or check back soon for updates.
          </p>
          <button class="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-shadow font-semibold">
            Go Back Home
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PlaceholderPageComponent {}

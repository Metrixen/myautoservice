import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { CustomersService } from '../customers.service';
import { VehiclesService } from '../vehicles.service';
import type { Customer } from '../models/customer.model';
import type { Vehicle } from '../models/vehicle.model';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div *ngIf="errorMessage()" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
        {{ errorMessage() }}
      </div>

      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
        <h2 class="text-3xl font-bold mb-2">Welcome, {{ profileName() }}!</h2>
        <p class="text-blue-100">
          {{ profileSubtitle() }}
        </p>
      </div>

      <div>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-2xl font-bold text-gray-900">My Vehicles</h3>
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm">
            Request Registration
          </button>
        </div>

        <div *ngIf="isLoadingVehicles()" class="bg-white rounded-xl border border-gray-200 p-6 text-gray-700">
          Loading your garage...
        </div>

        <ng-container *ngIf="!isLoadingVehicles()">
          <div *ngIf="vehicles().length > 0; else noVehicles" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div *ngFor="let vehicle of vehicles()" class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div class="flex items-start justify-between">
                  <div>
                    <h4 class="text-lg font-bold text-gray-900">{{ formatVehicleTitle(vehicle) }}</h4>
                    <p class="text-sm text-gray-600 mt-1">{{ vehicle.plate }}</p>
                  </div>
                  <span class="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {{ vehicleStatusLabel(vehicle) }}
                  </span>
                </div>
              </div>

              <div class="px-6 py-4 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs font-semibold text-gray-600 uppercase mb-1">First Seen</p>
                    <p class="text-base font-bold text-gray-900">{{ formatDate(vehicle.first_seen_at) }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-semibold text-gray-600 uppercase mb-1">Last Visit</p>
                    <p class="text-base font-bold text-gray-900">{{ formatDate(vehicle.last_seen_at) }}</p>
                  </div>
                </div>
                <div>
                  <p class="text-xs font-semibold text-gray-600 uppercase mb-1">VIN</p>
                  <p class="text-sm text-gray-900 font-mono break-all">{{ vehicle.vin || 'Not provided' }}</p>
                </div>
              </div>
            </div>
          </div>
        </ng-container>

        <ng-template #noVehicles>
          <div class="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
            <p class="font-semibold">No vehicles linked yet.</p>
            <p class="text-sm mt-1">Ask your shop to add your vehicle so you can track visits and reminders.</p>
          </div>
        </ng-template>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-900">Upcoming Appointments</h3>
          <span class="text-sm text-gray-600">Coming soon</span>
        </div>
        <div class="px-6 py-12 text-center text-gray-600">
          <p>You don't have any scheduled appointments yet.</p>
          <p class="text-sm text-gray-500 mt-1">We'll show them here once your shop confirms a slot.</p>
        </div>
      </div>

      <div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 p-6">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-amber-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4v2m0 5v1m0-16V3m10 10a10 10 0 11-20 0 10 10 0 0120 0z"></path>
            </svg>
          </div>
          <div class="flex-1">
            <h4 class="font-bold text-amber-900 mb-2">Need help?</h4>
            <p class="text-sm text-amber-800 mb-3">
              Reach out to your shop to update vehicle details or schedule your next visit.
            </p>
            <button class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold text-sm">
              Contact Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CustomerDashboardComponent {
  private readonly customersService = inject(CustomersService);
  private readonly vehiclesService = inject(VehiclesService);

  readonly profile = signal<Customer | null>(null);
  readonly vehicles = signal<Vehicle[]>([]);
  readonly isLoadingProfile = signal(true);
  readonly isLoadingVehicles = signal(false);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    this.loadProfile();
  }

  readonly profileName = computed(() => {
    const profile = this.profile();
    if (!profile) {
      return 'there';
    }
    const name = `${profile.first_name} ${profile.last_name}`.trim();
    return name || profile.phone || 'there';
  });

  readonly profileSubtitle = computed(() => {
    if (this.isLoadingProfile()) {
      return 'Loading your profile...';
    }
    return 'Track your vehicles and appointments in one place';
  });

  private loadProfile(): void {
    this.isLoadingProfile.set(true);
    this.customersService
      .getMyProfile()
      .pipe(finalize(() => this.isLoadingProfile.set(false)))
      .subscribe({
        next: (profile) => {
          this.profile.set(profile);
          this.errorMessage.set(null);
          this.loadVehicles(profile.id);
        },
        error: (err) => {
          const detail = err?.error?.detail || 'Unable to load your profile.';
          this.errorMessage.set(detail);
        }
      });
  }

  private loadVehicles(ownerId: number): void {
    this.isLoadingVehicles.set(true);
    this.vehiclesService
      .listByOwner(ownerId)
      .pipe(finalize(() => this.isLoadingVehicles.set(false)))
      .subscribe({
        next: (vehicles) => {
          this.vehicles.set(vehicles);
        },
        error: (err) => {
          console.error('Failed to load vehicles', err);
        }
      });
  }

  formatVehicleTitle(vehicle: Vehicle): string {
    const parts = [vehicle.year ?? '', vehicle.make ?? '', vehicle.model ?? '']
      .map((value) => (value ? String(value) : ''))
      .filter(Boolean);
    const title = parts.join(' ').trim();
    return title || vehicle.plate;
  }

  formatDate(value: string | null): string {
    if (!value) {
      return 'Not recorded';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return 'Not recorded';
    }
    return date.toLocaleDateString();
  }

  vehicleStatusLabel(vehicle: Vehicle): string {
    return vehicle.last_seen_at ? 'Active' : 'New';
  }
}

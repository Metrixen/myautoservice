import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getCarMakes, getCarModels } from '../data/car-makes-models';
import { finalize } from 'rxjs/operators';

import { CustomersService } from '../customers.service';
import { VehiclesService } from '../vehicles.service';
import { AuthService } from '../auth.service';
import type { Customer as ApiCustomer, CustomerCreate } from '../models/customer.model';
import type { Vehicle as ApiVehicle } from '../models/vehicle.model';

interface UiCustomer extends ApiCustomer {
  createdAt?: string;
}

interface UiVehicle {
  id: number;
  make: string | null;
  model: string | null;
  year: number | null;
  licensePlate: string;
  vin: string | null;
  createdAt: string;
  customerId: number | null;
  lastVisitedDate: string | null;
}

interface CustomerVehicle {
  customerId: number;
  vehicleId: number;
  assignedAt: string;
}

@Component({
  selector: 'app-mechanic-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">Mechanic Panel</h1>
          <button class="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
            Sign Out
          </button>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="bg-white border-b border-gray-200 px-6">
        <div class="flex gap-1">
          <button
            (click)="setTab('add-customer')"
            [class.border-b-2]="currentTab() === 'add-customer'"
            [class.border-blue-600]="currentTab() === 'add-customer'"
            [class.text-blue-600]="currentTab() === 'add-customer'"
            [class.text-gray-600]="currentTab() !== 'add-customer'"
            class="px-4 py-3 font-semibold hover:text-blue-600 transition-colors border-b-2 border-transparent"
          >
            Add Customer
          </button>
          <button
            (click)="setTab('add-vehicle')"
            [class.border-b-2]="currentTab() === 'add-vehicle'"
            [class.border-blue-600]="currentTab() === 'add-vehicle'"
            [class.text-blue-600]="currentTab() === 'add-vehicle'"
            [class.text-gray-600]="currentTab() !== 'add-vehicle'"
            class="px-4 py-3 font-semibold hover:text-blue-600 transition-colors border-b-2 border-transparent"
          >
            Add Vehicle
          </button>
          <button
            (click)="setTab('assign-vehicle')"
            [class.border-b-2]="currentTab() === 'assign-vehicle'"
            [class.border-blue-600]="currentTab() === 'assign-vehicle'"
            [class.text-blue-600]="currentTab() === 'assign-vehicle'"
            [class.text-gray-600]="currentTab() !== 'assign-vehicle'"
            class="px-4 py-3 font-semibold hover:text-blue-600 transition-colors border-b-2 border-transparent"
          >
            Assign Vehicle
          </button>
          <button
            (click)="setTab('customers-list')"
            [class.border-b-2]="currentTab() === 'customers-list'"
            [class.border-blue-600]="currentTab() === 'customers-list'"
            [class.text-blue-600]="currentTab() === 'customers-list'"
            [class.text-gray-600]="currentTab() !== 'customers-list'"
            class="px-4 py-3 font-semibold hover:text-blue-600 transition-colors border-b-2 border-transparent"
          >
            Customers
          </button>
          <button
            (click)="setTab('vehicles-list')"
            [class.border-b-2]="currentTab() === 'vehicles-list'"
            [class.border-blue-600]="currentTab() === 'vehicles-list'"
            [class.text-blue-600]="currentTab() === 'vehicles-list'"
            [class.text-gray-600]="currentTab() !== 'vehicles-list'"
            class="px-4 py-3 font-semibold hover:text-blue-600 transition-colors border-b-2 border-transparent"
          >
            Vehicles
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="flex-1 overflow-auto">
        <div class="max-w-4xl mx-auto p-6">
          <!-- Add Customer Tab -->
          <div *ngIf="currentTab() === 'add-customer'" class="space-y-6">
            <div class="bg-white rounded-xl border border-gray-200 p-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Add New Customer</h2>
              <form (submit)="addCustomer($event)" class="space-y-5">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- First Name -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-900 mb-2">First Name *</label>
                    <input
                      type="text"
                      [(ngModel)]="newCustomer.firstName"
                      name="customerFirstName"
                      placeholder="John"
                      required
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <!-- Last Name -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-900 mb-2">Last Name *</label>
                    <input
                      type="text"
                      [(ngModel)]="newCustomer.lastName"
                      name="customerLastName"
                      placeholder="Doe"
                      required
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <!-- Phone -->
                  <div class="md:col-span-2">
                    <label class="block text-sm font-semibold text-gray-900 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      [(ngModel)]="newCustomer.phone"
                      name="customerPhone"
                      placeholder="+1 (555) 123-4567"
                      required
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <!-- Email -->
                  <div class="md:col-span-2">
                    <label class="block text-sm font-semibold text-gray-900 mb-2">Email Address (Optional)</label>
                    <input
                      type="email"
                      [(ngModel)]="newCustomer.email"
                      name="customerEmail"
                      placeholder="john@example.com"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <!-- Error -->
                <div *ngIf="customerError()" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
                  {{ customerError() }}
                </div>

                <!-- Info Box -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p class="text-sm text-blue-900">
                    <span class="font-semibold">Auto-generated Login:</span> Customer will receive SMS/Viber with phone number and auto-generated password. They can change it on first login.
                  </p>
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  [disabled]="isCreatingCustomer()"
                  class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg font-bold hover:shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {{ isCreatingCustomer() ? 'Adding...' : 'Add Customer' }}
                </button>
              </form>
            </div>

            <!-- Success Message -->
            <div *ngIf="showAddCustomerSuccess()" class="bg-green-50 border border-green-200 rounded-lg p-4">
              <p class="text-green-900 font-semibold">✓ Customer added successfully! Notification sent via SMS/Viber and Email.</p>
            </div>
          </div>

          <!-- Add Vehicle Tab -->
          <div *ngIf="currentTab() === 'add-vehicle'" class="space-y-6">
            <div class="bg-white rounded-xl border border-gray-200 p-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Add New Vehicle</h2>
              <form (submit)="addVehicle($event)" class="space-y-5">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Make -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-900 mb-2">Make *</label>
                    <select
                      [(ngModel)]="newVehicle.make"
                      (change)="onMakeChange()"
                      name="vehicleMake"
                      required
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Make</option>
                      <option *ngFor="let make of carMakes" [value]="make">{{ make }}</option>
                    </select>
                  </div>

                  <!-- Model -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-900 mb-2">Model *</label>
                    <select
                      [(ngModel)]="newVehicle.model"
                      name="vehicleModel"
                      required
                      [disabled]="!newVehicle.make"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="">{{ newVehicle.make ? 'Select Model' : 'Select Make First' }}</option>
                      <option *ngFor="let model of getAvailableModels()" [value]="model">{{ model }}</option>
                    </select>
                  </div>

                  <!-- Year -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-900 mb-2">Year *</label>
                    <input
                      type="number"
                      [(ngModel)]="newVehicle.year"
                      name="vehicleYear"
                      placeholder="2024"
                      min="1900"
                      [max]="currentYear()"
                      required
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <!-- License Plate -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-900 mb-2">License Plate *</label>
                    <input
                      type="text"
                      [(ngModel)]="newVehicle.licensePlate"
                      name="vehiclePlate"
                      placeholder="ABC-1234"
                      required
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <!-- VIN -->
                  <div class="md:col-span-2">
                    <label class="block text-sm font-semibold text-gray-900 mb-2">VIN (Optional)</label>
                    <input
                      type="text"
                      [(ngModel)]="newVehicle.vin"
                      name="vehicleVin"
                      placeholder="19XFB2F58ME123456"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div *ngIf="vehicleError()" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
                  {{ vehicleError() }}
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  [disabled]="isCreatingVehicle()"
                  class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg font-bold hover:shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {{ isCreatingVehicle() ? 'Adding...' : 'Add Vehicle' }}
                </button>
              </form>
            </div>

            <!-- Success Message -->
            <div *ngIf="showAddVehicleSuccess()" class="bg-green-50 border border-green-200 rounded-lg p-4">
              <p class="text-green-900 font-semibold">✓ Vehicle added successfully!</p>
            </div>
          </div>

          <!-- Assign Vehicle Tab -->
          <div *ngIf="currentTab() === 'assign-vehicle'" class="space-y-6">
            <!-- Modal for Creating Vehicle -->
            <div *ngIf="showCreateVehicleModal()" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div class="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div class="px-6 py-4 border-b border-gray-200">
                  <h3 class="text-xl font-bold text-gray-900">Create New Vehicle</h3>
                  <p class="text-sm text-gray-600 mt-1">License Plate: {{ assignForm.licensePlate }}</p>
                </div>

                <form (submit)="confirmCreateVehicle($event)" class="p-6 space-y-4">
                  <!-- Make -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-900 mb-2">Make *</label>
                    <select
                      [(ngModel)]="newVehicleForAssign.make"
                      (change)="onCreateVehicleMakeChange()"
                      name="createMake"
                      required
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Make</option>
                      <option *ngFor="let make of carMakes" [value]="make">{{ make }}</option>
                    </select>
                  </div>

                  <!-- Model -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-900 mb-2">Model *</label>
                    <select
                      [(ngModel)]="newVehicleForAssign.model"
                      name="createModel"
                      required
                      [disabled]="!newVehicleForAssign.make"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="">{{ newVehicleForAssign.make ? 'Select Model' : 'Select Make First' }}</option>
                      <option *ngFor="let model of getCreateVehicleModels()" [value]="model">{{ model }}</option>
                    </select>
                  </div>

                  <!-- Year -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-900 mb-2">Year *</label>
                    <input
                      type="number"
                      [(ngModel)]="newVehicleForAssign.year"
                      name="createYear"
                      placeholder="2024"
                      min="1900"
                      [max]="currentYear()"
                      required
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <!-- VIN -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-900 mb-2">VIN (Optional)</label>
                    <input
                      type="text"
                      [(ngModel)]="newVehicleForAssign.vin"
                      name="createVin"
                      placeholder="19XFB2F58ME123456"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div *ngIf="assignVehicleError()" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
                    {{ assignVehicleError() }}
                  </div>

                  <!-- Buttons -->
                  <div class="flex gap-3 pt-4">
                    <button
                      type="button"
                      (click)="cancelCreateVehicle()"
                      class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      [disabled]="isCreatingAssignVehicle()"
                      class="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {{ isCreatingAssignVehicle() ? 'Creating...' : 'Create & Select' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div class="bg-white rounded-xl border border-gray-200 p-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Assign Vehicle to Customer</h2>
              <form (submit)="assignVehicle($event)" class="space-y-5">
                <!-- Search Customer -->
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">Search Customer (Name or Phone) *</label>
                  <div class="relative">
                    <input
                      type="text"
                      [(ngModel)]="assignForm.customerSearch"
                      (input)="searchCustomers()"
                      name="customerSearch"
                      placeholder="Enter customer name or phone..."
                      required
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <!-- Customer Search Results -->
                    <div *ngIf="showCustomerResults()" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      <div *ngFor="let customer of filteredCustomers()" class="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100" (click)="selectCustomer(customer)">
                        <p class="font-semibold text-gray-900">{{ getCustomerFullName(customer) }}</p>
                        <p class="text-sm text-gray-600">{{ customer.phone }}</p>
                      </div>
                      <div *ngIf="filteredCustomers().length === 0" class="px-4 py-3 text-gray-600">No customers found</div>
                    </div>
                  </div>
                </div>

                <!-- Selected Customer -->
                <div *ngIf="assignForm.selectedCustomer" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p class="text-sm text-gray-600">Selected Customer:</p>
                  <p class="font-bold text-blue-900">
                    {{ getCustomerFullName(assignForm.selectedCustomer) }} ({{ assignForm.selectedCustomer.phone }})
                  </p>
                </div>

                <!-- License Plate -->
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">License Plate *</label>
                  <div class="relative">
                    <input
                      type="text"
                      [(ngModel)]="assignForm.licensePlate"
                      (input)="searchVehicles()"
                      name="licensePlate"
                      placeholder="ABC-1234"
                      required
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <!-- Vehicle Search Results -->
                    <div *ngIf="showVehicleResults()" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      <div *ngFor="let vehicle of filteredVehicles()" class="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100" (click)="selectVehicle(vehicle)">
                        <p class="font-semibold text-gray-900">{{ vehicle.year }} {{ vehicle.make }} {{ vehicle.model }}</p>
                        <p class="text-sm text-gray-600">{{ vehicle.licensePlate }}</p>
                      </div>
                      <div *ngIf="filteredVehicles().length === 0 && assignForm.licensePlate" class="px-4 py-3">
                        <p class="text-gray-600 mb-2">No existing vehicle found</p>
                        <button
                          type="button"
                          (click)="openCreateVehicleModal()"
                          class="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                        >
                          ✓ Create new vehicle with this plate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Selected Vehicle -->
                <div *ngIf="assignForm.selectedVehicle" class="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p class="text-sm text-gray-600">Selected Vehicle:</p>
                  <p class="font-bold text-green-900">{{ assignForm.selectedVehicle.year }} {{ assignForm.selectedVehicle.make }} {{ assignForm.selectedVehicle.model }}</p>
                  <p class="text-sm text-green-700">{{ assignForm.selectedVehicle.licensePlate }}</p>
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  [disabled]="!assignForm.selectedCustomer || !assignForm.selectedVehicle"
                  class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Assign Vehicle
                </button>
              </form>
            </div>

            <!-- Success Message -->
            <div *ngIf="showAssignSuccess()" class="bg-green-50 border border-green-200 rounded-lg p-4">
              <p class="text-green-900 font-semibold">✓ Vehicle assigned successfully!</p>
            </div>
          </div>

          <!-- Customers List -->
          <div *ngIf="currentTab() === 'customers-list'" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-2xl font-bold text-gray-900">All Customers</h2>
            </div>
            <div *ngIf="customers().length > 0" class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-gray-50 border-b border-gray-200">
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Phone</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Added</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let customer of customers()" class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 font-semibold text-gray-900">{{ getCustomerFullName(customer) }}</td>
                    <td class="px-6 py-4 text-gray-900">{{ customer.phone }}</td>
                    <td class="px-6 py-4 text-gray-900">{{ customer.email || '-' }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ customer.createdAt || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div *ngIf="customers().length === 0" class="px-6 py-12 text-center text-gray-600">
              <p>No customers added yet</p>
            </div>
          </div>

          <!-- Vehicles List -->
          <div *ngIf="currentTab() === 'vehicles-list'" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 class="text-2xl font-bold text-gray-900">All Vehicles</h2>
              <div class="relative w-72">
                <input
                  type="text"
                  [(ngModel)]="vehicleSearchQuery"
                  (input)="filterAndSortVehicles()"
                  placeholder="Search by customer name, phone, or plate..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <svg class="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-6a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div *ngIf="filteredAndSortedVehicles().length > 0" class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-gray-50 border-b border-gray-200">
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100 transition-colors" (click)="sortBy('lastVisitedDate')">
                      Last Visited {{ sortDirection() === 'asc' ? '▲' : '▼' }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Assigned Customer</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Vehicle</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">License Plate</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">VIN</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Added</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let vehicle of filteredAndSortedVehicles()" class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm text-gray-600">{{ vehicle.lastVisitedDate || '-' }}</td>
                    <td class="px-6 py-4 font-semibold text-gray-900">{{ getCustomerName(vehicle.customerId) }}</td>
                    <td class="px-6 py-4 font-semibold text-gray-900">{{ vehicle.year }} {{ vehicle.make }} {{ vehicle.model }}</td>
                    <td class="px-6 py-4 text-gray-900 font-mono">{{ vehicle.licensePlate }}</td>
                    <td class="px-6 py-4 text-gray-900 font-mono text-sm">{{ vehicle.vin || '-' }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ vehicle.createdAt }}</td>
                    <td class="px-6 py-4">
                      <button (click)="viewPastServices(vehicle)" class="text-blue-600 hover:text-blue-700 font-semibold text-sm hover:underline transition-colors">
                        Past Services
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div *ngIf="filteredAndSortedVehicles().length === 0" class="px-6 py-12 text-center text-gray-600">
              <p *ngIf="vehicles().length === 0">No vehicles added yet</p>
              <p *ngIf="vehicles().length > 0">No vehicles found matching your search criteria.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class MechanicPanelComponent {
  private readonly customersService = inject(CustomersService);
  private readonly vehiclesService = inject(VehiclesService);
  private readonly auth = inject(AuthService);

  currentTab = signal<'add-customer' | 'add-vehicle' | 'assign-vehicle' | 'customers-list' | 'vehicles-list'>('add-customer');

  // Car data
  carMakes = getCarMakes();
  availableModels = signal<string[]>([]);
  createVehicleModels = signal<string[]>([]);
  currentYear = signal(new Date().getFullYear());

  // Customer form
  newCustomer = { firstName: '', lastName: '', phone: '', email: '' };
  customers = signal<UiCustomer[]>([]);
  showAddCustomerSuccess = signal(false);
  isCreatingCustomer = signal(false);
  customerError = signal<string | null>(null);

  // Vehicle form
  newVehicle = { make: '', model: '', year: new Date().getFullYear(), licensePlate: '', vin: '' };
  vehicles = signal<UiVehicle[]>([]);
  showAddVehicleSuccess = signal(false);
  isCreatingVehicle = signal(false);
  vehicleError = signal<string | null>(null);

  // Assignment form
  assignForm = {
    customerSearch: '',
    selectedCustomer: null as UiCustomer | null,
    licensePlate: '',
    selectedVehicle: null as UiVehicle | null
  };
  filteredCustomers = signal<UiCustomer[]>([]);
  filteredVehicles = signal<UiVehicle[]>([]);
  showCustomerResults = signal(false);
  showVehicleResults = signal(false);
  showAssignSuccess = signal(false);
  showCreateVehicleModal = signal(false);
  assignVehicleError = signal<string | null>(null);
  isCreatingAssignVehicle = signal(false);

  // Create vehicle in assign flow
  newVehicleForAssign = { make: '', model: '', year: new Date().getFullYear(), vin: '' };

  // Sample data (replace with API calls)
  customerVehicles = signal<CustomerVehicle[]>([]);

  // Vehicles list search and sort
  vehicleSearchQuery = signal('');
  sortColumn = signal<'lastVisitedDate'>('lastVisitedDate');
  sortDirection = signal<'asc' | 'desc'>('desc');

  // Computed filtered and sorted vehicles
  filteredAndSortedVehicles = computed(() => {
    const query = this.vehicleSearchQuery().toLowerCase();
    const vehicles = this.vehicles();

    const filtered = vehicles.filter(vehicle => {
      if (!query) return true;

      const customerName = this.getCustomerName(vehicle.customerId).toLowerCase();
      const customerPhone = this.getCustomerPhone(vehicle.customerId).toLowerCase();
      const licensePlate = vehicle.licensePlate.toLowerCase();

      return customerName.includes(query) || customerPhone.includes(query) || licensePlate.includes(query);
    });

    const sorted = filtered.sort((a, b) => {
      if (this.sortColumn() === 'lastVisitedDate') {
        const dateA = a.lastVisitedDate ? new Date(a.lastVisitedDate).getTime() : 0;
        const dateB = b.lastVisitedDate ? new Date(b.lastVisitedDate).getTime() : 0;
        return this.sortDirection() === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });

    return sorted;
  });

  constructor() {
    this.loadInitialData();
    this.fetchCustomers();
  }

  loadInitialData() {
    this.vehicles.set([]);
    this.customerVehicles.set([]);
  }

  fetchCustomers() {
    this.customersService.list().subscribe({
      next: customers => {
        this.customers.set(customers.map(customer => this.toUiCustomer(customer)));
      },
      error: err => {
        console.error('Failed to load customers', err);
      }
    });
  }

  private toUiCustomer(customer: ApiCustomer): UiCustomer {
    return {
      ...customer,
      createdAt: new Date().toLocaleDateString()
    };
  }

  setTab(tab: any) {
    this.currentTab.set(tab);
  }

  onMakeChange() {
    this.newVehicle.model = '';
    this.availableModels.set(getCarModels(this.newVehicle.make));
  }

  getAvailableModels(): string[] {
    return getCarModels(this.newVehicle.make);
  }

  onCreateVehicleMakeChange() {
    this.newVehicleForAssign.model = '';
    this.createVehicleModels.set(getCarModels(this.newVehicleForAssign.make));
  }

  getCreateVehicleModels(): string[] {
    return getCarModels(this.newVehicleForAssign.make);
  }

  addCustomer(e: Event) {
    e.preventDefault();
    if (!this.newCustomer.firstName || !this.newCustomer.lastName) {
      this.customerError.set('First and last name are required.');
      return;
    }

    const payload: CustomerCreate = {
      first_name: this.newCustomer.firstName.trim(),
      last_name: this.newCustomer.lastName.trim(),
      phone: this.newCustomer.phone.trim(),
      email: this.newCustomer.email ? this.newCustomer.email.trim() : null
    };

    this.isCreatingCustomer.set(true);
    this.customerError.set(null);

    this.customersService
      .create(payload)
      .pipe(finalize(() => this.isCreatingCustomer.set(false)))
      .subscribe({
        next: created => {
          this.customers.update(c => [...c, this.toUiCustomer(created)]);
          this.newCustomer = { firstName: '', lastName: '', phone: '', email: '' };
          this.showAddCustomerSuccess.set(true);
          setTimeout(() => this.showAddCustomerSuccess.set(false), 3000);
        },
        error: err => {
          const detail = err?.error?.detail || 'Failed to add customer. Please try again.';
          this.customerError.set(detail);
        }
      });
  }

  addVehicle(e: Event) {
    e.preventDefault();
    const shopId = this.auth.user()?.shop_id;
    if (!shopId) {
      this.vehicleError.set('You need an associated shop to register vehicles.');
      return;
    }

    const payload = {
      plate: this.newVehicle.licensePlate.trim().toUpperCase(),
      make: this.newVehicle.make || null,
      model: this.newVehicle.model || null,
      year: this.newVehicle.year,
      vin: this.newVehicle.vin || null,
      shop_id: shopId
    };

    if (!payload.plate) {
      this.vehicleError.set('License plate is required.');
      return;
    }

    this.vehicleError.set(null);
    this.isCreatingVehicle.set(true);

    this.vehiclesService
      .create(payload)
      .pipe(finalize(() => this.isCreatingVehicle.set(false)))
      .subscribe({
        next: created => {
          const uiVehicle = this.toUiVehicle(created);
          this.vehicles.update(v => [...v, uiVehicle]);
          this.newVehicle = { make: '', model: '', year: new Date().getFullYear(), licensePlate: '', vin: '' };
          this.showAddVehicleSuccess.set(true);
          setTimeout(() => this.showAddVehicleSuccess.set(false), 3000);
        },
        error: err => {
          const detail = err?.error?.detail || 'Failed to add vehicle. Please try again.';
          this.vehicleError.set(detail);
        }
      });
  }

  searchCustomers() {
    if (!this.assignForm.customerSearch) {
      this.showCustomerResults.set(false);
      this.filteredCustomers.set([]);
      return;
    }

    const search = this.assignForm.customerSearch.toLowerCase();
    const results = this.customers().filter(c =>
      this.getCustomerFullName(c).toLowerCase().includes(search) || c.phone.includes(search)
    );
    this.filteredCustomers.set(results);
    this.showCustomerResults.set(true);
  }

  selectCustomer(customer: UiCustomer) {
    this.assignForm.selectedCustomer = customer;
    this.assignForm.customerSearch = this.getCustomerFullName(customer);
    this.showCustomerResults.set(false);
  }

  searchVehicles() {
    if (!this.assignForm.licensePlate) {
      this.showVehicleResults.set(false);
      this.filteredVehicles.set([]);
      return;
    }

    const search = this.assignForm.licensePlate.toUpperCase();
    const results = this.vehicles().filter(v =>
      v.licensePlate.includes(search)
    );
    this.filteredVehicles.set(results);
    this.showVehicleResults.set(true);
  }

  selectVehicle(vehicle: UiVehicle) {
    this.assignForm.selectedVehicle = vehicle;
    this.assignForm.licensePlate = vehicle.licensePlate;
    this.showVehicleResults.set(false);
  }

  openCreateVehicleModal() {
    this.newVehicleForAssign = { make: '', model: '', year: new Date().getFullYear(), vin: '' };
    this.createVehicleModels.set([]);
    this.assignVehicleError.set(null);
    this.showCreateVehicleModal.set(true);
  }

  cancelCreateVehicle() {
    this.assignVehicleError.set(null);
    this.showCreateVehicleModal.set(false);
  }

  confirmCreateVehicle(e: Event) {
    e.preventDefault();

    // Validate required fields
    if (!this.newVehicleForAssign.make || !this.newVehicleForAssign.model) {
      alert('Please select both Make and Model');
      return;
    }
    const shopId = this.auth.user()?.shop_id;
    if (!shopId) {
      this.assignVehicleError.set('You need an associated shop to register vehicles.');
      return;
    }

    const plate = this.assignForm.licensePlate.trim().toUpperCase();
    if (!plate) {
      this.assignVehicleError.set('Enter a license plate to create a vehicle.');
      return;
    }

    const payload = {
      plate,
      make: this.newVehicleForAssign.make,
      model: this.newVehicleForAssign.model,
      year: this.newVehicleForAssign.year,
      vin: this.newVehicleForAssign.vin || null,
      shop_id: shopId
    };

    this.assignVehicleError.set(null);
    this.isCreatingAssignVehicle.set(true);

    this.vehiclesService
      .create(payload)
      .pipe(finalize(() => this.isCreatingAssignVehicle.set(false)))
      .subscribe({
        next: created => {
          const uiVehicle = this.toUiVehicle(created);
          this.vehicles.update(v => [...v, uiVehicle]);
          this.assignForm.selectedVehicle = uiVehicle;
          this.assignForm.licensePlate = uiVehicle.licensePlate;
          this.showCreateVehicleModal.set(false);
          this.showVehicleResults.set(false);
        },
        error: err => {
          const detail = err?.error?.detail || 'Failed to create vehicle. Please try again.';
          this.assignVehicleError.set(detail);
        }
      });
  }

  assignVehicle(e: Event) {
    e.preventDefault();

    if (!this.assignForm.selectedCustomer || !this.assignForm.selectedVehicle) {
      return;
    }

    const assignment: CustomerVehicle = {
      customerId: this.assignForm.selectedCustomer.id,
      vehicleId: this.assignForm.selectedVehicle.id,
      assignedAt: new Date().toISOString()
    };

    this.customerVehicles.update(cv => [...cv, assignment]);

    // Update vehicle with customer assignment and last visited date
    this.vehicles.update(vList =>
      vList.map(v =>
        v.id === this.assignForm.selectedVehicle!.id
          ? { ...v, customerId: assignment.customerId, lastVisitedDate: assignment.assignedAt }
          : v
      )
    );

    this.showAssignSuccess.set(true);
    setTimeout(() => this.showAssignSuccess.set(false), 3000);

    // Reset form
    this.assignForm = {
      customerSearch: '',
      selectedCustomer: null,
      licensePlate: '',
      selectedVehicle: null
    };

    console.log('Vehicle assigned:', assignment);
  }

  getCustomerFullName(customer: UiCustomer): string {
    return `${customer.first_name} ${customer.last_name}`.trim();
  }

  getCustomerName(customerId?: number | null): string {
    if (!customerId) return '-';
    const customer = this.customers().find(c => c.id === customerId);
    return customer ? this.getCustomerFullName(customer) : '-';
  }

  getCustomerPhone(customerId?: number | null): string {
    if (!customerId) return '';
    const customer = this.customers().find(c => c.id === customerId);
    return customer ? customer.phone : '';
  }

  filterAndSortVehicles() {
    this.filteredAndSortedVehicles();
  }

  sortBy(column: 'lastVisitedDate') {
    if (this.sortColumn() === column) {
      this.sortDirection.update(dir => dir === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('desc');
    }
  }

  viewPastServices(vehicle: UiVehicle) {
    const customerName = this.getCustomerName(vehicle.customerId);
    const vehicleInfo = `${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`;
    alert(`Viewing past services for ${vehicleInfo}\nAssigned to: ${customerName}`);
  }

  private toUiVehicle(vehicle: ApiVehicle): UiVehicle {
    return {
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      licensePlate: vehicle.plate,
      vin: vehicle.vin,
      createdAt: new Date(vehicle.first_seen_at).toLocaleDateString(),
      customerId: vehicle.current_owner_id,
      lastVisitedDate: vehicle.last_seen_at
    };
  }
}

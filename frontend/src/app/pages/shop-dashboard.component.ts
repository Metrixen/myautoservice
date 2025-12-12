import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-shop-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <!-- Top KPIs -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Total Vehicles -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-medium mb-1">Total Vehicles</p>
              <p class="text-3xl font-bold text-gray-900">1,248</p>
              <p class="text-green-600 text-sm mt-2 font-medium">+12% this month</p>
            </div>
            <div class="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Active Appointments -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-medium mb-1">Active Appointments</p>
              <p class="text-3xl font-bold text-gray-900">24</p>
              <p class="text-amber-600 text-sm mt-2 font-medium">5 today</p>
            </div>
            <div class="w-14 h-14 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Customers -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-medium mb-1">Total Customers</p>
              <p class="text-3xl font-bold text-gray-900">342</p>
              <p class="text-green-600 text-sm mt-2 font-medium">+8 new this week</p>
            </div>
            <div class="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM16 11a4 4 0 11-8 0 4 4 0 018 0zM9 20H3v-2a6 6 0 0112 0v2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Pending Reminders -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-medium mb-1">Pending Reminders</p>
              <p class="text-3xl font-bold text-gray-900">87</p>
              <p class="text-red-600 text-sm mt-2 font-medium">12 overdue</p>
            </div>
            <div class="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Appointments -->
        <div class="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900">Today's Appointments</h3>
            <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm">
              Log Appointment
            </button>
          </div>
          <div class="divide-y divide-gray-200">
            <div *ngFor="let appointment of upcomingAppointments" class="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div class="flex items-start justify-between">
                <div>
                  <p class="font-semibold text-gray-900">{{ appointment.customerName }}</p>
                  <p class="text-sm text-gray-600 mt-1">{{ appointment.vehicleInfo }}</p>
                  <p class="text-xs text-gray-500 mt-2">Service: {{ appointment.service }}</p>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-blue-600">{{ appointment.time }}</p>
                  <span class="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {{ appointment.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div class="space-y-3">
            <a routerLink="/mechanic" class="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg hover:shadow-md transition-shadow group">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                  </svg>
                </div>
                <span class="font-semibold text-gray-900">Mechanic Panel</span>
              </div>
              <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>

            <button class="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg hover:shadow-md transition-shadow group">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <span class="font-semibold text-gray-900">Register Vehicle</span>
              </div>
              <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>

            <button class="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg hover:shadow-md transition-shadow group">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                </div>
                <span class="font-semibold text-gray-900">Generate Reminder</span>
              </div>
              <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>

            <button class="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg hover:shadow-md transition-shadow group">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <span class="font-semibold text-gray-900">Schedule Appointment</span>
              </div>
              <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Vehicles -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-900">Recent Vehicles</h3>
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm">
            Register Vehicle
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50">
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Vehicle</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Owner</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">License Plate</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">VIN</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Last Service</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let vehicle of recentVehicles" class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4">
                  <p class="font-semibold text-gray-900">{{ vehicle.name }}</p>
                  <p class="text-sm text-gray-600">{{ vehicle.year }}</p>
                </td>
                <td class="px-6 py-4 text-gray-900">{{ vehicle.owner }}</td>
                <td class="px-6 py-4 text-gray-900 font-mono">{{ vehicle.plate }}</td>
                <td class="px-6 py-4 text-gray-900 font-mono text-sm">{{ vehicle.vin.substring(0, 10) }}...</td>
                <td class="px-6 py-4">
                  <span [ngClass]="getStatusClass(vehicle.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                    {{ vehicle.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-gray-900">{{ vehicle.lastService }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: []
})


export class ShopDashboardComponent {
  upcomingAppointments = [
    {
      customerName: 'John Smith',
      vehicleInfo: '2021 Honda Civic - ABC-1234',
      service: 'Oil Change & Filter',
      time: '9:00 AM',
      status: 'Confirmed'
    },
    {
      customerName: 'Sarah Johnson',
      vehicleInfo: '2019 Toyota Camry - XYZ-5678',
      service: 'Brake Inspection',
      time: '10:30 AM',
      status: 'In Progress'
    },
    {
      customerName: 'Mike Davis',
      vehicleInfo: '2022 Ford F-150 - DEF-9012',
      service: 'Tire Rotation',
      time: '1:00 PM',
      status: 'Scheduled'
    },
    {
      customerName: 'Emma Wilson',
      vehicleInfo: '2020 Chevrolet Malibu - GHI-3456',
      service: 'Engine Diagnostics',
      time: '2:30 PM',
      status: 'Scheduled'
    }
  ];

  recentVehicles = [
    {
      name: '2021 Honda Civic',
      year: 'Blue Sedan',
      owner: 'John Smith',
      plate: 'ABC-1234',
      vin: '19XFB2F58ME123456',
      status: 'Active',
      lastService: 'Dec 15, 2024'
    },
    {
      name: '2019 Toyota Camry',
      year: 'Silver Sedan',
      owner: 'Sarah Johnson',
      plate: 'XYZ-5678',
      vin: '4T1BF1AK5CU012345',
      status: 'Active',
      lastService: 'Dec 10, 2024'
    },
    {
      name: '2022 Ford F-150',
      year: 'Red Truck',
      owner: 'Mike Davis',
      plate: 'DEF-9012',
      vin: '1FTFW1ET4DFC23456',
      status: 'Pending Service',
      lastService: 'Nov 20, 2024'
    },
    {
      name: '2020 Chevrolet Malibu',
      year: 'Black Sedan',
      owner: 'Emma Wilson',
      plate: 'GHI-3456',
      vin: '1G1ZD53846F109876',
      status: 'Active',
      lastService: 'Dec 8, 2024'
    },
    {
      name: '2023 Mazda CX-5',
      year: 'White SUV',
      owner: 'Robert Brown',
      plate: 'JKL-7890',
      vin: 'JM2DJ5S47M0234567',
      status: 'Due for Service',
      lastService: 'Sep 15, 2024'
    }
  ];

  getStatusClass(status: string) {
    const classes: Record<string, string> = {
      'Active': 'bg-green-100 text-green-700',
      'Pending Service': 'bg-amber-100 text-amber-700',
      'Due for Service': 'bg-red-100 text-red-700',
      'Inactive': 'bg-gray-100 text-gray-700'
    };
    return classes[status] || 'bg-gray-100 text-gray-700';
  }
}

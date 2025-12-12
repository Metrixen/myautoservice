import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout.component';
import { LandingPageComponent } from './pages/landing-page.component';
import { LoginPageComponent } from './pages/login-page.component';
import { ShopRegisterPageComponent } from './pages/shop-register-page.component';
import { ShopDashboardComponent } from './pages/shop-dashboard.component';
import { CustomerDashboardComponent } from './pages/customer-dashboard.component';
import { PlaceholderPageComponent } from './pages/placeholder-page.component';
import { MechanicPanelComponent } from './pages/mechanic-panel.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginPageComponent },
      { path: 'shop-register', component: ShopRegisterPageComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      { path: 'shop', component: ShopDashboardComponent },
      { path: 'customer', component: CustomerDashboardComponent },
      { path: 'vehicles', component: PlaceholderPageComponent },
      { path: 'customers', component: PlaceholderPageComponent },
      { path: 'appointments', component: PlaceholderPageComponent },
      { path: 'reminders', component: PlaceholderPageComponent },
      { path: 'analytics', component: PlaceholderPageComponent },
      { path: '', redirectTo: 'shop', pathMatch: 'full' }
    ]
  },
  { path: 'mechanic', component: MechanicPanelComponent },
  { path: '**', redirectTo: '' }
];

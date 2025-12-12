import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { API_BASE_URL } from "./api.tokens";
import { appEnvironment } from "./app.environment";
import type { Customer, CustomerCreate } from "./models/customer.model";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root"
})
export class CustomersService {
  private readonly http = inject(HttpClient);
  private readonly explicitApiBase = inject(API_BASE_URL, { optional: true });
  private readonly apiBaseUrl = this.explicitApiBase || appEnvironment.apiBaseUrl;
  private readonly baseUrl = `${this.apiBaseUrl}/customers`;
  private readonly auth = inject(AuthService);

  create(payload: CustomerCreate): Observable<Customer> {
    return this.http.post<Customer>(this.baseUrl, payload, { headers: this.authHeaders('POST /customers') });
  }

  list(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.baseUrl, { headers: this.authHeaders('GET /customers') });
  }

  getMyProfile(): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/me`, { headers: this.authHeaders('GET /customers/me') });
  }

  private authHeaders(context: string): HttpHeaders {
    const token = this.auth.getAccessToken();
    if (!token) {
      console.warn(`[CustomersService] Missing access token for ${context}. User may not be logged in.`);
    }
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
}

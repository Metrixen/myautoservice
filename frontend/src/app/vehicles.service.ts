import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { API_BASE_URL } from "./api.tokens";
import { appEnvironment } from "./app.environment";
import { AuthService } from "./auth.service";
import type { Vehicle, VehicleCreatePayload } from "./models/vehicle.model";

@Injectable({
  providedIn: "root"
})
export class VehiclesService {
  private readonly http = inject(HttpClient);
  private readonly explicitApiBase = inject(API_BASE_URL, { optional: true });
  private readonly apiBaseUrl = this.explicitApiBase || appEnvironment.apiBaseUrl;
  private readonly baseUrl = `${this.apiBaseUrl}/vehicles`;
  private readonly auth = inject(AuthService);

  create(payload: VehicleCreatePayload): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.baseUrl, payload, {
      headers: this.authHeaders("POST /vehicles")
    });
  }

  listByOwner(ownerId: number): Observable<Vehicle[]> {
    const params = new HttpParams().set("owner_id", ownerId);
    return this.http.get<Vehicle[]>(this.baseUrl, {
      params,
      headers: this.authHeaders("GET /vehicles?owner_id")
    });
  }

  private authHeaders(context: string): HttpHeaders {
    const token = this.auth.getAccessToken();
    if (!token) {
      console.warn(`[VehiclesService] Missing access token for ${context}. User may not be logged in.`);
    }
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
}

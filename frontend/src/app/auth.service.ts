import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, computed, inject, signal } from "@angular/core";
import { catchError, Observable, of, switchMap, tap } from "rxjs";

import { API_BASE_URL } from "./api.tokens";
import { appEnvironment } from "./app.environment";
import { User } from "./user.model";

interface TokenResponse {
  access_token: string;
  token_type: string;
}

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly explicitApiBase = inject(API_BASE_URL, { optional: true });
  private readonly apiBaseUrl = this.explicitApiBase || appEnvironment.apiBaseUrl;
  private readonly storageKey = "myautoservice_access_token";

  private readonly currentUserSignal = signal<User | null>(null);
  readonly user = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());

  constructor() {
    if (this.getAccessToken()) {
      this.loadProfile().subscribe();
    }
  }

  login(identifier: string, password: string): Observable<User> {
    const body = new URLSearchParams();
    body.set("username", identifier);
    body.set("password", password);
    body.set("grant_type", "password");

    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
    });

    return this.http
      .post<TokenResponse>(`${this.apiBaseUrl}/auth/token`, body.toString(), { headers })
      .pipe(
        tap((token) => this.persistToken(token.access_token)),
        switchMap(() => this.fetchCurrentUser())
      );
  }

  loadProfile(): Observable<User | null> {
    const token = this.getAccessToken();
    if (!token) {
      this.currentUserSignal.set(null);
      return of(null);
    }

    return this.fetchCurrentUser().pipe(
      catchError(() => {
        this.logout();
        return of(null);
      })
    );
  }

  fetchCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiBaseUrl}/auth/me`).pipe(
      tap((user) => this.currentUserSignal.set(user))
    );
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem(this.storageKey);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  private persistToken(token: string): void {
    localStorage.setItem(this.storageKey, token);
  }
}

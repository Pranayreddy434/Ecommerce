import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserSession } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly storageKey = 'shopverse-session';
  private readonly sessionSignal = signal<UserSession | null>(this.readSession());

  readonly session = computed(() => this.sessionSignal());
  readonly isAuthenticated = computed(() => !!this.sessionSignal()?.token);

  login(payload: { email: string; password: string }) {
    return this.http.post<UserSession>(`${environment.apiUrl}/auth/login`, payload).pipe(
      tap((session) => this.persist(session))
    );
  }

  register(payload: { fullName: string; email: string; password: string }) {
    return this.http.post<UserSession>(`${environment.apiUrl}/auth/register`, payload).pipe(
      tap((session) => this.persist(session))
    );
  }

  logout() {
    localStorage.removeItem(this.storageKey);
    this.sessionSignal.set(null);
    this.router.navigateByUrl('/login');
  }

  getToken() {
    return this.sessionSignal()?.token ?? null;
  }

  private persist(session: UserSession) {
    localStorage.setItem(this.storageKey, JSON.stringify(session));
    this.sessionSignal.set(session);
  }

  private readSession(): UserSession | null {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? (JSON.parse(raw) as UserSession) : null;
  }
}

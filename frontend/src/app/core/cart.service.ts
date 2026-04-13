import { Injectable, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Cart } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  readonly cart = signal<Cart | null>(null);

  constructor() {
    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.loadCart();
      } else {
        this.cart.set(null);
      }
    });
  }

  loadCart() {
    this.http.get<Cart>(`${environment.apiUrl}/cart`).subscribe({
      next: (cart) => this.cart.set(cart),
      error: () => this.cart.set(null)
    });
  }

  addToCart(productId: string, quantity = 1) {
    return this.http.post<Cart>(`${environment.apiUrl}/cart/items`, { productId, quantity });
  }

  updateQuantity(productId: string, quantity: number) {
    return this.http.put<Cart>(`${environment.apiUrl}/cart/items`, { productId, quantity });
  }

  removeItem(productId: string) {
    return this.http.delete<Cart>(`${environment.apiUrl}/cart/items/${productId}`);
  }

  itemCount() {
    return this.cart()?.items.reduce((count, item) => count + item.quantity, 0) ?? 0;
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Order } from '../models/models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);

  checkout(payload: { shippingAddress: string; paymentMethod: string }) {
    return this.http.post<Order>(`${environment.apiUrl}/orders/checkout`, payload);
  }

  getOrders() {
    return this.http.get<Order[]>(`${environment.apiUrl}/orders`);
  }
}

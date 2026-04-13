import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { OrderService } from '../core/order.service';
import { Order } from '../models/models';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, MatCardModule, MatChipsModule],
  template: `
    <section class="page-shell orders-shell">
      <div class="orders-header">
        <h1 class="section-title">Orders</h1>
        <p class="section-copy">Track recently placed orders with payment references and status labels.</p>
      </div>

      <div class="orders-grid">
        @for (order of orders(); track order.id) {
          <mat-card class="glass-card order-card">
            <div class="order-head">
              <div>
                <h3>Order #{{ order.id.slice(0, 8).toUpperCase() }}</h3>
                <span class="muted">{{ order.createdAt | date:'medium' }}</span>
              </div>
              <mat-chip-set>
                <mat-chip>{{ order.orderStatus }}</mat-chip>
                <mat-chip color="primary">{{ order.paymentStatus }}</mat-chip>
              </mat-chip-set>
            </div>

            <p class="muted">Payment ref: {{ order.paymentReference }}</p>
            <p class="muted">{{ order.shippingAddress }}</p>

            @for (item of order.items; track item.productId) {
              <div class="order-item">
                <span>{{ item.productName }} x {{ item.quantity }}</span>
                <strong>{{ item.price | currency:'INR':'symbol':'1.0-0' }}</strong>
              </div>
            }

            <div class="order-total">
              <span>Total</span>
              <strong>{{ order.totalAmount | currency:'INR':'symbol':'1.0-0' }}</strong>
            </div>
          </mat-card>
        } @empty {
          <div class="glass-card empty">No orders yet. Complete checkout to see your order history.</div>
        }
      </div>
    </section>
  `,
  styles: [`
    .orders-shell {
      padding: 28px 0;
    }

    .orders-grid {
      display: grid;
      gap: 18px;
      margin-top: 20px;
    }

    .order-card {
      padding: 22px;
    }

    .order-head,
    .order-item,
    .order-total {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: center;
    }

    .order-item {
      padding: 8px 0;
      border-bottom: 1px solid var(--border);
    }

    .order-total {
      margin-top: 16px;
      font-size: 1.1rem;
    }

    .empty {
      padding: 32px;
      text-align: center;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersPageComponent {
  private readonly orderService = inject(OrderService);
  private readonly destroyRef = inject(DestroyRef);
  readonly orders = signal<Order[]>([]);

  constructor() {
    this.orderService.getOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((orders) => this.orders.set(orders));
  }
}

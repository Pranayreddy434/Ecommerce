import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../core/cart.service';
import { CartItem } from '../models/models';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink, MatButtonModule, MatIconModule],
  template: `
    <section class="page-shell cart-layout">
      <div class="cart-list glass-card">
        <h1 class="section-title">Your Cart</h1>
        @if (cartService.cart(); as cart) {
          @for (item of cart.items; track item.productId) {
            <article class="cart-item">
              <img [src]="item.imageUrl" [alt]="item.productName">
              <div class="cart-meta">
                <h3>{{ item.productName }}</h3>
                <span class="muted">{{ item.price | currency:'INR':'symbol':'1.0-0' }}</span>
              </div>
              <div class="quantity-actions">
                <button mat-icon-button (click)="changeQty(item, item.quantity - 1)" [disabled]="item.quantity <= 1">
                  <mat-icon>remove</mat-icon>
                </button>
                <strong>{{ item.quantity }}</strong>
                <button mat-icon-button (click)="changeQty(item, item.quantity + 1)">
                  <mat-icon>add</mat-icon>
                </button>
              </div>
              <button mat-button color="warn" type="button" (click)="remove(item.productId)">Remove</button>
            </article>
          } @empty {
            <p class="muted">Your cart is empty. Start shopping to see items here.</p>
          }
        }
      </div>

      <aside class="glass-card cart-summary">
        <h2>Order Summary</h2>
        <div class="summary-row">
          <span>Items</span>
          <strong>{{ cartService.itemCount() }}</strong>
        </div>
        <div class="summary-row">
          <span>Subtotal</span>
          <strong>{{ (cartService.cart()?.totalAmount ?? 0) | currency:'INR':'symbol':'1.0-0' }}</strong>
        </div>
        <div class="summary-row">
          <span>Shipping</span>
          <strong>{{ 99 | currency:'INR':'symbol':'1.0-0' }}</strong>
        </div>
        <button mat-flat-button color="primary" class="checkout-btn" type="button" [disabled]="cartService.itemCount() === 0" (click)="router.navigateByUrl('/checkout')">
          Continue to Checkout
        </button>
      </aside>
    </section>
  `,
  styles: [`
    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 24px;
      padding: 28px 0;
    }

    .cart-list,
    .cart-summary {
      padding: 24px;
    }

    .cart-item {
      display: grid;
      grid-template-columns: 100px 1fr auto auto;
      gap: 16px;
      align-items: center;
      padding: 18px 0;
      border-bottom: 1px solid var(--border);
    }

    .cart-item img {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 18px;
    }

    .quantity-actions,
    .summary-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .summary-row {
      margin-bottom: 16px;
    }

    .checkout-btn {
      width: 100%;
      margin-top: 16px;
    }

    @media (max-width: 960px) {
      .cart-layout {
        grid-template-columns: 1fr;
      }

      .cart-item {
        grid-template-columns: 1fr;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartPageComponent {
  readonly cartService = inject(CartService);
  readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  changeQty(item: CartItem, quantity: number) {
    this.cartService.updateQuantity(item.productId, quantity)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((cart) => this.cartService.cart.set(cart));
  }

  remove(productId: string) {
    this.cartService.removeItem(productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((cart) => this.cartService.cart.set(cart));
  }
}

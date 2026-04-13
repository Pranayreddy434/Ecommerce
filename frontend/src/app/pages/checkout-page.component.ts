import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrderService } from '../core/order.service';
import { CartService } from '../core/cart.service';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSnackBarModule],
  template: `
    <section class="page-shell checkout-layout">
      <mat-card class="glass-card checkout-card">
        <h1 class="section-title">Checkout</h1>
        <p class="section-copy">Complete a mock payment flow and convert your cart into an order.</p>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline">
            <mat-label>Shipping address</mat-label>
            <textarea matInput rows="4" formControlName="shippingAddress"></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Payment method</mat-label>
            <input matInput formControlName="paymentMethod" placeholder="UPI / Card / Wallet">
          </mat-form-field>

          <button mat-flat-button color="primary" type="submit">Place Order</button>
        </form>
      </mat-card>

      <aside class="glass-card checkout-summary">
        <h2>Summary</h2>
        <div class="summary-row">
          <span>Subtotal</span>
          <strong>{{ (cartService.cart()?.totalAmount ?? 0) | currency:'INR':'symbol':'1.0-0' }}</strong>
        </div>
        <div class="summary-row">
          <span>Shipping</span>
          <strong>{{ 99 | currency:'INR':'symbol':'1.0-0' }}</strong>
        </div>
        <div class="summary-row total">
          <span>Total</span>
          <strong>{{ (cartService.cart()?.totalAmount ?? 0) + 99 | currency:'INR':'symbol':'1.0-0' }}</strong>
        </div>
      </aside>
    </section>
  `,
  styles: [`
    .checkout-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 24px;
      padding: 28px 0;
    }

    .checkout-card,
    .checkout-summary {
      padding: 24px;
    }

    form {
      display: grid;
      gap: 14px;
      margin-top: 20px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .total {
      font-size: 1.15rem;
    }

    @media (max-width: 960px) {
      .checkout-layout {
        grid-template-columns: 1fr;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutPageComponent {
  readonly cartService = inject(CartService);
  private readonly fb = inject(FormBuilder);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  readonly form = this.fb.group({
    shippingAddress: ['', Validators.required],
    paymentMethod: ['UPI', Validators.required]
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.orderService.checkout({
      shippingAddress: this.form.value.shippingAddress || '',
      paymentMethod: this.form.value.paymentMethod || 'UPI'
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.cartService.loadCart();
          this.snackBar.open('Order placed successfully', 'Close', { duration: 3000 });
          this.router.navigateByUrl('/orders');
        },
        error: () => this.snackBar.open('Checkout failed. Please try again.', 'Close', { duration: 3000 })
      });
  }
}

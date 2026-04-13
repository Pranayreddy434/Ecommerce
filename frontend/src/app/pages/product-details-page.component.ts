import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CartService } from '../core/cart.service';
import { ProductService } from '../core/product.service';
import { Product } from '../models/models';

@Component({
  selector: 'app-product-details-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink, MatButtonModule, MatIconModule, MatDividerModule],
  template: `
    @if (product(); as item) {
      <section class="page-shell details-layout">
        <div class="glass-card gallery">
          <img [src]="item.imageUrls[0]" [alt]="item.name">
        </div>

        <div class="glass-card summary">
          <span class="pill">{{ item.categoryName }}</span>
          <h1>{{ item.name }}</h1>
          <p class="section-copy">{{ item.description }}</p>
          <div class="rating"><mat-icon>star</mat-icon> {{ item.rating }} rating</div>
          <div class="price-row">
            <span class="price">{{ item.price | currency:'INR':'symbol':'1.0-0' }}</span>
            <span class="stock" [class.out]="item.stock < 5">{{ item.stock }} in stock</span>
          </div>
          <mat-divider />
          <div class="cta-row">
            <button mat-flat-button color="primary" type="button" (click)="addToCart(item)">Add to Cart</button>
            <a mat-stroked-button routerLink="/cart">View Cart</a>
          </div>
        </div>
      </section>
    }
  `,
  styles: [`
    .details-layout {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 24px;
      padding: 28px 0;
    }

    .gallery,
    .summary {
      padding: 24px;
    }

    .gallery img {
      width: 100%;
      border-radius: 24px;
      height: 560px;
      object-fit: cover;
    }

    .summary h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(2rem, 4vw, 3.5rem);
      margin: 16px 0 12px;
    }

    .rating {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #f59e0b;
      font-weight: 700;
      margin: 10px 0;
    }

    .price-row,
    .cta-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      margin: 18px 0;
    }

    .stock {
      padding: 8px 14px;
      border-radius: 999px;
      background: rgba(34, 197, 94, 0.12);
      color: #15803d;
      font-weight: 700;
    }

    .stock.out {
      background: rgba(220, 38, 38, 0.12);
      color: #b91c1c;
    }

    @media (max-width: 900px) {
      .details-layout {
        grid-template-columns: 1fr;
      }

      .gallery img {
        height: 360px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly product = signal<Product | null>(null);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProduct(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((product) => this.product.set(product));
    }
  }

  addToCart(product: Product) {
    if (!localStorage.getItem('shopverse-session')) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.cartService.addToCart(product.id).subscribe((cart) => this.cartService.cart.set(cart));
  }
}

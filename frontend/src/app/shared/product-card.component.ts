import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../models/models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, MatButtonModule, MatCardModule, MatIconModule, NgOptimizedImage],
  template: `
    <mat-card class="product-card glass-card">
      <a [routerLink]="['/products', product.id]" class="product-media">
        <img [ngSrc]="product.imageUrls[0]" [alt]="product.name" width="400" height="280">
      </a>
      <mat-card-content>
        <div class="card-topline">
          <span class="category">{{ product.categoryName }}</span>
          <span class="rating"><mat-icon>star</mat-icon>{{ product.rating }}</span>
        </div>
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
        <div class="card-bottom">
          <span class="price">{{ product.price | currency:'INR':'symbol':'1.0-0' }}</span>
          <button mat-flat-button color="primary" type="button" (click)="add.emit(product)">Add to Cart</button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .product-card {
      overflow: hidden;
      border-radius: 24px;
      height: 100%;
    }

    .product-media {
      display: block;
      aspect-ratio: 4 / 3;
      overflow: hidden;
      background: linear-gradient(135deg, rgba(13, 110, 253, 0.16), rgba(255, 122, 24, 0.14));
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 220ms ease;
    }

    .product-card:hover img {
      transform: scale(1.05);
    }

    h3 {
      margin: 10px 0 8px;
      font-size: 1.15rem;
    }

    p {
      color: var(--muted);
      min-height: 52px;
    }

    .card-topline,
    .card-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    .category {
      color: var(--primary);
      font-size: 0.85rem;
      font-weight: 700;
    }

    .rating {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: #f59e0b;
      font-weight: 700;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() add = new EventEmitter<Product>();
}

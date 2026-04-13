import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { ProductService } from '../core/product.service';
import { CartService } from '../core/cart.service';
import { Category, PagedResponse, Product } from '../models/models';
import { ProductCardComponent } from '../shared/product-card.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatSelectModule, ProductCardComponent],
  template: `
    <section class="page-shell hero">
      <div class="hero-copy">
        <span class="pill">Curated commerce experience</span>
        <h1>Find polished essentials for work, travel, and home in one elegant storefront.</h1>
        <p class="section-copy">
          ShopVerse blends premium visual design with a realistic shopping flow: discovery, cart, checkout, and order history.
        </p>
        <div class="hero-stats">
          <article class="glass-card">
            <strong>5k+</strong>
            <span>Monthly shoppers</span>
          </article>
          <article class="glass-card">
            <strong>48h</strong>
            <span>Fulfillment window</span>
          </article>
          <article class="glass-card">
            <strong>4.8/5</strong>
            <span>Average product rating</span>
          </article>
        </div>
      </div>
      <div class="hero-panel glass-card">
        <p class="eyebrow">Featured pick</p>
        @if (products().content[0]; as featured) {
          <img [src]="featured.imageUrls[0]" [alt]="featured.name">
          <div class="panel-copy">
            <h3>{{ featured.name }}</h3>
            <p>{{ featured.description }}</p>
            <strong>{{ featured.price | currency:'INR':'symbol':'1.0-0' }}</strong>
          </div>
        }
      </div>
    </section>

    <section class="page-shell filters glass-card">
      <div>
        <h2 class="section-title">Trending Products</h2>
        <p class="section-copy">Search, filter by category, and browse paginated results.</p>
      </div>

      <div class="filters-row">
        <mat-form-field appearance="outline">
          <mat-label>Search products</mat-label>
          <input matInput [(ngModel)]="search" (keyup.enter)="loadProducts()" placeholder="Headphones, backpack, lamp">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Category</mat-label>
          <mat-select [(ngModel)]="selectedCategory" (selectionChange)="loadProducts()">
            <mat-option value="">All categories</mat-option>
            @for (category of categories(); track category.id) {
              <mat-option [value]="category.id">{{ category.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <button mat-flat-button color="primary" type="button" (click)="loadProducts()">
          Apply
        </button>
      </div>
    </section>

    <section class="page-shell product-grid">
      @for (product of products().content; track product.id) {
        <app-product-card [product]="product" (add)="addToCart(product)" />
      } @empty {
        <div class="glass-card empty-state">No products matched your search.</div>
      }
    </section>

    <section class="page-shell paginator-shell">
      <mat-paginator
        [pageSize]="products().size"
        [pageIndex]="products().page"
        [length]="products().totalElements"
        [pageSizeOptions]="[4, 8, 12]"
        (page)="onPageChange($event)">
      </mat-paginator>
    </section>
  `,
  styles: [`
    .hero {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 24px;
      padding: 32px 0 24px;
    }

    .hero-copy h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(2.3rem, 5vw, 4.6rem);
      line-height: 1.04;
      margin: 14px 0;
      max-width: 720px;
    }

    .hero-stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
      margin-top: 26px;
    }

    .hero-stats article,
    .hero-panel {
      padding: 20px;
    }

    .hero-stats strong {
      display: block;
      font-size: 1.6rem;
      margin-bottom: 4px;
    }

    .hero-panel {
      background: linear-gradient(180deg, rgba(8, 31, 62, 0.92), rgba(13, 110, 253, 0.88));
      color: white;
      overflow: hidden;
    }

    .hero-panel img {
      width: 100%;
      height: 280px;
      object-fit: cover;
      border-radius: 20px;
      margin-bottom: 16px;
    }

    .eyebrow {
      color: rgba(255, 255, 255, 0.72);
      text-transform: uppercase;
      letter-spacing: 0.14em;
      font-size: 0.75rem;
    }

    .filters {
      padding: 24px;
      display: flex;
      justify-content: space-between;
      gap: 18px;
      align-items: end;
      margin: 18px auto 24px;
    }

    .filters-row {
      display: flex;
      gap: 14px;
      align-items: center;
      flex-wrap: wrap;
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .empty-state {
      grid-column: 1 / -1;
      padding: 40px;
      text-align: center;
    }

    .paginator-shell {
      padding-bottom: 18px;
    }

    @media (max-width: 1024px) {
      .hero,
      .filters {
        grid-template-columns: 1fr;
        display: grid;
      }

      .product-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 680px) {
      .hero-stats,
      .product-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly categories = signal<Category[]>([]);
  readonly products = signal<PagedResponse<Product>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 8
  });

  search = '';
  selectedCategory = '';

  constructor() {
    this.productService.getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((categories) => this.categories.set(categories));
    this.loadProducts();
  }

  loadProducts(page = this.products().page, size = this.products().size) {
    this.productService.getProducts({
      search: this.search,
      categoryId: this.selectedCategory,
      page,
      size
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((products) => this.products.set(products));
  }

  onPageChange(event: PageEvent) {
    this.loadProducts(event.pageIndex, event.pageSize);
  }

  addToCart(product: Product) {
    if (!localStorage.getItem('shopverse-session')) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.cartService.addToCart(product.id).subscribe((cart) => this.cartService.cart.set(cart));
  }
}

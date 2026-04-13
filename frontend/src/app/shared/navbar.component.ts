import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../core/auth.service';
import { CartService } from '../core/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule, MatBadgeModule],
  template: `
    <header class="nav-shell">
      <mat-toolbar class="page-shell glass-card nav-bar">
        <a routerLink="/" class="brand">
          <span class="brand-mark">SV</span>
          <div>
            <strong>ShopVerse</strong>
            <small>Premium everyday commerce</small>
          </div>
        </a>

        <nav class="nav-links">
          <a mat-button routerLink="/" routerLinkActive="active">Home</a>
          <a mat-button routerLink="/orders" routerLinkActive="active" *ngIf="auth.isAuthenticated()">Orders</a>
        </nav>

        <div class="nav-actions">
          <a mat-icon-button routerLink="/cart" [matBadge]="itemCount()" [matBadgeHidden]="itemCount() === 0" matBadgeColor="warn">
            <mat-icon>shopping_cart</mat-icon>
          </a>

          @if (session(); as user) {
            <button mat-stroked-button type="button" (click)="auth.logout()">
              {{ user.fullName.split(' ')[0] }} | Logout
            </button>
          } @else {
            <a mat-flat-button routerLink="/login">Login</a>
          }
        </div>
      </mat-toolbar>
    </header>
  `,
  styles: [`
    .nav-shell {
      position: sticky;
      top: 0;
      z-index: 20;
      padding: 18px 0 0;
    }

    .nav-bar {
      min-height: 78px;
      padding: 12px 18px;
      display: flex;
      gap: 18px;
      justify-content: space-between;
      background: rgba(255, 255, 255, 0.78);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .brand-mark {
      display: grid;
      place-items: center;
      width: 48px;
      height: 48px;
      border-radius: 16px;
      font-family: 'Space Grotesk', sans-serif;
      background: linear-gradient(135deg, #0d6efd, #0dcaf0);
      color: white;
      font-weight: 700;
    }

    .brand small {
      display: block;
      color: var(--muted);
    }

    .nav-links,
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    @media (max-width: 768px) {
      .nav-bar {
        flex-wrap: wrap;
      }

      .nav-links {
        order: 3;
        width: 100%;
        justify-content: center;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  readonly auth = inject(AuthService);
  readonly cartService = inject(CartService);
  readonly session = computed(() => this.auth.session());

  itemCount() {
    return this.cartService.itemCount();
  }
}

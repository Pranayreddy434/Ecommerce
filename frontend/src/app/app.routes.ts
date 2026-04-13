import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { HomePageComponent } from './pages/home-page.component';
import { ProductDetailsPageComponent } from './pages/product-details-page.component';
import { AuthPageComponent } from './pages/auth-page.component';
import { CartPageComponent } from './pages/cart-page.component';
import { CheckoutPageComponent } from './pages/checkout-page.component';
import { OrdersPageComponent } from './pages/orders-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'products/:id', component: ProductDetailsPageComponent },
  { path: 'login', component: AuthPageComponent },
  { path: 'register', component: AuthPageComponent, data: { mode: 'register' } },
  { path: 'cart', component: CartPageComponent, canActivate: [authGuard] },
  { path: 'checkout', component: CheckoutPageComponent, canActivate: [authGuard] },
  { path: 'orders', component: OrdersPageComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Category, PagedResponse, Product } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  getProducts(filters: { search?: string; categoryId?: string; page?: number; size?: number }) {
    let params = new HttpParams()
      .set('page', filters.page ?? 0)
      .set('size', filters.size ?? 8);

    if (filters.search) {
      params = params.set('search', filters.search);
    }
    if (filters.categoryId) {
      params = params.set('categoryId', filters.categoryId);
    }

    return this.http.get<PagedResponse<Product>>(`${environment.apiUrl}/products`, { params });
  }

  getProduct(id: string) {
    return this.http.get<Product>(`${environment.apiUrl}/products/${id}`);
  }

  getCategories() {
    return this.http.get<Category[]>(`${environment.apiUrl}/categories`);
  }
}

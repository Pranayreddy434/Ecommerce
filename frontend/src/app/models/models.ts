export interface UserSession {
  token: string;
  userId: string;
  fullName: string;
  email: string;
  roles: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  price: number;
  rating: number;
  stock: number;
  imageUrls: string[];
  featured: boolean;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface CartItem {
  productId: string;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  shippingAddress: string;
  orderStatus: string;
  paymentStatus: string;
  paymentReference: string;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

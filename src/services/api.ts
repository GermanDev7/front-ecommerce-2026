import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  productName?: string;
}

export interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export interface CreateOrderDto {
  items: {
    productId: string;
    quantity: number;
  }[];
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get('/products');
  return response.data.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await apiClient.get(`/products/${id}`);
  return response.data;
};

export const getOrders = async (): Promise<Order[]> => {
  const response = await apiClient.get('/orders');
  return response.data.data;
};

export const createOrder = async (orderData: CreateOrderDto): Promise<Order> => {
  const response = await apiClient.post('/orders', orderData);
  return response.data;
};

export default apiClient;

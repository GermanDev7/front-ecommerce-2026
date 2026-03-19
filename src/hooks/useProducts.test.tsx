import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProducts } from './useProducts';
import * as api from '../services/api';

vi.mock('../services/api', () => ({
  getProducts: vi.fn(),
}));

describe('useProducts hook', () => {
  it('should fetch and return paginated products', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', description: 'Desc 1', price: 100, stock: 10, createdAt: new Date().toISOString() },
      { id: '2', name: 'Product 2', description: 'Desc 2', price: 200, stock: 5, createdAt: new Date().toISOString() },
    ];
    
    // Mocking the imported function
    vi.mocked(api.getProducts).mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useProducts(15)); // 15 items per page limit

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.products).toEqual([]);

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.allProducts).toEqual(mockProducts);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.page).toBe(1);
  });

  it('should correctly handle API failure', async () => {
    vi.mocked(api.getProducts).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useProducts(15));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBe('Error al cargar el catálogo de productos. Intenta nuevamente más tarde.');
  });
});

import { useState, useEffect, useCallback } from 'react';
import { getProducts, type Product } from '../services/api';

export const useProducts = (itemsPerPage: number = 15) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      console.error('Error fetching products:', err);
      setError('Error al cargar el catálogo de productos. Intenta nuevamente más tarde.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return {
    products: paginatedProducts,
    allProducts: products,
    loading,
    error,
    page,
    setPage,
    totalPages,
    refreshProducts: fetchProducts,
  };
};

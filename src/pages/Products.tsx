import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Fade,
  Pagination,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { getProducts, type Product } from '../services/api';
import CreateProductModal from '../components/CreateProductModal';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Could not connect to the API or an error occurred.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductCreated = () => {
    fetchProducts();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  const safeProducts = Array.isArray(products) ? products : [];
  const totalPages = Math.ceil(safeProducts.length / itemsPerPage);
  const paginatedProducts = safeProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Catálogo
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          Crear Producto
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {safeProducts.length === 0 && !loading && !error ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No hay productos disponibles por el momento. ¡Crea uno!
        </Alert>
      ) : (
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
            gap: 4 
          }}
        >
          {paginatedProducts.map((product, index) => (
            <Box key={product.id}>
              <Fade in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', backgroundColor: 'background.default' }}>
                    <Box
                      component="img"
                      sx={{ height: 160, width: 'auto', objectFit: 'contain', opacity: 0.8 }}
                      alt={product.name}
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=1e4976&color=fff&size=200&font-size=0.33&square=true`}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                        {product.name}
                      </Typography>
                      <Chip 
                        label={`$ ${product.price.toLocaleString('es-CO')}`} 
                        color="primary" 
                        variant="filled" 
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {product.description}
                    </Typography>
                    <Typography variant="caption" sx={{ color: product.stock > 10 ? 'success.main' : 'warning.main', fontWeight: 'bold' }}>
                      {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Box>
          ))}
        </Box>
      )}

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
        />
      )}

      <CreateProductModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onProductCreated={handleProductCreated} 
      />
    </Box>
  );
}

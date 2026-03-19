import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Chip,
  Fade,
  Pagination,
  Skeleton,
  Snackbar,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import CreateProductModal from '../components/CreateProductModal';
import { useProducts } from '../hooks/useProducts';

const Products: React.FC = () => {
  const { products: paginatedProducts, loading, error, page, setPage, totalPages, refreshProducts } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  // Internal logic moved to src/hooks/useProducts.ts

  if (loading) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">Catálogo</Typography>
          <Skeleton variant="rectangular" width={160} height={40} sx={{ borderRadius: 1 }} />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 4 }}>
          {[...Array(6)].map((_, index) => (
            <Card key={index} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Skeleton variant="rectangular" height={160} />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton variant="rectangular" width="25%" height={24} sx={{ borderRadius: 4 }} />
                </Box>
                <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="40%" height={24} />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    );
  }

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

      {paginatedProducts.length === 0 && !loading && !error ? (
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

      <Pagination
        count={Math.max(1, totalPages)}
        page={page}
        onChange={(_, value) => setPage(value)}
        color="primary"
        sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
      />

      <CreateProductModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onProductCreated={() => {
          refreshProducts();
          setToastOpen(true);
        }} 
      />

      <Snackbar 
        open={toastOpen} 
        autoHideDuration={4000} 
        onClose={() => setToastOpen(false)} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setToastOpen(false)} severity="success" sx={{ width: '100%', borderRadius: 2 }}>
          ¡Producto creado exitosamente!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Products;

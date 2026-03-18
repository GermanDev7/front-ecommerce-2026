import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import apiClient from '../services/api';

interface CreateProductModalProps {
  open: boolean;
  onClose: () => void;
  onProductCreated: () => void;
}

export default function CreateProductModal({ open, onClose, onProductCreated }: CreateProductModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name || !price || !stock) {
      setError('Por favor llena todos los campos requeridos');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await apiClient.post('/products', {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
      });
      onProductCreated();
      onClose();
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
    } catch (err: any) {
      if (err.response?.data?.message) {
        const backendMessage = err.response.data.message;
        setError(Array.isArray(backendMessage) ? backendMessage.join(', ') : backendMessage);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(err.message || 'Failed to create product. The backend might not be available.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ fontWeight: 'bold' }}>Crear Nuevo Producto</DialogTitle>
      <DialogContent dividers>
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Nombre del Producto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            size="small"
            required
          />
          <TextField
            label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            size="small"
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              type="number"
              label="Precio"
              value={price}
              onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
              fullWidth
              size="small"
              required
            />
            <TextField
              type="number"
              label="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
              fullWidth
              size="small"
              required
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary" 
          disabled={loading || !name || !price || !stock}
        >
          {loading ? 'Creando...' : 'Crear Producto'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

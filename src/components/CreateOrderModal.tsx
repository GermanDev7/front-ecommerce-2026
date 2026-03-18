import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { getProducts, createOrder, type Product } from '../services/api';

interface CreateOrderModalProps {
  open: boolean;
  onClose: () => void;
  onOrderCreated: () => void;
}

interface OrderItemInput {
  productId: string;
  quantity: number;
  product?: Product;
}

export default function CreateOrderModal({ open, onClose, onOrderCreated }: CreateOrderModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState<number | ''>(1);
  const [items, setItems] = useState<OrderItemInput[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchProducts();
      setItems([]);
      setSelectedProductId('');
      setQuantity(1);
      setError(null);
    }
  }, [open]);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setProducts([
        { id: '1', name: 'Premium Wireless Headphones', description: '', price: 299.99, stock: 45 },
        { id: '2', name: 'Mechanical Keyboard', description: '', price: 149.50, stock: 12 },
        { id: '3', name: 'Ultra HD Monitor', description: '', price: 499.00, stock: 8 },
      ]);
    }
  };

  const handleAddItem = () => {
    if (!selectedProductId || quantity === '' || quantity <= 0) return;
    
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    const existingItemIndex = items.findIndex(item => item.productId === selectedProductId);
    if (existingItemIndex >= 0) {
      const newItems = [...items];
      newItems[existingItemIndex].quantity += Number(quantity);
      setItems(newItems);
    } else {
      setItems([...items, { productId: selectedProductId, quantity: Number(quantity), product }]);
    }

    setSelectedProductId('');
    setQuantity(1);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      setError('Please add at least one item to the order');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await createOrder({
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
      onOrderCreated();
      onClose();
    } catch (err: any) {
      let errorMessage = err.message || 'Failed to create order. The backend might not be available.';
      
      if (err.response?.data?.message) {
        const backendMessage = err.response.data.message;
        errorMessage = Array.isArray(backendMessage) ? backendMessage.join(', ') : backendMessage;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      products.forEach(p => {
        if (errorMessage.includes(p.id)) {
          errorMessage = errorMessage.replace(p.id, p.name);
        }
      });

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = items.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ fontWeight: 'bold' }}>Create New Order</DialogTitle>
      <DialogContent dividers>
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'flex-start' }}>
          <TextField
            select
            label="Product"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            fullWidth
            size="small"
          >
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.name} - ${product.price}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            type="number"
            label="Qty"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
            inputProps={{ min: 1 }}
            size="small"
            sx={{ width: 100 }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddItem}
            disabled={!selectedProductId || quantity === '' || quantity < 1}
            sx={{ height: 40 }}
          >
            Add
          </Button>
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
          Order Items
        </Typography>
        
        {items.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', py: 2 }}>
            No items added yet.
          </Typography>
        ) : (
          <List disablePadding>
            {items.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary={item.product?.name}
                    secondary={`${item.quantity} x $${item.product?.price.toFixed(2)}`}
                  />
                  <ListItemSecondaryAction>
                    <Typography component="span" sx={{ fontWeight: 'bold', mr: 2 }}>
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </Typography>
                    <IconButton edge="end" aria-label="delete" color="error" onClick={() => handleRemoveItem(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < items.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
            ${totalAmount.toFixed(2)}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary" 
          disabled={loading || items.length === 0}
        >
          {loading ? 'Creating...' : 'Create Order'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

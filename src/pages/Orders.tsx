import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { getOrders, type Order } from '../services/api';
import CreateOrderModal from '../components/CreateOrderModal';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Could not connect to the API or an error occurred.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderCreated = () => {
    fetchOrders();
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  const safeOrders = Array.isArray(orders) ? orders : [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Orders Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          Create Order
        </Button>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 4, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : safeOrders.length === 0 && !error ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No orders found. Create one!
        </Alert>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="orders table">
            <TableHead sx={{ backgroundColor: 'background.default' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Items count</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {safeOrders.map((order) => (
                <TableRow
                  key={order.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.04)' } }}
                >
                  <TableCell component="th" scope="row">
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                      {order.id.slice(0, 13)}...
                    </Typography>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status} 
                      color={getStatusColor(order.status) as any} 
                      size="small" 
                      variant="outlined" 
                      sx={{ fontWeight: 'bold' }} 
                    />
                  </TableCell>
                  <TableCell>{order.items?.length || 0} items</TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.light' }}>
                      ${Number(order.totalAmount).toFixed(2)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <CreateOrderModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onOrderCreated={handleOrderCreated} 
      />
    </Box>
  );
}

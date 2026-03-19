import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TablePagination,
  Skeleton,
  Snackbar,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import CreateOrderModal from '../components/CreateOrderModal';
import { useOrders } from '../hooks/useOrders';

const Orders: React.FC = () => {
  const {
    orders: paginatedOrders,
    totalCount,
    loading,
    error,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    refreshOrders
  } = useOrders();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Gestión de Órdenes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          Crear Orden
        </Button>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 4, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>ID Órden</TableCell>
                <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Fecha</TableCell>
                <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Estado</TableCell>
                <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Artículos</TableCell>
                <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }} align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index} hover>
                  <TableCell><Skeleton variant="text" width={60} /></TableCell>
                  <TableCell><Skeleton variant="text" width={120} /></TableCell>
                  <TableCell><Skeleton variant="rectangular" width={90} height={24} sx={{ borderRadius: 4 }} /></TableCell>
                  <TableCell><Skeleton variant="text" width={50} /></TableCell>
                  <TableCell align="right"><Skeleton variant="text" width={80} sx={{ ml: 'auto' }} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : paginatedOrders.length === 0 && !error ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No se encontraron órdenes. ¡Crea una!
        </Alert>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="orders table">
            <TableHead sx={{ backgroundColor: 'background.default' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>ID de Orden</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Cant. Ítems</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow
                  key={order.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.04)' } }}
                >
                  <TableCell component="th" scope="row">
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                      #ORD-{order.id.slice(0, 8).toUpperCase()}
                    </Typography>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status === 'COMPLETED' ? 'COMPLETADO' : order.status === 'PENDING' ? 'PENDIENTE' : order.status === 'CANCELLED' ? 'CANCELADO' : order.status}
                      color={getStatusColor(order.status) as any}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>
                  <TableCell>{order.items?.length || 0} ítems</TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.light' }}>
                      $ {Number(order.totalAmount).toLocaleString('es-CO')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {totalCount > 0 && (
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[15, 30, 50]}
          labelRowsPerPage="Órdenes por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      )}

      <CreateOrderModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOrderCreated={() => {
          refreshOrders();
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
          ¡Orden creada exitosamente!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Orders;

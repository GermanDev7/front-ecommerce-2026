import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';
import { Inventory as InventoryIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { login as loginService } from '../services/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor llena todos los campos');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const resData = await loginService(email, password);
      
      // El backend parece devolver data.accessToken envuelto (o directo)
      const token = resData?.accessToken || resData?.access_token || resData?.data?.accessToken;
      const user = resData?.user || resData?.data?.user || { id: '0', email, name: 'Administrador' };
      
      if (token) {
        login(token, user);
        navigate('/');
      } else {
        setError('No se recibió el token de acceso');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.data?.message) {
        const backendMessage = err.response.data.message;
        setError(Array.isArray(backendMessage) ? backendMessage.join(', ') : backendMessage);
      } else {
        setError('Error al iniciar sesión. Verifica tus credenciales.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card sx={{ maxWidth: 400, width: '100%', p: 2, borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
            <InventoryIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5" component="h1" fontWeight={700}>
              Iniciar Sesión
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Accede al panel de E-Commerce
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TextField
              label="Correo Electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading || !email || !password}
              sx={{ mt: 1, height: 48 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
            </Button>
          </form>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            ¿No tienes cuenta?{' '}
            <Link component="button" variant="body2" onClick={() => navigate('/register')} fontWeight={600}>
              Regístrate aquí
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

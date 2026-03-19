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
import { register as registerService } from '../services/auth';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailBlur, setEmailBlur] = useState(false);
  const [confirmPasswordBlur, setConfirmPasswordBlur] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor llena todos los campos');
      return;
    }
    if (!isEmailValid) {
      setError('Por favor ingresa un correo con formato válido');
      return;
    }
    if (!isPasswordMatch) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const resData = await registerService(email, password, name);
      
      const token = resData?.accessToken || resData?.access_token || resData?.data?.accessToken;
      const user = resData?.user || resData?.data?.user || { id: '0', email, name: 'Usuario' };
      
      if (token) {
        login(token, user);
        navigate('/');
      } else {
        navigate('/login');
      }
    } catch (err: any) {
      console.error('Register error:', err);
      if (err.response?.data?.message) {
        const backendMessage = err.response.data.message;
        setError(Array.isArray(backendMessage) ? backendMessage.join(', ') : backendMessage);
      } else {
        setError('Error al registrar usuario. Intenta nuevamente.');
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
              Crear Cuenta
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Únete a la plataforma E-Commerce
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TextField
              label="Nombre Completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Correo Electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailBlur(true)}
              error={emailBlur && !isEmailValid}
              helperText={emailBlur && !isEmailValid ? 'Correo inválido (ejemplo@dominio.com)' : ''}
              color={emailBlur && isEmailValid ? 'success' : 'primary'}
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
            <TextField
              label="Repetir Contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setConfirmPasswordBlur(true)}
              error={confirmPasswordBlur && !isPasswordMatch}
              helperText={confirmPasswordBlur && !isPasswordMatch ? 'Las contraseñas no coinciden' : ''}
              color={confirmPasswordBlur && isPasswordMatch ? 'success' : 'primary'}
              fullWidth
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading || !email || !password || !confirmPassword || !name || !isEmailValid || !isPasswordMatch}
              sx={{ mt: 1, height: 48 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
            </Button>
          </form>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            ¿Ya tienes cuenta?{' '}
            <Link component="button" variant="body2" onClick={() => navigate('/login')} fontWeight={600}>
              Inicia sesión
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

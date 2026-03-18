import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Button,
  useTheme,
  CssBaseline,
} from '@mui/material';
import {
  Storefront as StorefrontIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const navItems = [
    { label: 'Products', path: '/', icon: <StorefrontIcon sx={{ mr: 1 }} /> },
    { label: 'Orders', path: '/orders', icon: <ShoppingCartIcon sx={{ mr: 1 }} /> },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="fixed" elevation={0}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="logo"
            sx={{ mr: 2 }}
            onClick={() => navigate('/')}
          >
            <InventoryIcon sx={{ color: theme.palette.primary.main }} />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 700, cursor: 'pointer', letterSpacing: 1 }}
            onClick={() => navigate('/')}
          >
            E-COMMERCE
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                onClick={() => navigate(item.path)}
                sx={{
                  color: location.pathname === item.path ? theme.palette.primary.main : 'text.primary',
                  fontWeight: location.pathname === item.path ? 700 : 500,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: theme.palette.primary.light,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {item.icon}
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: { xs: 10, sm: 12 } }}>
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            E-Commerce Technical Test {new Date().getFullYear()}
            {'. Built with React & MUI.'}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;

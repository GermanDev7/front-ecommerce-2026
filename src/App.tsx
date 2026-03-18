import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Products from './pages/Products';
import Orders from './pages/Orders';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Products />,
      },
      {
        path: 'orders',
        element: <Orders />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

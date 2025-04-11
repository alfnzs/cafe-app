import { RouteObject } from 'react-router-dom';
import Login from '../components/pages/Login';
import CreateOrder from '../components/pages/CreateOrder';
import Home from '../components/pages/Home';
import Orders from '../components/pages/Orders';
import DetailOrder from '../components/pages/DetailOrder';
import ProtectedRoute from './ProtectedRoute';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: (
      <ProtectedRoute>
        <Login />
      </ProtectedRoute>
    ),
  },
  {
    path: '/orders',
    element: (
      <ProtectedRoute>
        <Orders />
      </ProtectedRoute>
    ),
  },
  {
    path: '/orders/:id',
    element: (
      <ProtectedRoute>
        <DetailOrder />
      </ProtectedRoute>
    ),
  },
  {
    path: '/create',
    element: (
      <ProtectedRoute>
        <CreateOrder />
      </ProtectedRoute>
    ),
  },
];

export default routes;

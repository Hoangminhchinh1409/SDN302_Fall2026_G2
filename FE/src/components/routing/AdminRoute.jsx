import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const AdminRoute = ({ children }) => {
  const { user } = useAuthStore();
  return user && user.role === 'admin' ? (
    children ? children : <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminRoute;

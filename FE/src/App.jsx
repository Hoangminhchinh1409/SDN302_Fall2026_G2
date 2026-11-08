import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ScrollToTop from './components/routing/ScrollToTop';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Contact from './pages/Contact';
import Services from './pages/Services';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/auth/Profile';
import Cart from './pages/cart/Cart';
import Wishlist from './pages/Wishlist';
import BookAppointment from './pages/BookAppointment';
import PetProfiles from './pages/PetProfiles';
import Shipping from './pages/checkout/Shipping';
import Payment from './pages/checkout/Payment';
import PlaceOrder from './pages/checkout/PlaceOrder';
import OrderHistory from './pages/orders/OrderHistory';
import OrderDetails from './pages/orders/OrderDetails';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';
import DashboardLayout from './components/dashboard/DashboardLayout';
import NotFound from './pages/NotFound';
import StaffRoute from './components/routing/StaffRoute';

// Code-split heavier admin/staff pages (loaded on demand)
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ProductList = lazy(() => import('./pages/admin/ProductList'));
const ProductEdit = lazy(() => import('./pages/admin/ProductEdit'));
const ProductCreate = lazy(() => import('./pages/admin/ProductCreate'));
const OrderList = lazy(() => import('./pages/admin/OrderList'));
const UserList = lazy(() => import('./pages/admin/UserList'));
const AdminAppointments = lazy(() => import('./pages/admin/AdminAppointments'));
const AdminBrands = lazy(() => import('./pages/admin/AdminBrands'));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons'));
const AdminServices = lazy(() => import('./pages/admin/AdminServices'));
const StaffDashboard = lazy(() => import('./pages/staff/StaffDashboard'));

const DashboardFallback = () => (
  <div className="flex items-center justify-center py-20 text-gray-400" role="status" aria-live="polite">
    <i className="fas fa-circle-notch fa-spin text-2xl mr-3"></i>
    <span>Đang tải…</span>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="services" element={<Services />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="cart" element={<Cart />} />
          
          {/* Protected Routes for Customer/Guest */}
          <Route path="" element={<PrivateRoute />}>
            <Route path="profile" element={<Profile />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="pets" element={<PetProfiles />} />
            <Route path="book-appointment" element={<BookAppointment />} />
            <Route path="shipping" element={<Shipping />} />
            <Route path="payment" element={<Payment />} />
            <Route path="placeorder" element={<PlaceOrder />} />
            <Route path="orderhistory" element={<OrderHistory />} />
            <Route path="orders/myorders" element={<OrderHistory />} />
            <Route path="order/:id" element={<OrderDetails />} />
          </Route>
        </Route>

        <Route path="/admin" element={<AdminRoute><DashboardLayout /></AdminRoute>}>
          <Route index element={<Suspense fallback={<DashboardFallback />}><AdminDashboard /></Suspense>} />
          <Route path="products" element={<Suspense fallback={<DashboardFallback />}><ProductList /></Suspense>} />
          <Route path="product/new" element={<Suspense fallback={<DashboardFallback />}><ProductCreate /></Suspense>} />
          <Route path="product/:id/edit" element={<Suspense fallback={<DashboardFallback />}><ProductEdit /></Suspense>} />
          <Route path="orders" element={<Suspense fallback={<DashboardFallback />}><OrderList /></Suspense>} />
          <Route path="users" element={<Suspense fallback={<DashboardFallback />}><UserList /></Suspense>} />
          <Route path="appointments" element={<Suspense fallback={<DashboardFallback />}><AdminAppointments /></Suspense>} />
          <Route path="brands" element={<Suspense fallback={<DashboardFallback />}><AdminBrands /></Suspense>} />
          <Route path="coupons" element={<Suspense fallback={<DashboardFallback />}><AdminCoupons /></Suspense>} />
          <Route path="services" element={<Suspense fallback={<DashboardFallback />}><AdminServices /></Suspense>} />
        </Route>

        {/* Staff Routes */}
        <Route path="/staff" element={<StaffRoute><DashboardLayout /></StaffRoute>}>
          <Route index element={<Suspense fallback={<DashboardFallback />}><StaffDashboard /></Suspense>} />
          <Route path="orders" element={<Suspense fallback={<DashboardFallback />}><OrderList /></Suspense>} />
          <Route path="inventory" element={<Suspense fallback={<DashboardFallback />}><ProductList /></Suspense>} />
          <Route path="appointments" element={<Suspense fallback={<DashboardFallback />}><AdminAppointments /></Suspense>} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<Layout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

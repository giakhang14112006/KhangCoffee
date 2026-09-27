import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Customer Pages
import Home from './pages/customer/Home';
import Menu from './pages/customer/Menu';
import TableReservation from './pages/customer/TableReservation';
import ProductDetail from './pages/customer/ProductDetail';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import OrderSuccess from './pages/customer/OrderSuccess';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminTables from './pages/admin/AdminTables';
import AdminKitchen from './pages/admin/AdminKitchen';

function App() {
  return (
    <CartProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <div style={{ flex: 1 }}>
            <Routes>
              {/* Customer Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/tables" element={<TableReservation />} />
              <Route path="/menu/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />

              {/* Admin Public Route */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin-Only Protected Routes */}
              <Route path="/admin" element={
                <AdminProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/products" element={
                <AdminProtectedRoute requireAdmin={true}>
                  <AdminProducts />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/categories" element={
                <AdminProtectedRoute requireAdmin={true}>
                  <AdminCategories />
                </AdminProtectedRoute>
              } />

              {/* Shared Admin & Staff Protected Routes */}
              <Route path="/admin/orders" element={
                <AdminProtectedRoute requireAdmin={false}>
                  <AdminOrders />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/tables" element={
                <AdminProtectedRoute requireAdmin={false}>
                  <AdminTables />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/kitchen" element={
                <AdminProtectedRoute requireAdmin={false}>
                  <AdminKitchen />
                </AdminProtectedRoute>
              } />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;

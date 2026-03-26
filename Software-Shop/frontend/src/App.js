import VnPayReturnPage from './pages/VnPayReturnPage';
import OrderListPage from './pages/OrderListPage';
import OrderDetailPage from './pages/OrderDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import CartPage from './pages/CartPage';
import AdminUserListPage from './pages/AdminUserListPage';
import AdminUserDetailPage from './pages/AdminUserDetailPage';
import AdminPaymentListPage from './pages/AdminPaymentListPage';
import AdminPaymentDetailPage from './pages/AdminPaymentDetailPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
  <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout/:id" element={<CheckoutPage />} />
      <Route path="/vnpay-return" element={<VnPayReturnPage />} />
      <Route path="/orders" element={<OrderListPage />} />
      <Route path="/order/:id" element={<OrderDetailPage />} />
      {/* Admin routes */}
      <Route path="/admin/users" element={<AdminUserListPage />} />
      <Route path="/admin/user/:id" element={<AdminUserDetailPage />} />
      <Route path="/admin/payments" element={<AdminPaymentListPage />} />
      <Route path="/admin/payment/:id" element={<AdminPaymentDetailPage />} />
    </Routes>
  );
}

export default App;

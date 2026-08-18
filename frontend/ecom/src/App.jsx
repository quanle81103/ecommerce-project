import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useState } from 'react';

import './App.css';
import Register from '../pages/auth/Register';
import LoginForm  from '../pages/LoginForm';
import ForgetPassword from '../pages/ForgetPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import Header from '../components/Header' ;
import Footer from '../components/util/Footer';
import CategoryBar from '../components/util/CategoryBar';
import HeroBanner from '../components/util/HeroBanner';
import ProductCard from '../components/product/ProductCard';
import MainPage from '../pages/MainPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import ChatBox from '../components/ChatBox';
import ChatButton from '../components/ChatButton';
import { useChat } from '../context/ChatContext';
import SellerDashboard from '../pages/seller/SellerDashboard';
import SellerMessagePage from '../pages/seller/SellerMessagePage';
import SellerSidebar from '../components/seller/overview/SellerSidebar';
import SellerProductPage from '../pages/seller/SellerProductPage';
import SellerLayout from '../layout/SellerLayout';
import AddProductPage from '../pages/seller/AddProductPage';
import CheckoutPage from '../pages/payment/CheckoutPage';
import PaymentCallbackPage from '../pages/payment/PaymentCallbackPage';
import PaymentSuccessPage from '../pages/payment/PaymentSuccessPage';
import PaymentFailPage from '../pages/payment/PaymentFailPage';
import OrdersPage from '../pages/order/OrdersPage';
import RevenuePage from '../pages/revenue/RevenuePage';
import MainLayout from '../layout/MainLayout';
import SimpleLayout from '../layout/SimpleLayout';

function App() {
    return (
        <Routes>

            {/* Main */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<MainPage />} />
                <Route path="/products/:productId" element={<ProductDetailPage />} />
            </Route>

            {/* Auth */}
            <Route element={<SimpleLayout />}>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forget-password" element={<ForgetPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            {/* Checkout */}
            <Route element={<SimpleLayout />}>
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment/result" element={<PaymentCallbackPage />} />
                <Route path="/payment/success" element={<PaymentSuccessPage />} />
                <Route path="/payment/fail" element={<PaymentFailPage />} />
            </Route>

            {/* Seller */}
            <Route path="/seller" element={<SellerLayout />}>
                <Route index element={<SellerDashboard />} />
                <Route path="products" element={<SellerProductPage />} />
                <Route path="products/add" element={<AddProductPage />} />
                <Route path="order" element={<OrdersPage />} />
                <Route path="revenue" element={<RevenuePage />} />
                <Route path="messages" element={<SellerMessagePage />} />
            </Route>

        </Routes>
    );
}

export default App

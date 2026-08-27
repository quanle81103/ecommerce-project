import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";

import "./App.css";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../layout/MainLayout";
import SellerLayout from "../layout/SellerLayout";
import SimpleLayout from "../layout/SimpleLayout";
const MainPage = lazy(() => import("../pages/MainPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const ProductListingPage = lazy(() => import("../pages/ProductListingPage"));
const CartPage = lazy(() => import("../pages/cart/CartPage"));
const LoginForm = lazy(() => import("../pages/auth/LoginForm"));
const Register = lazy(() => import("../pages/auth/Register"));
const ForgetPassword = lazy(() => import("../pages/auth/ForgetPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const BuyerOrdersPage = lazy(() => import("../pages/order/BuyerOrdersPage"));
const ProfilePage = lazy(() => import("../pages/account/ProfilePage"));
const OrdersPage = lazy(() => import("../pages/order/OrdersPage"));
const CheckoutPage = lazy(() => import("../pages/payment/CheckoutPage"));
const PaymentCallbackPage = lazy(() => import("../pages/payment/PaymentCallbackPage"));
const PaymentSuccessPage = lazy(() => import("../pages/payment/PaymentSuccessPage"));
const PaymentFailPage = lazy(() => import("../pages/payment/PaymentFailPage"));
const RevenuePage = lazy(() => import("../pages/revenue/RevenuePage"));
const SellerDashboard = lazy(() => import("../pages/seller/SellerDashboard"));
const SellerMessagePage = lazy(() => import("../pages/seller/SellerMessagePage"));
const SellerProductPage = lazy(() => import("../pages/seller/SellerProductPage"));
const AddProductPage = lazy(() => import("../pages/seller/product/AddProductPage"));
const ProductDetailPage = lazy(() => import("../pages/seller/product/ProductDetailPage"));

function FullPageLoader() {
    return (
        <div className="grid min-h-screen place-items-center bg-slate-50" role="status">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
            <span className="sr-only">Đang tải</span>
        </div>
    );
}

function ProtectedRoute({ children, sellerOnly = false }) {
    const { isAuthenticated, isInitializing, shop } = useAuth();
    const location = useLocation();

    if (isInitializing) return <FullPageLoader />;
    if (!isAuthenticated) {
        const returnUrl = `${location.pathname}${location.search}`;
        return <Navigate to={`/login?returnUrl=${encodeURIComponent(returnUrl)}`} replace />;
    }
    if (sellerOnly && !shop) return <Navigate to="/" replace />;
    return children;
}

function GuestRoute({ children }) {
    const { isAuthenticated, isInitializing } = useAuth();
    if (isInitializing) return <FullPageLoader />;
    return isAuthenticated ? <Navigate to="/" replace /> : children;
}

export default function App() {
    return (
        <Suspense fallback={<FullPageLoader />}><Routes>
            <Route element={<MainLayout />}>
                <Route index element={<MainPage />} />
                <Route path="products" element={<ProductListingPage />} />
                <Route path="products/:productId" element={<ProductDetailPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="orders" element={<ProtectedRoute><BuyerOrdersPage /></ProtectedRoute>} />
                <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            </Route>

            <Route element={<SimpleLayout />}>
                <Route path="login" element={<GuestRoute><LoginForm /></GuestRoute>} />
                <Route path="register" element={<GuestRoute><Register /></GuestRoute>} />
                <Route path="forget-password" element={<GuestRoute><ForgetPassword /></GuestRoute>} />
                <Route path="reset-password" element={<GuestRoute><ResetPassword /></GuestRoute>} />
                <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="payment/result" element={<ProtectedRoute><PaymentCallbackPage /></ProtectedRoute>} />
                <Route path="payment/success" element={<PaymentSuccessPage />} />
                <Route path="payment/fail" element={<PaymentFailPage />} />
            </Route>

            <Route path="seller" element={<ProtectedRoute sellerOnly><SellerLayout /></ProtectedRoute>}>
                <Route index element={<SellerDashboard />} />
                <Route path="products" element={<SellerProductPage />} />
                <Route path="products/add" element={<AddProductPage />} />
                <Route path="products/:productId/edit" element={<AddProductPage mode="edit" />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="order" element={<Navigate to="/seller/orders" replace />} />
                <Route path="revenue" element={<RevenuePage />} />
                <Route path="messages" element={<SellerMessagePage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes></Suspense>
    );
}

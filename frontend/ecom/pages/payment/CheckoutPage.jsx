import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CheckoutTable from "../../components/checkout/CheckoutTable";
import OrderSummary from "../../components/checkout/OrderSummary";
import PaymentButton from "../../components/checkout/PaymentButton";
import ShippingAddress from "../../components/checkout/ShippingAddress";
import ShippingMethod from "../../components/checkout/ShippingMethod";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/Feedback";
import { calculateShippingFee, createOrderFromCart, createVnpayPayment, getCart } from "../../services/dataService";

const initialAddress = { receiverName: "", phone: "", provinceId: "", districtId: "", wardCode: "", street: "" };

export default function CheckoutPage() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [address, setAddress] = useState(initialAddress);
    const [addressErrors, setAddressErrors] = useState({});
    const [shippingFees, setShippingFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shippingLoading, setShippingLoading] = useState(false);
    const [shippingError, setShippingError] = useState("");
    const [pageError, setPageError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const loadCart = useCallback(async () => {
        setLoading(true); setPageError("");
        try { const cart = await getCart(); setCartItems(cart?.cartItems || []); } catch { setPageError("Không thể tải giỏ hàng để thanh toán."); } finally { setLoading(false); }
    }, []);
    useEffect(() => { loadCart(); }, [loadCart]);

    const loadShippingFee = useCallback(async () => {
        if (!cartItems.length || !address.districtId || !address.wardCode) return;
        setShippingLoading(true); setShippingError("");
        try {
            const shopIds = [...new Set(cartItems.map((item) => item.shopId))];
            const fees = await Promise.all(shopIds.map(async (shopId) => {
                const fee = await calculateShippingFee({ shopId, toDistrictId: Number(address.districtId), toWardCode: address.wardCode });
                return { shopId, shippingFee: fee.total };
            }));
            setShippingFees(fees);
        } catch { setShippingFees([]); setShippingError("Không thể tính phí vận chuyển. Vui lòng thử lại."); } finally { setShippingLoading(false); }
    }, [cartItems, address.districtId, address.wardCode]);

    useEffect(() => {
        setShippingFees([]);
        if (address.districtId && address.wardCode && cartItems.length) loadShippingFee();
    }, [address.districtId, address.wardCode, cartItems, loadShippingFee]);

    const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0), [cartItems]);
    const totalShippingFee = shippingFees.reduce((sum, item) => sum + Number(item.shippingFee), 0);

    const validate = () => {
        const errors = {};
        if (!address.receiverName.trim()) errors.receiverName = "Vui lòng nhập họ tên người nhận.";
        if (!/^(0|\+84)\d{9}$/.test(address.phone.trim())) errors.phone = "Số điện thoại không hợp lệ.";
        if (!address.provinceId) errors.provinceId = "Vui lòng chọn tỉnh/thành phố.";
        if (!address.districtId) errors.districtId = "Vui lòng chọn quận/huyện.";
        if (!address.wardCode) errors.wardCode = "Vui lòng chọn phường/xã.";
        if (address.street.trim().length < 3) errors.street = "Vui lòng nhập địa chỉ cụ thể.";
        setAddressErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePayment = async () => {
        if (!validate() || submitting || shippingLoading || shippingError || shippingFees.length === 0) return;
        setSubmitting(true);
        try {
            const order = await createOrderFromCart({ provinceId: Number(address.provinceId), districtId: Number(address.districtId), wardCode: address.wardCode, receiverName: address.receiverName.trim(), phone: address.phone.trim(), place: address.street.trim(), shippingFees });
            const paymentUrl = await createVnpayPayment(order.totalAmount, order.txnRef);
            window.location.assign(paymentUrl);
        } catch (error) {
            toast.error(error.response?.data?.message || "Không thể tạo thanh toán. Vui lòng thử lại.");
            setSubmitting(false);
        }
    };

    if (loading) return <div className="app-container py-10"><LoadingState label="Đang chuẩn bị thanh toán..." /></div>;
    if (pageError) return <div className="app-container py-10"><ErrorState message={pageError} onRetry={loadCart} /></div>;
    if (!cartItems.length) return <div className="app-container py-10"><EmptyState title="Giỏ hàng đang trống" description="Bạn cần thêm sản phẩm trước khi thanh toán." action={<button type="button" className="primary-button" onClick={() => navigate("/products")}>Xem sản phẩm</button>} /></div>;

    const paymentDisabled = submitting || shippingLoading || Boolean(shippingError) || shippingFees.length === 0;
    return <div className="app-container space-y-5 py-8 sm:space-y-6 sm:py-10"><h1 className="text-2xl font-bold sm:text-3xl">Thanh toán</h1><ShippingAddress address={address} setAddress={setAddress} errors={addressErrors} /><CheckoutTable cartItems={cartItems} /><ShippingMethod shippingFees={shippingFees} loading={shippingLoading} error={shippingError} onRetry={loadShippingFee} /><OrderSummary subtotal={subtotal} shippingFee={totalShippingFee} /><PaymentButton onCheckout={handlePayment} disabled={paymentDisabled} loading={submitting} /></div>;
}

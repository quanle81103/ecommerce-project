export default function PaymentButton({ onCheckout, disabled, loading }) {
    return <div className="flex justify-end"><button type="button" onClick={onCheckout} disabled={disabled || loading} className="primary-button w-full px-8 py-3 text-base sm:w-auto">{loading ? "Đang tạo thanh toán..." : "Thanh toán bằng VNPay"}</button></div>;
}

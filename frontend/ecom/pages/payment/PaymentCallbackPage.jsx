import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getPaymentStatus } from "../../services/dataService";

const MAX_ATTEMPTS = 30;

export default function PaymentCallbackPage() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState("Đang xác nhận thanh toán...");
    const txnRef = params.get("txnRef");
    const code = params.get("code");

    useEffect(() => {
        if (!txnRef) { setMessage("Thiếu mã giao dịch để xác nhận thanh toán."); return undefined; }
        if (code && code !== "00") { navigate("/payment/fail", { replace: true }); return undefined; }
        let cancelled = false;
        let attempts = 0;
        let timeoutId;
        const poll = async () => {
            try {
                const payment = await getPaymentStatus(txnRef);
                if (cancelled) return;
                if (payment.status === "SUCCESS") { navigate("/payment/success", { replace: true }); return; }
                if (payment.status === "FAILED") { navigate("/payment/fail", { replace: true }); return; }
                attempts += 1;
                if (attempts >= MAX_ATTEMPTS) { setMessage("Giao dịch đang được xử lý lâu hơn dự kiến. Vui lòng kiểm tra lại trong mục Đơn mua."); return; }
                timeoutId = window.setTimeout(poll, 2000);
            } catch {
                attempts += 1;
                if (attempts >= 3) { setMessage("Không thể xác nhận trạng thái thanh toán lúc này."); return; }
                timeoutId = window.setTimeout(poll, 2000);
            }
        };
        poll();
        return () => { cancelled = true; window.clearTimeout(timeoutId); };
    }, [txnRef, code, navigate]);

    return <div className="app-container grid min-h-[65vh] place-items-center py-10"><div className="surface-card max-w-lg p-8 text-center"><div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" /><p className="mt-5 text-lg text-slate-600">{message}</p>{message !== "Đang xác nhận thanh toán..." && <Link to="/orders" className="primary-button mt-6">Xem đơn mua</Link>}</div></div>;
}

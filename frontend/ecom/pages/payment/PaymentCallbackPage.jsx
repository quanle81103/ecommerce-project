import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPaymentStatus } from "../../services/dataService";
export default function PaymentCallbackPage() {

    const [params] = useSearchParams();
    const txnRef = params.get("txnRef");
    const code = params.get("code");
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(async () => {

            const payment = await getPaymentStatus(txnRef);

            if (payment.status === "SUCCESS") {
                clearInterval(interval);
                navigate("/payment/success");
            }

            if (payment.status === "FAILED") {
                clearInterval(interval);
                navigate("/payment/fail");
            }

        }, 2000);

        return () => clearInterval(interval);

    }, []);

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto"></div>
                <p className="mt-5 text-gray-600 text-lg">
                    Đang xác nhận thanh toán...
                </p>
            </div>
        </div>
    );
}
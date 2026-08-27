import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
            <div className="mx-4 w-full max-w-lg rounded-2xl bg-white p-6 text-center shadow-lg sm:p-10">

                <FaCheckCircle className="text-green-500 text-7xl mx-auto mb-5" />

                <h1 className="text-3xl font-bold mb-3">
                    Thanh toán thành công
                </h1>

                <p className="text-gray-600 mb-8">
                    Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận và
                    đang được xử lý.
                </p>

                <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">

                    <Link
                        to="/orders"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl transition"
                    >
                        Xem đơn hàng
                    </Link>

                    <Link
                        to="/"
                        className="border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-100 transition"
                    >
                        Về trang chủ
                    </Link>

                </div>
            </div>
        </div>
    );
}

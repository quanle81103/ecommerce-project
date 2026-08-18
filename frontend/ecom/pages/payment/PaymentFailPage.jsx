import { Link } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

export default function PaymentFailPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-lg w-full">

                <FaTimesCircle className="text-red-500 text-7xl mx-auto mb-5" />

                <h1 className="text-3xl font-bold mb-3">
                    Thanh toán thất bại
                </h1>

                <p className="text-gray-600 mb-8">
                    Giao dịch chưa hoàn tất hoặc đã bị hủy.
                    Bạn có thể thử thanh toán lại.
                </p>

                <div className="flex justify-center gap-4">

                    <Link
                        to="/checkout"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl transition"
                    >
                        Thanh toán lại
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
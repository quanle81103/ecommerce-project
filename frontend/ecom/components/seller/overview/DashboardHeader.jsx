import { useNavigate } from "react-router-dom";

export default function DashboardHeader() {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between items-center">

            <div>
                <h1 className="text-3xl font-bold">
                    Dashboard
                </h1>

                <p className="text-gray-500 mt-2">
                    Tổng quan hoạt động của cửa hàng.
                </p>
            </div>

            <button className="bg-emerald-500 text-white px-5 py-3 rounded-lg hover:bg-emerald-600" onClick={() => navigate("/seller/products/add")}>
                + Thêm sản phẩm
            </button>

        </div>
    );
}
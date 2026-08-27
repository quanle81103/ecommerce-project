import { useNavigate } from "react-router-dom";

export default function DashboardHeader() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
                <h1 className="text-3xl font-bold">
                    Tổng quan
                </h1>

                <p className="text-gray-500 mt-2">
                    Tổng quan hoạt động của cửa hàng.
                </p>
            </div>

            <button type="button" className="primary-button sm:self-auto" onClick={() => navigate("/seller/products/add")}>
                + Thêm sản phẩm
            </button>

        </div>
    );
}

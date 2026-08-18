import { FaPlus, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ProductToolbar() {

    const navigate = useNavigate();

    return (
        <div className="flex justify-between items-center mb-6">
            <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input
                    placeholder="Tìm kiếm sản phẩm..."
                    className="pl-11 pr-4 py-2 w-80 border rounded-lg"
                />
            </div>
            <button
                onClick={() => navigate("/seller/products/add")}
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg flex items-center gap-2"
            >
                <FaPlus />
                Thêm sản phẩm
            </button>
        </div>
    );

}
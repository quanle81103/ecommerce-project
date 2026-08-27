import { FaPlus, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ProductToolbar({ keyword, onKeywordChange }) {

    const navigate = useNavigate();

    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative min-w-0 sm:max-w-sm sm:flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input
                    placeholder="Tìm kiếm sản phẩm..."
                    aria-label="Tìm kiếm sản phẩm"
                    value={keyword}
                    onChange={(event) => onKeywordChange(event.target.value)}
                    className="field-control pl-11"
                />
            </div>
            <button
                type="button"
                onClick={() => navigate("/seller/products/add")}
                className="primary-button"
            >
                <FaPlus />
                Thêm sản phẩm
            </button>
        </div>
    );

}

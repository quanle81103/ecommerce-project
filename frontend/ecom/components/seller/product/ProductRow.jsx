import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ProductRow({ product, onDelete, deleting }) {

    const navigate = useNavigate();

    return (
        <tr className="h-56 border-b hover:bg-gray-50 ">

            {/* Ảnh */}
            <td className="px-4 py-3 text-center">
                <img
                    src={product.image?.[0]?.imageUrl || product.image?.[0]?.imageUlr}
                    alt={product.name}
                    className="w-36 h-40 rounded object-cover border"
                />
            </td>

            {/* Tên */}
            <td className="px-4 py-3">
                <p className="font-medium">
                    {product.name}
                </p>

                <p className="text-sm text-gray-500">
                    ID: {product.id}
                </p>
            </td>

            {/* Danh mục */}
            <td className="px-4 py-3">
                {product.categoryName}
            </td>

            {/* Giá */}
            <td className="px-4 py-3 text-right text-orange-500 font-semibold">
                {product.price.toLocaleString()} ₫
            </td>

            {/* Kho */}
            <td className="px-4 py-3 text-center">
                {product.inventory}
            </td>

            {/* Đã bán */}
            <td className="px-4 py-3 text-center">
                {product.sold ?? 0}
            </td>

            {/* Thao tác */}
            <td className="px-4 py-3">

                <div className="flex justify-center gap-2">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(`/seller/products/${product.id}/edit`)
                        }
                        className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                    >
                        <FaEdit />
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(product.id)}
                        disabled={deleting}
                        aria-label={`Xóa ${product.name}`}
                        className="p-2 rounded bg-red-500 text-white hover:bg-red-600"
                    >
                        <FaTrash />
                    </button>

                </div>

            </td>

        </tr>
    );
}

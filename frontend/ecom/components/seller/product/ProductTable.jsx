import ProductRow from "./ProductRow";

export default function ProductTable({ products, handleDelete, deletingId }) {
    return (
        <div className="overflow-x-auto rounded-xl bg-white shadow"><table className="min-w-240 w-full table-fixed">
            <thead className="bg-gray-100">
                <tr>
                    <th className="w-44 px-4 py-3 text-center">Ảnh</th>
                    <th className="px-4 py-3 text-center">Tên</th>
                    <th className="w-44 px-4 py-3 text-left">Danh mục</th>
                    <th className="w-36 px-4 py-3 text-right">Giá</th>
                    <th className="w-24 px-4 py-3 text-center">Kho</th>
                    <th className="w-24 px-4 py-3 text-center">Đã bán</th>
                    <th className="w-32 px-4 py-3 text-center">Thao tác</th>
                </tr>
            </thead>
            <tbody>
                {products.map(product => (
                    <ProductRow
                        key={product.id}
                        product={product}
                        onDelete={handleDelete}
                        deleting={deletingId === product.id}
                    />
                ))}
            </tbody>
        </table></div>
    );
}

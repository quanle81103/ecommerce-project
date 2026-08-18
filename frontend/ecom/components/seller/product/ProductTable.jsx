import ProductRow from "./ProductRow";

export default function ProductTable({ products, handleDelete }) {


    return (
        <table className="w-full table-fixed bg-white rounded-xl overflow-hidden shadow">
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
                    />
                ))}
            </tbody>
        </table>
    );
}
const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0
    }).format(value);

const getRank = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
};

export default function TopProductTable({ products }) {

    if (!products?.length) {
        return (
            <div className="rounded-2xl border bg-white p-10 text-center text-slate-500">
                Chưa có dữ liệu
            </div>
        );
    }

    const maxSold = Math.max(...products.map(p => p.sold));

    return (

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b p-6">
                <h2 className="text-xl font-bold text-slate-800">
                    Top sản phẩm bán chạy
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Sản phẩm có doanh số cao nhất trong khoảng thời gian đã chọn
                </p>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left">TOP</th>
                            <th className="px-6 py-4 text-left">
                                Hình
                            </th>

                            <th className="px-6 py-4 text-left">
                                Tên sản phẩm
                            </th>

                            <th className="px-6 py-4 text-center">
                                Đã bán
                            </th>

                            <th className="px-6 py-4 text-right">
                                Doanh thu
                            </th>

                            <th className="px-6 py-4">
                                Hiệu suất
                            </th>

                        </tr>
                    </thead>

                    <tbody>

                        {products.map((product, index) => {

                            const percent =
                                (product.sold / maxSold) * 100;

                            return (

                                <tr
                                    key={product.productId}
                                    className="border-t transition hover:bg-slate-50"
                                >

                                    <td className="px-6 py-5 text-xl">

                                        {getRank(index)}

                                    </td>

                                    <td className="px-6 py-5">

                                        <img
                                            src={
                                                product.image ??
                                                "https://placehold.co/70x70"
                                            }
                                            alt={product.productName}
                                            className="h-14 w-14 rounded-xl object-cover"
                                        />

                                    </td>

                                    <td className="px-6 py-5">

                                        <div>

                                            <p className="font-semibold text-slate-800">

                                                {product.productName}

                                            </p>

                                            <p className="text-sm text-slate-500">

                                                ID: {product.productId}

                                            </p>

                                        </div>

                                    </td>

                                    <td className="px-6 py-5 text-center font-semibold">

                                        {product.sold}

                                    </td>

                                    <td className="px-6 py-5 text-right font-bold text-orange-600">

                                        {formatCurrency(product.revenue)}

                                    </td>

                                    <td className="px-6 py-5">

                                        <div className="flex items-center gap-3">

                                            <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200">

                                                <div
                                                    className="h-full rounded-full bg-orange-500 transition-all duration-700"
                                                    style={{
                                                        width: `${percent}%`
                                                    }}
                                                />

                                            </div>

                                            <span className="w-12 text-sm text-slate-500">

                                                {Math.round(percent)}%

                                            </span>

                                        </div>

                                    </td>

                                </tr>

                            );

                        })}

                    </tbody>

                </table>

            </div>

        </div>

    );

}

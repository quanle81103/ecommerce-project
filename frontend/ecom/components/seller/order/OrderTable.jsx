import OrderStatusBadge from "./OrderStatusBadge";
import { FiEye } from "react-icons/fi";

const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
    }).format(value);

export default function OrderTable({ orders, onSelect }) {
    if (!orders || orders.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 py-20 text-center">
                <h3 className="text-lg font-semibold text-slate-700">
                    Không có đơn hàng
                </h3>

                <p className="mt-2 text-slate-500">
                    Hiện chưa có đơn hàng nào phù hợp.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200">

            <div className="overflow-x-auto">

                <table className="min-w-full">

                    <thead className="bg-slate-100">

                        <tr className="text-left text-sm font-semibold text-slate-700">

                            <th className="px-6 py-4">
                                Mã đơn
                            </th>

                            <th className="px-6 py-4">
                                Khách hàng
                            </th>

                            <th className="px-6 py-4">
                                Ngày đặt
                            </th>

                            <th className="px-6 py-4">
                                Tiền hàng
                            </th>

                            <th className="px-6 py-4">
                                Ship
                            </th>

                            <th className="px-6 py-4">
                                Tổng
                            </th>

                            <th className="px-6 py-4">
                                Trạng thái
                            </th>

                            <th className="px-6 py-4 text-center">
                                Thao tác
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {orders.map(order => (

                            <tr
                                key={order.id}
                                className="border-t transition hover:bg-slate-50"
                            >

                                <td className="px-6 py-5 font-semibold text-orange-600">
                                    #{order.id}
                                </td>

                                <td className="px-6 py-5">
                                    {order.customerName}
                                </td>

                                <td className="px-6 py-5 text-slate-600">
                                    {order.createdAt}
                                </td>

                                <td className="px-6 py-5">
                                    {formatCurrency(order.subtotal)}
                                </td>

                                <td className="px-6 py-5">
                                    {formatCurrency(order.shippingFee)}
                                </td>

                                <td className="px-6 py-5 font-semibold">
                                    {formatCurrency(order.total)}
                                </td>

                                <td className="px-6 py-5">
                                    <OrderStatusBadge
                                        status={order.status}
                                    />
                                </td>

                                <td className="px-6 py-5 text-center">
                                    <button
                                        type="button"
                                        onClick={() => onSelect(order)}
                                        className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-600"
                                    >
                                        <FiEye />
                                        Xem
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

import { useEffect, useState } from "react";
import DashboardCard from "../../components/seller/overview/DashboardCard";
import DashboardHeader from "../../components/seller/overview/DashboardHeader";
import {getRevenueResponse,getSellerOrders} from "../../services/sellerService";
import {FaBoxOpen,FaShoppingBag,FaMoneyBillWave,FaComments} from "react-icons/fa";

const formatMoney = (value) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0
    }).format(value);

export default function SellerDashboard() {

    const [summary, setSummary] = useState(null);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [summaryRes, orderRes] = await Promise.all([
                getRevenueResponse(),
                getSellerOrders({ page: 0, size: 5 })
            ]);

            setSummary(summaryRes);
            setOrders(orderRes.content || []);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">

            <div className="flex-1 p-8">

                <DashboardHeader />
                <div className="grid grid-cols-4 gap-6 mt-8">
                    <DashboardCard
                        title="Sản phẩm"
                        value={summary?.totalProductSolds ?? 0}
                        icon={<FaBoxOpen className="text-emerald-500" size={28} />}
                    />

                    <DashboardCard
                        title="Đơn hàng"
                        value={summary?.totalOrders ?? 0}
                        icon={<FaShoppingBag className="text-emerald-500" size={28} />}
                    />

                    <DashboardCard
                        title="Doanh thu"
                        value={formatMoney(summary?.revenue ?? 0)}
                        icon={<FaMoneyBillWave className="text-emerald-500" size={28} />}
                    />

                    <DashboardCard
                        title="Khách hàng"
                        value={summary?.totalCustomers ?? 0}
                        icon={<FaComments className="text-emerald-500" size={28} />}
                    />

                </div>

                <div className="bg-white rounded-xl shadow mt-10 p-6">

                    <h2 className="text-xl font-semibold mb-4">
                        Đơn hàng gần đây
                    </h2>

                    <table className="w-full">
                        <thead className="border-b">
                            <tr>
                                <th className="text-left py-3">Mã đơn</th>
                                <th className="text-left">Khách hàng</th>
                                <th className="text-left">Trạng thái</th>
                                <th className="text-right">Tổng tiền</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className="border-b">
                                    <td className="py-4">#{order.id}</td>
                                    <td>{order.customerName}</td>
                                    <td>{order.status}</td>
                                    <td className="text-right">{formatMoney(order.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
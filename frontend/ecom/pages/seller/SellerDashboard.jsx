import { useCallback, useEffect, useState } from "react";
import DashboardCard from "../../components/seller/overview/DashboardCard";
import DashboardHeader from "../../components/seller/overview/DashboardHeader";
import {getRevenueResponse,getSellerOrders} from "../../services/sellerService";
import {FaBoxOpen,FaShoppingBag,FaMoneyBillWave,FaComments} from "react-icons/fa";
import { ErrorState, LoadingState } from "../../components/ui/Feedback";

const formatMoney = (value) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0
    }).format(value);

export default function SellerDashboard() {

    const [summary, setSummary] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadData = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const [summaryRes, orderRes] = await Promise.all([
                getRevenueResponse(),
                getSellerOrders({ page: 0, size: 5 })
            ]);

            setSummary(summaryRes);
            setOrders(orderRes.content || []);
        } catch {
            setSummary(null);
            setOrders([]);
            setError("Không thể tải dữ liệu tổng quan cửa hàng.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    if (loading) return <LoadingState label="Đang tải tổng quan cửa hàng..." />;
    if (error) return <ErrorState message={error} onRetry={loadData} />;

    return (
        <div>

                <DashboardHeader />
                <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
                    <DashboardCard
                        title="Sản phẩm"
                        value={summary?.totalProductSolds ?? 0}
                        icon={<FaBoxOpen className="text-orange-500" size={28} />}
                    />

                    <DashboardCard
                        title="Đơn hàng"
                        value={summary?.totalOrders ?? 0}
                        icon={<FaShoppingBag className="text-orange-500" size={28} />}
                    />

                    <DashboardCard
                        title="Doanh thu"
                        value={formatMoney(summary?.revenue ?? 0)}
                        icon={<FaMoneyBillWave className="text-orange-500" size={28} />}
                    />

                    <DashboardCard
                        title="Khách hàng"
                        value={summary?.totalCustomers ?? 0}
                        icon={<FaComments className="text-orange-500" size={28} />}
                    />

                </div>

                <div className="mt-8 overflow-hidden rounded-xl bg-white p-4 shadow sm:p-6">

                    <h2 className="text-xl font-semibold mb-4">
                        Đơn hàng gần đây
                    </h2>

                    <div className="overflow-x-auto"><table className="min-w-160 w-full">
                        <thead className="border-b">
                            <tr>
                                <th className="text-left py-3">Mã đơn</th>
                                <th className="text-left">Khách hàng</th>
                                <th className="text-left">Trạng thái</th>
                                <th className="text-right">Tổng tiền</th>
                            </tr>
                        </thead>

                        <tbody>
                            {!orders.length && (
                                <tr><td colSpan="4" className="py-10 text-center text-slate-500">Chưa có đơn hàng gần đây.</td></tr>
                            )}
                            {orders.map(order => (
                                <tr key={order.id} className="border-b">
                                    <td className="py-4">#{order.id}</td>
                                    <td>{order.customerName}</td>
                                    <td>{order.status}</td>
                                    <td className="text-right">{formatMoney(order.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table></div>
                </div>
        </div>
    );
}

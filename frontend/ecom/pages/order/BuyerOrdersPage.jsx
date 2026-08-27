import { useCallback, useEffect, useMemo, useState } from "react";
import { FiPackage, FiRefreshCw } from "react-icons/fi";
import { toast } from "sonner";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/Feedback";
import { cancelOrder, getMyOrders } from "../../services/dataService";
import { formatCurrency } from "../../utils/formatters";

function normalizeOrders(response) {
    if (Array.isArray(response)) return response.flatMap((group) => group.orders || [group]);
    return response?.orders || [];
}

export default function BuyerOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState(null);

    const loadOrders = useCallback(async () => {
        setLoading(true); setError("");
        try { setOrders(normalizeOrders(await getMyOrders())); } catch { setError("Không thể tải danh sách đơn mua."); } finally { setLoading(false); }
    }, []);
    useEffect(() => { loadOrders(); }, [loadOrders]);

    const sortedOrders = useMemo(() => [...orders].reverse(), [orders]);
    const handleCancel = async (orderId) => {
        setCancellingId(orderId);
        try { await cancelOrder(orderId); toast.success("Đã gửi yêu cầu hủy đơn."); await loadOrders(); } catch { toast.error("Không thể hủy đơn hàng này."); } finally { setCancellingId(null); }
    };

    return (
        <div className="app-container py-8 sm:py-10">
            <div className="mb-6 flex items-center justify-between gap-3"><div><p className="text-sm text-slate-500">Tài khoản</p><h1 className="text-2xl font-bold sm:text-3xl">Đơn mua của tôi</h1></div><button type="button" className="secondary-button" onClick={loadOrders} disabled={loading}><FiRefreshCw className={loading ? "animate-spin" : ""} /> <span className="hidden sm:inline">Làm mới</span></button></div>
            {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={loadOrders} /> : !sortedOrders.length ? <EmptyState title="Bạn chưa có đơn hàng" description="Các đơn hàng sau khi thanh toán sẽ xuất hiện tại đây." /> : <div className="space-y-4">{sortedOrders.map((order) => <article key={order.id} className="surface-card p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-100 text-orange-600"><FiPackage /></span><div><h2 className="font-bold">Đơn hàng #{order.id}</h2><p className="text-sm text-slate-500">{order.createdAt || "Đang cập nhật thời gian"}</p></div></div><span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold">{order.status || "Đang xử lý"}</span></div><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4"><p className="text-slate-600">Tổng thanh toán: <strong className="text-lg text-orange-600">{formatCurrency(order.totalAmount || order.total)}</strong></p>{!["CANCELLED", "DELIVERED"].includes(order.status) && <button type="button" disabled={cancellingId === order.id} onClick={() => handleCancel(order.id)} className="secondary-button text-red-600">{cancellingId === order.id ? "Đang hủy..." : "Hủy đơn"}</button>}</div></article>)}</div>}
        </div>
    );
}

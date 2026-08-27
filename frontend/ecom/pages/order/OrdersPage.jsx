import { useCallback, useEffect, useState } from "react";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import OrderTable from "../../components/seller/order/OrderTable";
import OrderDetailDrawer from "../../components/seller/order/OrderDetailDrawer";
import { getSellerOrders } from "../../services/sellerService";
import { ErrorState } from "../../components/ui/Feedback";

const TABS = [
    { label: "Tất cả", value: "ALL"},
    { label: "Đã thanh toán", value: "PAID" },
    { label: "Đang xử lý", value: "PROCESSING" },
    { label: "Đang giao", value: "SHIPPING" },
    { label: "Hoàn thành", value: "DELIVERED" },
    { label: "Đã hủy", value: "CANCELLED" }
];

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [keyword, setKeyword] = useState("");
    const [draftKeyword, setDraftKeyword] = useState("");
    const [status, setStatus] = useState("ALL");
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [error, setError] = useState("");

    const loadOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const response = await getSellerOrders({
                page, size, status: status === "ALL" ? undefined : status, keyword: keyword || undefined
            });
            setOrders(response.content || []);
            setTotalPages(response.totalPages || 0);
        } catch {
            setOrders([]);
            setError("Không thể tải danh sách đơn hàng.");
        } finally {
            setLoading(false);
        }
    }, [page, size, status, keyword]);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        setKeyword(draftKeyword.trim());
    };

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        setPage(0);
    };

    return (
        <div className="space-y-6">
            {/* header= */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <h1 className="text-3xl font-bold text-slate-800">
                        Đơn hàng
                    </h1>

                    <p className="mt-1 text-slate-500">
                        Quản lý tất cả đơn hàng của cửa hàng
                    </p>

                </div>

                <button
                    type="button"
                    onClick={loadOrders}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                >
                    <FiRefreshCw
                        className={loading ? "animate-spin" : ""}
                    />
                    Làm mới
                </button>
            </div>

            {/* ================= CONTENT ================= */}

            <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">

                {/*filter */}
                <div className="mb-6 flex flex-wrap gap-3">
                    {TABS.map((tab) => (
                        <button
                            type="button"
                            key={tab.value}
                            onClick={() =>
                                handleStatusChange(tab.value)
                            }
                            className={`rounded-full px-5 py-2 text-sm font-medium transition
                                ${
                                    status === tab.value
                                        ? "bg-orange-500 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* search */}

                <form
                    onSubmit={handleSearch}
                    className="mb-6"
                >
                    <div className="relative">
                        <FiSearch
                            className="absolute left-4 top-3.5 text-slate-400"
                        />
                        <input
                            type="text"
                            value={draftKeyword}
                            onChange={(e) =>
                                setDraftKeyword(e.target.value)
                            }
                            placeholder="Tìm theo mã đơn hoặc tên khách hàng..."
                            className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        />

                    </div>

                </form>
                {/* table */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />
                    </div>
                ) : error ? <ErrorState message={error} onRetry={loadOrders} /> : (<OrderTable orders={orders} onSelect={setSelectedOrder}/>)}

                {/* pagination */}
                {!loading && totalPages > 0 && (
                    <div className="mt-6 flex items-center justify-center gap-2">

                        <button
                            type="button"
                            disabled={page === 0}
                            onClick={() =>
                                setPage((prev) => prev - 1)
                            }
                            className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
                        >
                            Trước
                        </button>

                        <span className="px-4 text-sm text-slate-600">
                            Trang {page + 1} / {totalPages}
                        </span>

                        <button
                            type="button"
                            disabled={page >= totalPages - 1}
                            onClick={() =>
                                setPage((prev) => prev + 1)
                            }
                            className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
                        >
                            Sau
                        </button>

                    </div>
                )}
            </div>

            {/* detail */}
            <OrderDetailDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)}/>

        </div>
    );
}

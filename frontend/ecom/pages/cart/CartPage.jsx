import { useCallback, useEffect, useMemo, useState } from "react";
import { FiMinus, FiPlus, FiShoppingBag, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/Feedback";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatters";

export default function CartPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { cart, isLoading, loadCart, updateQuantity, removeItem } = useCart();
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const load = useCallback(() => {
        setError("");
        return loadCart().catch(() => setError("Không thể tải giỏ hàng của bạn."));
    }, [loadCart]);

    useEffect(() => { if (isAuthenticated) load(); }, [isAuthenticated, load]);

    const groupedItems = useMemo(() => Object.entries((cart?.cartItems || []).reduce((groups, item) => {
        const key = item.shopId || "unknown";
        groups[key] = [...(groups[key] || []), item];
        return groups;
    }, {})), [cart]);
    const subtotal = cart?.cartItems?.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0) || 0;

    const changeQuantity = async (item, nextQuantity) => {
        if (nextQuantity < 1 || updatingId) return;
        setUpdatingId(item.id);
        try { await updateQuantity(item.productId, nextQuantity); } catch { toast.error("Không thể cập nhật số lượng."); } finally { setUpdatingId(null); }
    };
    const remove = async (item) => {
        if (updatingId) return;
        setUpdatingId(item.id);
        try { await removeItem(item.productId); toast.success("Đã xóa sản phẩm khỏi giỏ hàng."); } catch { toast.error("Không thể xóa sản phẩm."); } finally { setUpdatingId(null); }
    };

    if (!isAuthenticated) return <div className="app-container py-10"><EmptyState title="Đăng nhập để xem giỏ hàng" action={<button type="button" className="primary-button" onClick={() => navigate("/login?returnUrl=%2Fcart")}>Đăng nhập</button>} /></div>;

    return (
        <div className="app-container py-8 sm:py-10">
            <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Giỏ hàng</h1>
            {isLoading && !cart ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : !cart?.cartItems?.length ? <EmptyState title="Giỏ hàng đang trống" description="Hãy khám phá sản phẩm và thêm món bạn yêu thích." action={<button type="button" className="primary-button" onClick={() => navigate("/products")}>Tiếp tục mua sắm</button>} /> : (
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
                    <div className="space-y-4">
                        {groupedItems.map(([shopId, items]) => (
                            <section key={shopId} className="surface-card overflow-hidden">
                                <h2 className="flex items-center gap-2 border-b bg-slate-50 px-4 py-3 font-bold sm:px-5"><FiShoppingBag className="text-orange-500" /> Shop #{shopId}</h2>
                                <div className="divide-y">{items.map((item) => (
                                    <article key={item.id} className="grid grid-cols-[5rem_minmax(0,1fr)] gap-3 p-4 sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:items-center sm:gap-5 sm:p-5">
                                        <img src={item.productUrl} alt={item.productName} className="h-20 w-20 rounded-xl border object-cover sm:h-24 sm:w-24" />
                                        <div className="min-w-0"><h3 className="line-clamp-2 font-semibold">{item.productName}</h3><p className="mt-2 font-bold text-orange-600">{formatCurrency(item.unitPrice)}</p><div className="mt-3 inline-flex items-center overflow-hidden rounded-xl border sm:hidden"><button type="button" aria-label="Giảm số lượng" disabled={updatingId === item.id} onClick={() => changeQuantity(item, item.quantity - 1)} className="grid h-10 w-10 place-items-center"><FiMinus /></button><span className="grid h-10 min-w-10 place-items-center border-x">{item.quantity}</span><button type="button" aria-label="Tăng số lượng" disabled={updatingId === item.id} onClick={() => changeQuantity(item, item.quantity + 1)} className="grid h-10 w-10 place-items-center"><FiPlus /></button></div></div>
                                        <div className="col-span-2 flex items-center justify-between sm:col-span-1 sm:flex-col sm:items-end sm:gap-3"><div className="hidden items-center overflow-hidden rounded-xl border sm:inline-flex"><button type="button" aria-label="Giảm số lượng" disabled={updatingId === item.id} onClick={() => changeQuantity(item, item.quantity - 1)} className="grid h-10 w-10 place-items-center"><FiMinus /></button><span className="grid h-10 min-w-10 place-items-center border-x">{item.quantity}</span><button type="button" aria-label="Tăng số lượng" disabled={updatingId === item.id} onClick={() => changeQuantity(item, item.quantity + 1)} className="grid h-10 w-10 place-items-center"><FiPlus /></button></div><p className="font-bold">{formatCurrency(Number(item.unitPrice) * item.quantity)}</p><button type="button" aria-label={`Xóa ${item.productName}`} disabled={updatingId === item.id} onClick={() => remove(item)} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm text-red-600 hover:bg-red-50"><FiTrash2 /> Xóa</button></div>
                                    </article>
                                ))}</div>
                            </section>
                        ))}
                    </div>
                    <aside className="surface-card h-fit p-5 lg:sticky lg:top-24"><h2 className="text-xl font-bold">Tóm tắt giỏ hàng</h2><div className="mt-5 flex justify-between text-slate-600"><span>Tạm tính</span><span>{formatCurrency(subtotal)}</span></div><div className="my-5 border-t" /><div className="flex justify-between text-lg font-bold"><span>Tổng cộng</span><span className="text-orange-600">{formatCurrency(subtotal)}</span></div><button type="button" className="primary-button mt-6 w-full" onClick={() => navigate("/checkout")}>Tiến hành thanh toán</button></aside>
                </div>
            )}
        </div>
    );
}

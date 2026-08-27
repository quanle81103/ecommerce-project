import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { getShopByProduct } from "../../services/dataService";

export default function BrandInfo({ productId }) {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { openChat } = useChat();
    const [shop, setShop] = useState(null);

    useEffect(() => {
        getShopByProduct(productId).then(setShop).catch(() => setShop(null));
    }, [productId]);

    if (!shop) return null;

    const handleChat = async () => {
        if (!isAuthenticated) {
            navigate(`/login?returnUrl=${encodeURIComponent(`/products/${productId}`)}`);
            return;
        }
        try { await openChat(shop); } catch { toast.error("Không thể mở cuộc trò chuyện."); }
    };

    return (
        <section className="surface-card flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
                {shop.logoUrl ? <img src={shop.logoUrl} alt={`Logo ${shop.shopName}`} className="h-16 w-16 shrink-0 rounded-full border object-cover sm:h-20 sm:w-20" /> : <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-orange-100 font-bold text-orange-600 sm:h-20 sm:w-20">SHOP</div>}
                <div className="min-w-0"><h2 className="truncate text-xl font-bold">{shop.shopName}</h2><p className="mt-1 text-sm text-slate-500">Phản hồi trong vài giờ</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" className="primary-button" onClick={handleChat}>Chat ngay</button><button type="button" className="secondary-button" onClick={() => toast.info("Trang shop công khai chưa được backend cung cấp.")}>Xem shop</button></div></div>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm sm:min-w-72"><div className="rounded-xl bg-slate-50 p-3"><dt className="text-slate-500">Sản phẩm</dt><dd className="mt-1 font-bold text-orange-600">{shop.numOfProducts ?? 0}</dd></div><div className="rounded-xl bg-slate-50 p-3"><dt className="text-slate-500">Trạng thái</dt><dd className="mt-1 font-bold text-emerald-600">Đang hoạt động</dd></div></dl>
        </section>
    );
}

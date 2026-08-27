import { useEffect, useMemo, useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { getProductById } from "../../services/dataService";
import { formatCurrency } from "../../utils/formatters";
import { ErrorState, LoadingState } from "../ui/Feedback";

export default function ProductInfo({ productId }) {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError("");
        getProductById(productId).then((response) => active && setProduct(response)).catch((requestError) => active && setError(requestError.response?.status === 404 ? "Sản phẩm không tồn tại." : "Không thể tải thông tin sản phẩm.")).finally(() => active && setLoading(false));
        return () => { active = false; };
    }, [productId]);

    const images = useMemo(() => product?.image?.map((image) => ({ ...image, url: image.imageUrl || image.imageUlr })).filter((image) => image.url) || [], [product]);
    const inventory = Number(product?.inventory) || 0;
    const requireLogin = () => {
        if (isAuthenticated) return false;
        navigate(`/login?returnUrl=${encodeURIComponent(`/products/${productId}`)}`);
        return true;
    };

    const handleAddToCart = async (checkoutAfter = false) => {
        if (requireLogin() || submitting || inventory <= 0) return;
        setSubmitting(true);
        try {
            await addToCart(productId, quantity);
            toast.success("Đã thêm sản phẩm vào giỏ hàng.");
            if (checkoutAfter) navigate("/cart");
        } catch (requestError) {
            toast.error(requestError.response?.data?.message || "Không thể thêm vào giỏ hàng.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingState label="Đang tải thông tin sản phẩm..." />;
    if (error || !product) return <ErrorState message={error || "Sản phẩm không tồn tại."} />;

    return (
        <section className="surface-card p-4 sm:p-6 lg:p-8">
            <div className="grid gap-7 lg:grid-cols-12">
                <div className="lg:col-span-5">
                    <div className="aspect-square overflow-hidden rounded-2xl bg-slate-100">
                        {images.length ? <img src={images[currentIndex]?.url} alt={`${product.name} - ảnh ${currentIndex + 1}`} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-slate-400">Chưa có ảnh sản phẩm</div>}
                    </div>
                    {images.length > 1 && <div className="mt-3 grid grid-cols-5 gap-2">{images.slice(0, 5).map((image, index) => <button key={image.id || image.url} type="button" aria-label={`Xem ảnh ${index + 1}`} onClick={() => setCurrentIndex(index)} className={`aspect-square overflow-hidden rounded-xl border-2 ${currentIndex === index ? "border-orange-500" : "border-transparent"}`}><img src={image.url} alt="" className="h-full w-full object-cover" /></button>)}</div>}
                </div>

                <div className="flex flex-col lg:col-span-7 lg:p-4">
                    <p className="text-sm font-semibold text-orange-600">Sản phẩm chính hãng</p>
                    <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">{product.name}</h1>
                    <div className="mt-5 rounded-2xl bg-orange-50 p-5 text-3xl font-black text-orange-600">{formatCurrency(product.price)}</div>
                    {product.description && <p className="mt-5 whitespace-pre-line leading-7 text-slate-600">{product.description}</p>}
                    <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
                        <span className="font-semibold text-slate-700">Số lượng</span>
                        <div className="inline-flex w-fit items-center overflow-hidden rounded-xl border bg-white">
                            <button type="button" aria-label="Giảm số lượng" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="h-11 w-11 hover:bg-slate-100 disabled:opacity-40">−</button>
                            <output className="grid h-11 min-w-12 place-items-center border-x font-semibold">{quantity}</output>
                            <button type="button" aria-label="Tăng số lượng" disabled={quantity >= inventory} onClick={() => setQuantity((value) => Math.min(inventory, value + 1))} className="h-11 w-11 hover:bg-slate-100 disabled:opacity-40">+</button>
                        </div>
                        <span className="text-sm text-slate-500">{inventory > 0 ? `${inventory} sản phẩm có sẵn` : "Sản phẩm đã hết hàng"}</span>
                    </div>
                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                        <button type="button" disabled={submitting || inventory <= 0} onClick={() => handleAddToCart(false)} className="secondary-button border-orange-500 text-orange-600"><FaCartPlus /> {submitting ? "Đang thêm..." : "Thêm vào giỏ"}</button>
                        <button type="button" disabled={submitting || inventory <= 0} onClick={() => handleAddToCart(true)} className="primary-button">Mua ngay</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

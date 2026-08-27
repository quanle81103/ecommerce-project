import { Link } from "react-router-dom";
import { formatCurrency, getProductImage } from "../../utils/formatters";

export default function ProductCard({ product }) {
    const image = getProductImage(product);
    const outOfStock = Number(product?.inventory) <= 0;

    return (
        <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md">
            <Link to={`/products/${product.id}`} className="block h-full">
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                    {image ? (
                        <img src={image} alt={product?.name || "Sản phẩm"} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
                    ) : (
                        <div className="grid h-full place-items-center px-4 text-center text-sm text-slate-400">Chưa có ảnh</div>
                    )}
                    {outOfStock && <span className="absolute left-2 top-2 rounded-full bg-slate-900/80 px-2 py-1 text-xs font-semibold text-white">Hết hàng</span>}
                </div>
                <div className="p-3 sm:p-4">
                    <h2 className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-slate-800 sm:text-base">{product?.name}</h2>
                    <p className="mt-2 font-bold text-orange-600 sm:text-lg">{formatCurrency(product?.price)}</p>
                    <div className="mt-2 flex justify-between text-xs text-slate-500">
                        <span>Còn {product?.inventory ?? 0}</span>
                        {product?.sold != null && <span>Đã bán {product.sold}</span>}
                    </div>
                </div>
            </Link>
        </article>
    );
}

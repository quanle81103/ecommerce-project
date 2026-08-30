import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import { ErrorState, LoadingState } from "../components/ui/Feedback";
import HeroBanner from "../components/util/HeroBanner";
import { getProducts, responseBanner } from "../services/dataService";

export default function MainPage() {
    const [products, setProducts] = useState([]);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadPage = useCallback(async () => {
        setLoading(true);
        setError("");
        const [productResult, bannerResult] = await Promise.allSettled([getProducts(0), responseBanner()]);
        if (productResult.status === "fulfilled") setProducts(productResult.value?.content || []);
        else setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại.");
        if (bannerResult.status === "fulfilled") setBanners(bannerResult.value || []);
        setLoading(false);
    }, []);

    useEffect(() => { loadPage(); }, [loadPage]);

    return (
        <>
            <HeroBanner banners={banners} loading={loading && !banners.length} />
            <section className="app-container py-10 sm:py-14">
                <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wider text-orange-600">Khám phá hôm nay</p>
                        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Sản phẩm nổi bật</h1>
                    </div>
                    <Link to="/products" className="secondary-button shrink-0">Xem tất cả</Link>
                </div>
                {loading ? <LoadingState label="Đang tải sản phẩm..." /> : error ? <ErrorState message={error} onRetry={loadPage} /> : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
                        {products.map((product) => <ProductCard key={product.id} product={product} />)}
                    </div>
                )}
            </section>

        </>
    );
}

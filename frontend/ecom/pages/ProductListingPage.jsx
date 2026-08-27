import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import { EmptyState, ErrorState, LoadingState } from "../components/ui/Feedback";
import { getProducts } from "../services/dataService";
import { normalizeText } from "../utils/formatters";

export default function ProductListingPage() {
    const [params] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sort, setSort] = useState("default");
    const query = params.get("q") || "";
    const category = params.get("category") || "";
    const categoryName = params.get("categoryName") || "";

    const loadProducts = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getProducts(0);
            setProducts(response?.content || []);
        } catch {
            setError("Không thể tải sản phẩm từ hệ thống.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadProducts(); }, [loadProducts]);

    const visibleProducts = useMemo(() => {
        let result = products.filter((product) => {
            const matchesQuery = !query || normalizeText(product.name).includes(normalizeText(query));
            const matchesCategory = !category || String(product.categoryId) === category;
            return matchesQuery && matchesCategory;
        });
        if (sort === "price-asc") result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
        if (sort === "price-desc") result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
        if (sort === "name") result = [...result].sort((a, b) => a.name.localeCompare(b.name, "vi"));
        return result;
    }, [products, query, category, sort]);

    return (
        <div className="app-container py-8 sm:py-10">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div><p className="text-sm text-slate-500">Trang chủ / Sản phẩm</p><h1 className="mt-1 text-2xl font-bold sm:text-3xl">{query ? `Kết quả cho “${query}”` : categoryName || "Tất cả sản phẩm"}</h1></div>
                <label className="text-sm font-medium text-slate-600">Sắp xếp
                    <select className="field-control mt-1 sm:w-52" value={sort} onChange={(event) => setSort(event.target.value)}>
                        <option value="default">Mặc định</option><option value="price-asc">Giá tăng dần</option><option value="price-desc">Giá giảm dần</option><option value="name">Tên A–Z</option>
                    </select>
                </label>
            </div>
            {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={loadProducts} /> : !visibleProducts.length ? <EmptyState title="Không tìm thấy sản phẩm" description="Thử từ khóa khác hoặc chọn một danh mục khác." /> : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
            )}
        </div>
    );
}

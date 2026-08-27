import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ProductTable from "../../components/seller/product/ProductTable";
import ProductToolbar from "../../components/seller/product/ProductToolbar";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/Feedback";
import { deleteProduct, getProductsOfShop } from "../../services/dataService";
import { normalizeText } from "../../utils/formatters";

export default function SellerProductPage() {
    const [products, setProducts] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [pendingDelete, setPendingDelete] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const loadProducts = useCallback(async () => {
        setLoading(true); setError("");
        try { setProducts(await getProductsOfShop() || []); } catch { setError("Không thể tải danh sách sản phẩm của shop."); } finally { setLoading(false); }
    }, []);
    useEffect(() => { loadProducts(); }, [loadProducts]);
    const filteredProducts = useMemo(() => products.filter((product) => normalizeText(product.name).includes(normalizeText(keyword))), [products, keyword]);

    const confirmDelete = async () => {
        if (!pendingDelete) return;
        setDeletingId(pendingDelete.id);
        try {
            await deleteProduct(pendingDelete.id);
            setProducts((current) => current.filter((product) => product.id !== pendingDelete.id));
            toast.success("Đã xóa sản phẩm.");
            setPendingDelete(null);
        } catch (requestError) {
            toast.error(requestError.response?.data?.message || "Xóa sản phẩm thất bại.");
        } finally { setDeletingId(null); }
    };

    return <div><div className="mb-6"><h1 className="text-2xl font-bold sm:text-3xl">Sản phẩm</h1><p className="mt-1 text-slate-500">Quản lý sản phẩm đang bán trong cửa hàng.</p></div><ProductToolbar keyword={keyword} onKeywordChange={setKeyword} />{loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={loadProducts} /> : !filteredProducts.length ? <EmptyState title={keyword ? "Không tìm thấy sản phẩm" : "Shop chưa có sản phẩm"} description={keyword ? "Thử một từ khóa khác." : "Thêm sản phẩm đầu tiên để bắt đầu bán hàng."} /> : <ProductTable products={filteredProducts} handleDelete={(id) => setPendingDelete(products.find((product) => product.id === id))} deletingId={deletingId} />}<ConfirmDialog open={Boolean(pendingDelete)} title="Xóa sản phẩm?" description={"Sản phẩm “" + (pendingDelete?.name || "") + "” sẽ bị xóa vĩnh viễn."} confirmLabel="Xóa sản phẩm" loading={Boolean(deletingId)} onConfirm={confirmDelete} onClose={() => setPendingDelete(null)} /></div>;
}

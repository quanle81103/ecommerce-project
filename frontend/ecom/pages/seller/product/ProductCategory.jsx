import { useEffect, useState } from "react";
import { getBrands, getCategories } from "../../../services/dataService";

export default function ProductCategory({ form, handleChange, errors, mode }) {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        Promise.all([getCategories(), getBrands()]).then(([categoryList, brandList]) => { setCategories(categoryList || []); setBrands(brandList || []); }).catch(() => undefined).finally(() => setLoading(false));
    }, []);
    const disabled = loading || mode === "edit";
    return <section className="surface-card p-5 sm:p-6"><h2 className="text-xl font-bold">Danh mục</h2>{mode === "edit" && <p className="mt-2 text-sm text-slate-500">API hiện tại chưa hỗ trợ đổi danh mục và thương hiệu khi cập nhật.</p>}<div className="mt-5 grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold">Danh mục<select name="categoryId" value={form.categoryId} onChange={handleChange} disabled={disabled} className="field-control mt-2 font-normal"><option value="">{loading ? "Đang tải..." : "Chọn danh mục"}</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>{errors.categoryId && <span className="mt-1 block font-normal text-red-600">{errors.categoryId}</span>}</label><label className="text-sm font-semibold">Thương hiệu<select name="brandId" value={form.brandId} onChange={handleChange} disabled={disabled} className="field-control mt-2 font-normal"><option value="">{loading ? "Đang tải..." : "Chọn thương hiệu"}</option>{brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}</select>{errors.brandId && <span className="mt-1 block font-normal text-red-600">{errors.brandId}</span>}</label></div></section>;
}

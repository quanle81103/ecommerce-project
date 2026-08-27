import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { responseCategory } from "../../services/dataService";

export default function CategoryBar() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        responseCategory().then(setCategories).catch(() => setCategories([]));
    }, []);

    if (!categories.length) return null;

    return (
        <nav aria-label="Danh mục sản phẩm" className="border-b bg-white">
            <div className="app-container flex gap-2 overflow-x-auto py-2 [scrollbar-width:none]">
                <button type="button" onClick={() => navigate("/products")} className="min-h-10 shrink-0 rounded-full bg-orange-500 px-4 text-sm font-semibold text-white">Tất cả</button>
                {categories.map((category) => (
                    <button key={category.id} type="button" onClick={() => navigate(`/products?category=${category.id}&categoryName=${encodeURIComponent(category.name)}`)} className="min-h-10 shrink-0 rounded-full bg-slate-100 px-4 text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600">
                        {category.name}
                    </button>
                ))}
            </div>
        </nav>
    );
}

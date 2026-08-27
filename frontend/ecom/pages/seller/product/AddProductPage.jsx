import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../../context/AuthContext";
import { createProduct, getProductById, updateProduct } from "../../../services/dataService";
import ProductForm from "./ProductForm";

const initialForm = { name: "", description: "", categoryId: "", brandId: "", price: "", inventory: "", weight: "", length: "", width: "", height: "" };

export default function AddProductPage({ mode = "create" }) {
    const navigate = useNavigate();
    const { productId } = useParams();
    const { shop } = useAuth();
    const [form, setForm] = useState(initialForm);
    const [files, setFiles] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(mode === "edit");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (mode !== "edit" || !productId) return;
        getProductById(productId).then((product) => setForm((current) => ({
            ...current,
            name: product.name || "",
            description: product.description || "",
            categoryId: product.categoryId || "",
            brandId: product.brandId || "",
            price: product.price || "",
            inventory: product.inventory ?? ""
        }))).catch(() => toast.error("Không thể tải sản phẩm cần sửa.")).finally(() => setLoading(false));
    }, [mode, productId]);

    const handleChange = (event) => {
        setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
        setErrors((current) => ({ ...current, [event.target.name]: "" }));
    };

    const validate = () => {
        const next = {};
        if (!form.name.trim()) next.name = "Vui lòng nhập tên sản phẩm.";
        if (!form.description.trim()) next.description = "Vui lòng nhập mô tả sản phẩm.";
        if (!form.categoryId) next.categoryId = "Vui lòng chọn danh mục.";
        if (!form.brandId) next.brandId = "Vui lòng chọn thương hiệu.";
        if (Number(form.price) <= 0) next.price = "Giá phải lớn hơn 0.";
        if (Number(form.inventory) < 0 || form.inventory === "") next.inventory = "Tồn kho phải từ 0 trở lên.";
        if (mode === "create") {
            for (const key of ["weight", "length", "width", "height"]) if (Number(form[key]) < 1) next[key] = "Giá trị phải từ 1 trở lên.";
            if (!files.length) next.files = "Vui lòng chọn ít nhất một ảnh sản phẩm.";
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate() || submitting) return;
        setSubmitting(true);
        try {
            if (mode === "edit") {
                await updateProduct(productId, { name: form.name.trim(), description: form.description.trim(), price: Number(form.price), inventory: Number(form.inventory) });
                toast.success("Đã cập nhật sản phẩm.");
            } else {
                const formData = new FormData();
                Object.entries({ ...form, shopId: shop.id }).forEach(([key, value]) => formData.append(key, value));
                files.forEach((file) => formData.append("files", file));
                await createProduct(formData);
                toast.success("Đã đăng sản phẩm.");
            }
            navigate("/seller/products");
        } catch (error) {
            toast.error(error.response?.data?.message || (mode === "edit" ? "Cập nhật sản phẩm thất bại." : "Đăng sản phẩm thất bại."));
        } finally { setSubmitting(false); }
    };

    if (loading) return <div className="surface-card p-8 text-center text-slate-500">Đang tải sản phẩm...</div>;
    return <div><h1 className="mb-7 text-2xl font-bold sm:text-3xl">{mode === "edit" ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}</h1><ProductForm form={form} files={files} setFiles={setFiles} handleChange={handleChange} handleSubmit={handleSubmit} errors={errors} submitting={submitting} mode={mode} /></div>;
}

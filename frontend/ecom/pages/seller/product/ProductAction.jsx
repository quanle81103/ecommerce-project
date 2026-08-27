import { useNavigate } from "react-router-dom";

export default function ProductAction({ handleSubmit, submitting, mode }) {
    const navigate = useNavigate();
    return <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row"><button type="button" onClick={() => navigate("/seller/products")} disabled={submitting} className="secondary-button">Hủy</button><button type="button" onClick={handleSubmit} disabled={submitting} className="primary-button">{submitting ? "Đang lưu..." : mode === "edit" ? "Lưu thay đổi" : "Đăng sản phẩm"}</button></div>;
}

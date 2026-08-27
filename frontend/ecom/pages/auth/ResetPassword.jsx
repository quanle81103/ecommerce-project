import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { responseResetPassword } from "../../services/authService";
import { resetPasswordSchema } from "../../utils/authSchema";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const rawToken = searchParams.get("token");
    const [form, setForm] = useState({ password: "", confirmPassword: "" });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!rawToken) { toast.error("Liên kết đặt lại mật khẩu không hợp lệ."); return; }
        const result = resetPasswordSchema.safeParse(form);
        if (!result.success) { setErrors(Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message]))); return; }
        setSubmitting(true);
        try { await responseResetPassword(rawToken, form.password); toast.success("Đổi mật khẩu thành công."); navigate("/login", { replace: true }); } catch (error) { toast.error(error.response?.data?.message || "Không thể đổi mật khẩu."); } finally { setSubmitting(false); }
    };
    if (!rawToken) return <div className="app-container grid min-h-[65vh] place-items-center py-10"><div className="surface-card max-w-md p-8 text-center"><h1 className="text-2xl font-bold">Liên kết không hợp lệ</h1><p className="mt-3 text-slate-500">Vui lòng yêu cầu một liên kết đặt lại mật khẩu mới.</p><Link to="/forget-password" className="primary-button mt-6">Yêu cầu liên kết mới</Link></div></div>;
    return <div className="app-container grid min-h-[65vh] place-items-center py-10"><form onSubmit={handleSubmit} className="surface-card w-full max-w-md p-6 sm:p-8"><h1 className="text-2xl font-bold">Đặt lại mật khẩu</h1><label className="mt-6 block text-sm font-semibold">Mật khẩu mới<input type="password" autoComplete="new-password" value={form.password} onChange={(event) => setForm((value) => ({ ...value, password: event.target.value }))} className="field-control mt-2" />{errors.password && <span className="mt-1 block font-normal text-red-600">{errors.password}</span>}</label><label className="mt-5 block text-sm font-semibold">Xác nhận mật khẩu<input type="password" autoComplete="new-password" value={form.confirmPassword} onChange={(event) => setForm((value) => ({ ...value, confirmPassword: event.target.value }))} className="field-control mt-2" />{errors.confirmPassword && <span className="mt-1 block font-normal text-red-600">{errors.confirmPassword}</span>}</label><button type="submit" disabled={submitting} className="primary-button mt-6 w-full">{submitting ? "Đang cập nhật..." : "Cập nhật mật khẩu"}</button></form></div>;
}

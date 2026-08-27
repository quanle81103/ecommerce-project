import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { responseForgetPassword } from "../../services/authService";
import { forgetPasswordSchema } from "../../utils/authSchema";

export default function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const handleSubmit = async (event) => {
        event.preventDefault();
        const result = forgetPasswordSchema.safeParse({ email });
        if (!result.success) { setError(result.error.issues[0].message); return; }
        setError(""); setSubmitting(true);
        try { await responseForgetPassword(email); setSent(true); } catch (requestError) { toast.error(requestError.response?.data?.message || "Không thể gửi email khôi phục."); } finally { setSubmitting(false); }
    };
    return <div className="app-container grid min-h-[65vh] place-items-center py-10"><div className="surface-card w-full max-w-md p-6 sm:p-8">{sent ? <div className="text-center"><p className="text-5xl" aria-hidden="true">✉️</p><h1 className="mt-4 text-2xl font-bold">Hãy kiểm tra email</h1><p className="mt-3 text-slate-500">Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu tới <strong>{email}</strong>.</p><Link to="/login" className="primary-button mt-6">Về trang đăng nhập</Link></div> : <form onSubmit={handleSubmit} noValidate><h1 className="text-2xl font-bold">Quên mật khẩu</h1><p className="mt-2 text-sm text-slate-500">Nhập email đã đăng ký để nhận liên kết khôi phục.</p><label htmlFor="forgot-email" className="mt-6 block text-sm font-semibold">Email</label><input id="forgot-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="field-control mt-2" />{error && <p className="mt-1 text-sm text-red-600">{error}</p>}<button type="submit" disabled={submitting} className="primary-button mt-6 w-full">{submitting ? "Đang gửi..." : "Gửi liên kết khôi phục"}</button><Link to="/login" className="mt-5 block text-center text-sm font-semibold text-orange-600">Quay lại đăng nhập</Link></form>}</div></div>;
}

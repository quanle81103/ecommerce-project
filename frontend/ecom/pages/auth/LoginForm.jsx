import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { response } from "../../services/authService";
import { loginSchema } from "../../utils/authSchema";

export default function LoginForm() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const { initializeAuth } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const result = loginSchema.safeParse(form);
        if (!result.success) {
            setErrors(Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message])));
            return;
        }
        setErrors({});
        setSubmitting(true);
        try {
            const token = await response(form.email, form.password);
            localStorage.setItem("Token", token);
            await initializeAuth();
            const returnUrl = params.get("returnUrl");
            navigate(returnUrl?.startsWith("/") ? returnUrl : "/", { replace: true });
            toast.success("Đăng nhập thành công.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Email hoặc mật khẩu không đúng.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="app-container grid min-h-[70vh] place-items-center py-10">
            <form onSubmit={handleSubmit} className="surface-card w-full max-w-md p-6 sm:p-8" noValidate>
                <p className="text-sm font-bold uppercase tracking-wider text-orange-600">Chào mừng trở lại</p>
                <h1 className="mt-1 text-3xl font-bold">Đăng nhập</h1>
                <p className="mt-2 text-sm text-slate-500">Đăng nhập để mua sắm và quản lý đơn hàng.</p>
                <label className="mt-7 block text-sm font-semibold" htmlFor="login-email">Email</label>
                <input id="login-email" type="email" autoComplete="email" className="field-control mt-2" value={form.email} onChange={(event) => setForm((value) => ({ ...value, email: event.target.value }))} aria-invalid={Boolean(errors.email)} />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                <div className="mt-5 flex items-center justify-between"><label className="text-sm font-semibold" htmlFor="login-password">Mật khẩu</label><Link to="/forget-password" className="text-sm font-semibold text-orange-600 hover:underline">Quên mật khẩu?</Link></div>
                <div className="relative mt-2"><input id="login-password" type={showPassword ? "text" : "password"} autoComplete="current-password" className="field-control pr-12" value={form.password} onChange={(event) => setForm((value) => ({ ...value, password: event.target.value }))} aria-invalid={Boolean(errors.password)} /><button type="button" aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} onClick={() => setShowPassword((value) => !value)} className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg text-slate-500">{showPassword ? <FaEyeSlash /> : <FaEye />}</button></div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                <button type="submit" disabled={submitting} className="primary-button mt-6 w-full">{submitting ? "Đang đăng nhập..." : "Đăng nhập"}</button>
                <p className="mt-6 text-center text-sm text-slate-600">Chưa có tài khoản? <Link to="/register" className="font-bold text-orange-600 hover:underline">Đăng ký ngay</Link></p>
            </form>
        </div>
    );
}

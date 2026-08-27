import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { registerUser } from "../../services/authService";
import { registerSchema } from "../../utils/authSchema";

const initialForm = { firstName: "", lastName: "", email: "", phone: "", place: "", password: "", confirmPassword: "" };

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const updateField = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));

    const handleSubmit = async (event) => {
        event.preventDefault();
        const result = registerSchema.safeParse(form);
        if (!result.success) {
            setErrors(Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message])));
            return;
        }
        setErrors({});
        setSubmitting(true);
        try {
            const { confirmPassword, ...request } = result.data;
            void confirmPassword;
            await registerUser(request);
            toast.success("Tạo tài khoản thành công. Hãy đăng nhập.");
            navigate("/login", { replace: true });
        } catch (error) {
            toast.error(error.response?.data?.message || "Không thể tạo tài khoản.");
        } finally {
            setSubmitting(false);
        }
    };

    const field = (name, label, type = "text", autoComplete) => (
        <label className="block text-sm font-semibold">{label}<input name={name} type={type} autoComplete={autoComplete} value={form[name]} onChange={updateField} className="field-control mt-2 font-normal" aria-invalid={Boolean(errors[name])} />{errors[name] && <span className="mt-1 block font-normal text-red-600">{errors[name]}</span>}</label>
    );

    return (
        <div className="app-container grid min-h-[70vh] place-items-center py-10">
            <form onSubmit={handleSubmit} className="surface-card w-full max-w-2xl p-6 sm:p-8" noValidate>
                <p className="text-sm font-bold uppercase tracking-wider text-orange-600">Tài khoản mới</p><h1 className="mt-1 text-3xl font-bold">Đăng ký</h1>
                <div className="mt-7 grid gap-5 sm:grid-cols-2">{field("lastName", "Họ", "text", "family-name")}{field("firstName", "Tên", "text", "given-name")}</div>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">{field("email", "Email", "email", "email")}{field("phone", "Số điện thoại", "tel", "tel")}</div>
                <div className="mt-5">{field("place", "Địa chỉ", "text", "street-address")}</div>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <label className="block text-sm font-semibold">Mật khẩu<div className="relative mt-2"><input name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={form.password} onChange={updateField} className="field-control pr-12 font-normal" /><button type="button" aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} onClick={() => setShowPassword((value) => !value)} className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center">{showPassword ? <FaEyeSlash /> : <FaEye />}</button></div>{errors.password && <span className="mt-1 block font-normal text-red-600">{errors.password}</span>}</label>
                    {field("confirmPassword", "Xác nhận mật khẩu", showPassword ? "text" : "password", "new-password")}
                </div>
                <button type="submit" disabled={submitting} className="primary-button mt-7 w-full">{submitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}</button>
                <p className="mt-6 text-center text-sm text-slate-600">Đã có tài khoản? <Link to="/login" className="font-bold text-orange-600 hover:underline">Đăng nhập</Link></p>
            </form>
        </div>
    );
}

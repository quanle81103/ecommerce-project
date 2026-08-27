import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { updateUserProfile } from "../../services/dataService";

export default function ProfilePage() {
    const { user, initializeAuth } = useAuth();
    const [form, setForm] = useState({ firstName: "", lastName: "", phone: "" });
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setForm({ firstName: user?.firstName || "", lastName: user?.lastName || "", phone: user?.phone || "" });
    }, [user]);

    const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    const handleSubmit = async (event) => {
        event.preventDefault();
        const nextErrors = {};
        if (!form.firstName.trim()) nextErrors.firstName = "Vui lòng nhập tên.";
        if (!form.lastName.trim()) nextErrors.lastName = "Vui lòng nhập họ.";
        if (form.phone && !/^(0|\+84)\d{9}$/.test(form.phone.trim())) nextErrors.phone = "Số điện thoại không hợp lệ.";
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) return;
        setSubmitting(true);
        try { await updateUserProfile(form); await initializeAuth(); toast.success("Đã cập nhật hồ sơ."); } catch (error) { toast.error(error.response?.data?.message || "Không thể cập nhật hồ sơ."); } finally { setSubmitting(false); }
    };

    const field = (name, label, autoComplete) => <label className="block text-sm font-semibold">{label}<input name={name} value={form[name]} onChange={update} autoComplete={autoComplete} className="field-control mt-2 font-normal" />{errors[name] && <span className="mt-1 block font-normal text-red-600">{errors[name]}</span>}</label>;

    return <div className="app-container py-8 sm:py-10"><div className="mx-auto max-w-2xl"><p className="text-sm text-slate-500">Tài khoản</p><h1 className="text-2xl font-bold sm:text-3xl">Hồ sơ cá nhân</h1><form onSubmit={handleSubmit} className="surface-card mt-6 p-5 sm:p-7"><div className="grid gap-5 sm:grid-cols-2">{field("lastName", "Họ", "family-name")}{field("firstName", "Tên", "given-name")}</div><label className="mt-5 block text-sm font-semibold">Email<input value={user?.email || ""} readOnly className="field-control mt-2 bg-slate-50 font-normal text-slate-500" /></label><div className="mt-5">{field("phone", "Số điện thoại", "tel")}</div><button type="submit" disabled={submitting} className="primary-button mt-7 w-full sm:w-auto">{submitting ? "Đang lưu..." : "Lưu thay đổi"}</button></form></div></div>;
}

import { useEffect, useRef } from "react";

export default function ConfirmDialog({ open, title, description, confirmLabel = "Xác nhận", loading = false, onConfirm, onClose }) {
    const cancelRef = useRef(null);
    useEffect(() => {
        if (!open) return undefined;
        cancelRef.current?.focus();
        const closeOnEscape = (event) => event.key === "Escape" && !loading && onClose();
        document.addEventListener("keydown", closeOnEscape);
        return () => document.removeEventListener("keydown", closeOnEscape);
    }, [open, loading, onClose]);
    if (!open) return null;
    return <div className="fixed inset-0 z-60 grid place-items-center p-4"><button type="button" aria-label="Đóng hộp thoại" onClick={onClose} disabled={loading} className="absolute inset-0 bg-slate-950/45" /><div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" className="surface-card relative w-full max-w-md p-6 shadow-2xl"><h2 id="confirm-title" className="text-xl font-bold">{title}</h2><p className="mt-3 text-slate-600">{description}</p><div className="mt-6 flex justify-end gap-3"><button ref={cancelRef} type="button" disabled={loading} className="secondary-button" onClick={onClose}>Hủy</button><button type="button" disabled={loading} className="primary-button bg-red-600 hover:bg-red-700" onClick={onConfirm}>{loading ? "Đang xử lý..." : confirmLabel}</button></div></div></div>;
}

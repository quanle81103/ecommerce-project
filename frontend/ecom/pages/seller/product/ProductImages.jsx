import { useEffect, useMemo } from "react";

export default function ProductImages({ files, setFiles, errors, mode }) {
    const previews = useMemo(() => files.map((file) => ({ file, url: URL.createObjectURL(file) })), [files]);
    useEffect(() => () => previews.forEach((preview) => URL.revokeObjectURL(preview.url)), [previews]);
    const handleSelect = (event) => {
        const selected = Array.from(event.target.files || []).filter((file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024).slice(0, 5);
        setFiles(selected);
    };
    if (mode === "edit") return <section className="surface-card p-5 sm:p-6"><h2 className="text-xl font-bold">Hình ảnh sản phẩm</h2><p className="mt-2 text-sm text-slate-500">API hiện tại chưa hỗ trợ cập nhật ảnh cùng thông tin sản phẩm. Ảnh hiện có sẽ được giữ nguyên.</p></section>;
    return <section className="surface-card p-5 sm:p-6"><h2 className="text-xl font-bold">Hình ảnh sản phẩm</h2><p className="mt-1 text-sm text-slate-500">Tối đa 5 ảnh, mỗi ảnh không quá 5 MB.</p><label className="secondary-button mt-5 cursor-pointer">Chọn ảnh<input type="file" multiple accept="image/*" onChange={handleSelect} className="sr-only" /></label>{errors.files && <p className="mt-2 text-sm text-red-600">{errors.files}</p>}<div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{previews.map((preview) => <img src={preview.url} alt={"Xem trước " + preview.file.name} key={preview.url} className="aspect-square w-full rounded-xl border object-cover" />)}</div></section>;
}

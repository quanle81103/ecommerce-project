import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return <main className="grid min-h-screen place-items-center bg-slate-50 p-4"><div className="surface-card max-w-lg p-8 text-center sm:p-12"><p className="text-6xl font-black text-orange-500">404</p><h1 className="mt-4 text-2xl font-bold">Không tìm thấy trang</h1><p className="mt-3 text-slate-500">Đường dẫn không tồn tại hoặc đã được thay đổi.</p><Link to="/" className="primary-button mt-6">Về trang chủ</Link></div></main>;
}

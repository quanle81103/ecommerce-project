import { FiAlertCircle, FiInbox } from "react-icons/fi";

export function LoadingState({ label = "Đang tải dữ liệu..." }) {
    return (
        <div className="surface-card grid min-h-56 place-items-center p-8" role="status">
            <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />
                <p className="mt-4 text-sm text-slate-500">{label}</p>
            </div>
        </div>
    );
}

export function EmptyState({ title = "Chưa có dữ liệu", description, action }) {
    return (
        <div className="surface-card flex min-h-56 flex-col items-center justify-center p-8 text-center">
            <FiInbox className="mb-3 text-4xl text-slate-300" aria-hidden="true" />
            <h2 className="text-lg font-bold text-slate-800">{title}</h2>
            {description && <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>}
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}

export function ErrorState({ message = "Không thể tải dữ liệu.", onRetry }) {
    return (
        <div className="surface-card flex min-h-56 flex-col items-center justify-center p-8 text-center" role="alert">
            <FiAlertCircle className="mb-3 text-4xl text-red-400" aria-hidden="true" />
            <h2 className="text-lg font-bold text-slate-800">Đã có lỗi xảy ra</h2>
            <p className="mt-2 max-w-md text-sm text-slate-500">{message}</p>
            {onRetry && <button type="button" className="primary-button mt-5" onClick={onRetry}>Thử lại</button>}
        </div>
    );
}

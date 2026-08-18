const STATUS_CONFIG = {
    PROCESSING: {
        label: "Đang xử lý",
        className: "bg-amber-100 text-amber-700 border border-amber-200"
    },

    SHIPPING: {
        label: "Đang giao",
        className: "bg-sky-100 text-sky-700 border border-sky-200"
    },

    DELIVERED: {
        label: "Hoàn thành",
        className: "bg-emerald-100 text-emerald-700 border border-emerald-200"
    },

    CANCELLED: {
        label: "Đã hủy",
        className: "bg-red-100 text-red-700 border border-red-200"
    },

    PAID: {
        label: "Đã thanh toán",
        className:"bg-green-100 text-green-700 border border-green-200"
    },

    ALL: {
        label: "Tất cả",
        className:"bg-yellow-100 text-yellow-700 border border-yellow-200"
    }
};

export default function OrderStatusBadge({ status }) {

    const config = STATUS_CONFIG[status] || {
            label: status,
            className: "bg-slate-100 text-slate-700 border"
        };

    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
        >
            <span className="mr-2 h-2 w-2 rounded-full bg-current opacity-70"></span>
            {config.label}
        </span>
    );
}
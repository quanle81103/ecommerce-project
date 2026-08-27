const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0
    }).format(value);

export default function RevenueCard({
    icon,
    title,
    value,
    isMoney = true
}) {
    return (
        <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <h2 className="mt-3 text-3xl font-bold text-slate-800">
                        {isMoney ? formatCurrency(value) : value.toLocaleString()}
                    </h2>

                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 transition-transform duration-300 group-hover:scale-110">
                    {icon}
                </div>

            </div>

        </div>
    );
}

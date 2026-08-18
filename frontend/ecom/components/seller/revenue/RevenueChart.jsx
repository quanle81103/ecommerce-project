import {ResponsiveContainer,LineChart,Line,CartesianGrid,XAxis,YAxis,Tooltip} from "recharts";
const formatMoney = (value) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0
    }).format(value);

export default function RevenueChart({ data }) {

    return (

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-800">
                    Doanh thu theo ngày
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Thống kê doanh thu trong khoảng thời gian đã chọn
                </p>
            </div>

            <div className="h-95">  
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{top: 10, right: 20, left: 10, bottom: 0}}>
                        <CartesianGrid strokeDasharray="4 4"/>
                        <XAxis dataKey="date"/>
                        <YAxis tickFormatter={(v) => `${(v/1000).toFixed(0)}k`}/>
                        <Tooltip formatter={(value) => formatMoney(value)}/>
                        <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{r: 5}} activeDot={{r: 8}}/>
                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

}
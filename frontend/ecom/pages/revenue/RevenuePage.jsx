import { useEffect, useState } from "react";
import RevenueCard from "../../components/seller/revenue/RevenueCard";
import RevenueChart from "../../components/seller/revenue/RevenueChart";
import TopProductTable from "../../components/seller/revenue/TopProductTable";

import {FiDollarSign, FiShoppingBag, FiUsers, FiPackage} from "react-icons/fi";
import { getRevenueChartResponse, getRevenueResponse, getTopProductResponse } from "../../services/sellerService";

export default function RevenuePage() {

    const [summary, setSummary] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadData = async() => {
        try {
            setLoading(true);

            const [summaryRes, chartRes, productRes] = await Promise.all([getRevenueResponse(), getRevenueChartResponse(), getTopProductResponse()]);
            setSummary(summaryRes);
            setChartData(chartRes);
            setTopProducts(productRes);
        } catch (error) {
            console.log("Revenue Page error", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    },[]);

    return(

        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Doanh thu</h1>
                    <p className="text-slate-500 mt-1">
                        Thống kê doanh thu cửa hàng
                    </p>
                </div>
                <button onClick={loadData} disabled={loading}
                    className="rounded-xl bg-emerald-500 px-5 py-3 text-white hover:bg-emerald-600"
                >
                    {loading ? "Đang tải ...." : "Làm mới"}
                </button>

            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

                <RevenueCard
                    icon={<FiDollarSign size={24}/>}
                    title="Doanh thu"
                    value={summary?.revenue ?? 0}
                />

                <RevenueCard
                    icon={<FiShoppingBag size={24}/>}
                    title="Đơn hàng"
                    value={summary?.totalOrders ?? 0}
                    isMoney={false}
                />

                <RevenueCard
                    icon={<FiPackage size={24}/>}
                    title="Đã bán"
                    value={summary?.totalProductSolds ?? 0}
                    isMoney={false}
                />

                <RevenueCard
                    icon={<FiUsers size={24}/>}
                    title="Khách hàng"
                    value={summary?.totalCustomers ?? 0}
                    isMoney={false}
                />

            </div>

            <RevenueChart data={chartData}/>

            <TopProductTable products={topProducts} />

        </div>

    );

}
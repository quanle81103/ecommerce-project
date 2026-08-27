import { useCallback, useEffect, useState } from "react";
import RevenueCard from "../../components/seller/revenue/RevenueCard";
import RevenueChart from "../../components/seller/revenue/RevenueChart";
import TopProductTable from "../../components/seller/revenue/TopProductTable";

import {FiDollarSign, FiShoppingBag, FiUsers, FiPackage} from "react-icons/fi";
import { getRevenueChartResponse, getRevenueResponse, getTopProductResponse } from "../../services/sellerService";
import { ErrorState, LoadingState } from "../../components/ui/Feedback";

export default function RevenuePage() {

    const [summary, setSummary] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadData = useCallback(async() => {
        try {
            setLoading(true);
            setError("");

            const [summaryRes, chartRes, productRes] = await Promise.all([getRevenueResponse(), getRevenueChartResponse(), getTopProductResponse()]);
            setSummary(summaryRes);
            setChartData(chartRes);
            setTopProducts(productRes);
        } catch {
            setSummary(null);
            setChartData([]);
            setTopProducts([]);
            setError("Không thể tải dữ liệu doanh thu.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    },[loadData]);

    if (loading && !summary) return <LoadingState label="Đang tải báo cáo doanh thu..." />;
    if (error) return <ErrorState message={error} onRetry={loadData} />;

    return(

        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Doanh thu</h1>
                    <p className="text-slate-500 mt-1">
                        Thống kê doanh thu cửa hàng
                    </p>
                </div>
                <button type="button" onClick={loadData} disabled={loading}
                    className="primary-button"
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

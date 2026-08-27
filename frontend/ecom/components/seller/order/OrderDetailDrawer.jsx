import {FiX,FiUser,FiPhone,FiMapPin,FiPackage,FiTruck,FiDollarSign} from "react-icons/fi";
import { useState, useEffect } from "react";
import { getSellerOrderDetail } from "../../../services/sellerService";
import { handover, updateSellerOrderStatus } from "../../../services/sellerService";
import { cancelOrder } from "../../../services/dataService";
import { toast } from "sonner";

const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
    }).format(value);

export default function OrderDetailDrawer({ order, onClose }) {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!order) {
            setDetail(null);
            return;
        }

        const loadDetail = async () => {
            try {
                setLoading(true);
                const response = await getSellerOrderDetail(order.id);
                setDetail(response);
            } catch {
                toast.error("Không thể tải chi tiết đơn hàng.");
            } finally {
                setLoading(false);
            }
        };

        loadDetail();

    }, [order]);

    useEffect(() => {
        if (!order) return undefined;
        const closeOnEscape = (event) => event.key === "Escape" && onClose();
        document.addEventListener("keydown", closeOnEscape);
        return () => document.removeEventListener("keydown", closeOnEscape);
    }, [order, onClose]);

    const handleHandover = async() => {
        const id1 = toast.loading("Đang bàn giao GHN...");
        try {
            setLoading(true);
            await handover(detail.id);
            setDetail(prev => ({
                ...prev, status: "SHIPPING"
            }));
            toast.success("Bàn giao GHN thành công",{id1});
        } catch {
            toast.error("Bàn giao GHN thất bại", {id1});
        } finally {
            setLoading(false);
        }
    }

    const handleDelivered = async() => {
        const id2 = toast.loading("Đang xác nhân gia hàng...");
        try {
            setLoading(true);
            await updateSellerOrderStatus(detail.id);
            setDetail(prev => ({
                ...prev, status: "DELIVERED"
            }));
            toast.success("Đã xác nhận giao hàng thành công", {id2});
        } catch {
            toast.error("Cập nhật trạng thái thất bại", {id2});
        } finally {
            setLoading(false);
        }
    }

    const handleCancel = async() => {
        const id3 = toast.loading("Đang hủy đơn...");
        try {
            setLoading(true);

            await cancelOrder(detail.id);

            setDetail(prev => ({
                ...prev,
                status: "CANCELLED"
            }));

            toast.success("Đã hủy đơn hàng", {id3});
        } catch {
            toast.error("Hủy đơn thất bại", {id3});
        } finally {
            setLoading(false);
        }
    }

    if (!order) return null;

    if (loading) {
        return (
            <>
                <button
                    type="button"
                    aria-label="Đóng chi tiết đơn hàng"
                    onClick={onClose}
                    className="fixed inset-0 bg-black/40"
                />
                <div className="fixed right-0 top-0 flex h-screen w-full max-w-xl items-center justify-center bg-white">
                    Đang tải...
                </div>
            </>
        );
    }

    const items = detail?.items || [];

    return (
        <>
            {/* Overlay */}
            <button
                type="button"
                aria-label="Đóng chi tiết đơn hàng"
                onClick={onClose}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-xl flex-col bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-5">
                    <div>
                        <h2 className="text-xl font-bold">
                            Đơn hàng #{detail?.id}
                        </h2>

                        <p className="text-sm text-slate-500">
                            {detail?.createdAt}
                        </p>
                    </div>

                    <button
                        type="button"
                        aria-label="Đóng chi tiết đơn hàng"
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-slate-100"
                    >
                        <FiX size={22} />
                    </button>

                </div>

                {/* Body */}
                <div className="flex-1 space-y-6 overflow-y-auto p-6">
                    {/* Customer */}
                    <div className="rounded-xl border p-5">
                        <h3 className="mb-4 font-semibold">
                            Thông tin khách hàng
                        </h3>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <FiUser />
                                <span>{detail?.customerName}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <FiPhone />
                                <span>{detail?.customerPhone}</span>
                            </div>

                            <div className="flex items-start gap-3">
                                <FiMapPin className="mt-1" />
                                <span>
                                    {detail?.customerAddress}
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* Products */}
                    <div className="rounded-xl border p-5">

                        <div className="mb-4 flex items-center gap-2">
                            <FiPackage />
                            <h3 className="font-semibold">
                                Sản phẩm
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {items.map(item => (
                                <div
                                    key={item.productId}
                                    className="flex items-center justify-between border-b pb-4"
                                >
                                    <div>
                                        <h4 className="font-medium">
                                            {item.productName}
                                        </h4>

                                        <p className="text-sm text-slate-500">
                                            x{item.quantity}
                                        </p>

                                    </div>

                                    <div className="font-semibold">
                                        {formatCurrency(item.unitPrice)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment */}

                    <div className="rounded-xl border p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <FiDollarSign />
                            <h3 className="font-semibold">
                                Thanh toán
                            </h3>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span>Tiền hàng</span>
                                <span>
                                    {formatCurrency(detail?.subtotal)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Phí vận chuyển</span>
                                <span>
                                    {formatCurrency(detail?.shippingFee)}
                                </span>
                            </div>

                            <div className="flex justify-between border-t pt-3 text-lg font-bold">

                                <span>Tổng cộng</span>

                                <span className="text-emerald-600">
                                    {formatCurrency(detail?.total)}
                                </span>

                            </div>
                        </div>
                    </div>

                    {/* Shipping */}
                    <div className="rounded-xl border p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <FiTruck />
                            <h3 className="font-semibold">
                                Vận chuyển
                            </h3>

                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Đơn vị</span>
                                <span>GHN</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Mã vận đơn</span>
                                <span>
                                    {detail?.shippingCode}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t bg-white p-5">
                    <div className="flex gap-3">

                        {/* PAID */}
                        {detail?.status === "PAID" && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleHandover}
                                    className="flex-1 rounded-xl bg-sky-500 py-3 font-semibold text-white hover:bg-sky-600"
                                >
                                    Bàn giao GHN
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 rounded-xl bg-red-500 py-3 font-semibold text-white hover:bg-red-600"
                                >
                                    Hủy đơn
                                </button>
                            </>
                        )}

                        {/* SHIPPING */}
                        {detail?.status === "SHIPPING" && (
                            <button
                                type="button"
                                onClick={handleDelivered}
                                className="flex-1 rounded-xl bg-emerald-500 py-3 font-semibold text-white hover:bg-emerald-600"
                            >
                                Xác nhận đã giao
                            </button>
                        )}

                        {/* DELIVERED */}
                        {detail?.status === "DELIVERED" && (
                            <button
                                type="button"
                                disabled
                                className="flex-1 rounded-xl bg-slate-200 py-3 font-semibold text-slate-500 cursor-not-allowed"
                            >
                                Đơn hàng đã hoàn thành
                            </button>
                        )}

                        {/* CANCELLED */}
                        {detail?.status === "CANCELLED" && (
                            <button
                                type="button"
                                disabled
                                className="flex-1 rounded-xl bg-red-100 py-3 font-semibold text-red-500 cursor-not-allowed"
                            >
                                Đơn hàng đã hủy
                            </button>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
}

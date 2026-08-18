export default function OrderSummary({subtotal,shippingFee}) {

    const total = subtotal + shippingFee;

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-6">
                Tóm tắt đơn hàng
            </h2>
            <div className="space-y-4">
                <div className="flex justify-between">
                    <span>
                        Tiền hàng
                    </span>
                    <span>
                        {subtotal.toLocaleString()} ₫
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>
                        Phí vận chuyển
                    </span>
                    <span>
                        {shippingFee.toLocaleString()} ₫
                    </span>
                </div>
                <hr/>
                <div className="flex justify-between text-2xl font-bold">
                    <span>
                        Tổng thanh toán
                    </span>
                    <span className="text-orange-500">
                        {total.toLocaleString()} ₫
                    </span>
                </div>
            </div>
        </div>

    );

}
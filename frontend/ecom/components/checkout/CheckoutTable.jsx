import CheckoutRow from "./CheckoutRow";

export default function CheckoutTable({ cartItems }) {
    return (
        <div className="bg-white rounded-xl shadow">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-100 font-semibold text-gray-700">

                <div className="col-span-6">
                    Sản phẩm
                </div>

                <div className="col-span-2 text-center">
                    Đơn giá
                </div>

                <div className="col-span-2 text-center">
                    Số lượng
                </div>

                <div className="col-span-2 text-right">
                    Thành tiền
                </div>

            </div>

            <div>

                {cartItems.map(item => (

                    <CheckoutRow
                        key={item.id}
                        item={item}
                    />
                ))}
            </div>
        </div>
    );
}
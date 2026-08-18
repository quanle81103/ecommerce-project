export default function CheckoutRow({ item }) {

    return (
        <div className="grid grid-cols-12 gap-4 px-6 py-5 border-b items-center hover:bg-gray-50">
            <div className="col-span-6 flex items-center gap-4">
                <img
                    src={item.productUrl}
                    alt=""
                    className="w-20 h-20 rounded-lg border object-cover"
                />
                <div>
                    <p className="font-medium">
                        {item.productName}
                    </p>
                </div>
            </div>
            <div className="col-span-2 text-center">
                {item.unitPrice.toLocaleString()} ₫
            </div>
            <div className="col-span-2 text-center">
                x {item.quantity}
            </div>
            <div className="col-span-2 text-right font-semibold text-orange-500">
                {(item.unitPrice * item.quantity).toLocaleString()} ₫
            </div>
        </div>
    );
}
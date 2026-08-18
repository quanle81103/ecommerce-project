export default function ShippingMethod({ shippingFees }) {

    console.log(shippingFees);
    return (

        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-5">

                🚚 Phương thức vận chuyển

            </h2>
            {
                shippingFees.map(shippingFee => (
                    <div key={shippingFee.shopId} className="flex justify-between items-center border rounded-xl p-5 mb-4">
                        <p>Shop {shippingFee.shopId}</p>
                        <p>{shippingFee.serviceName}</p>
                        <p>Dự kiến giao: {shippingFee.expectedDelivery}</p>
                    </div>
                ))

            }

        </div>

    );

}
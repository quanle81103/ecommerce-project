export default function PaymentButton({onCheckout}) {
    return (
        <div className="flex justify-end">
            <button
                onClick={onCheckout}
                className="bg-orange-500 hover:bg-orange-600
                           text-white
                           px-10
                           py-4
                           rounded-xl
                           text-lg
                           font-semibold
                           shadow"

            >
                Thanh toán bằng VNPay
            </button>
        </div>
    );
}
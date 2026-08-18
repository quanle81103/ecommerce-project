import { useEffect, useState } from "react";

import ShippingAddress from "../../components/checkout/ShippingAddress";
import CheckoutTable from "../../components/checkout/CheckoutTable";
import ShippingMethod from "../../components/checkout/ShippingMethod";
import OrderSummary from "../../components/checkout/OrderSummary";
import PaymentButton from "../../components/checkout/PaymentButton";

import { createOrderFromCart, getCart, calculateShippingFee, createVnpayPayment } from "../../services/dataService";

export default function CheckoutPage() {

    const [order, setOrder] = useState(null);

    const [cartItems, setCartItems] = useState([]);

    const [address, setAddress] = useState(null);

    const [shippingFees, setShippingFees] = useState([]);

    const [subtotal, setSubtotal] = useState(0);

    const [txnRef, setTxnRef] = useState(null);

    useEffect(() => {
        loadData();
    }, []);


    useEffect(() => {
        if (cartItems.length > 0 && address?.districtId && address?.wardCode) {
            loadShippingFee();

        }
    }, [cartItems, address]);

    const loadShippingFee = async () => {
        
        if (!address?.districtId || !address?.wardCode) return;

        const shopIds = [...new Set(cartItems.map(item => item.shopId))];

        const fees = await Promise.all(
            shopIds.map(async (shopId) => {
                const fee = await calculateShippingFee({
                    shopId,
                    toDistrictId: address.districtId,
                    toWardCode: address.wardCode
                });
                console.log("fee=", fee);
                return { shopId, shippingFee: fee.total };
            })
        );

        setShippingFees(fees);
        console.log("shippingFees =", shippingFees);
    };

    const totalShippingFee = shippingFees.reduce(
        (sum, item) => sum + item.shippingFee, 0
    );

    // useEffect(() => {
    //     console.log("address =", address);
    //     setAddress(form);
    // }, [address]);

    const loadData = async () => {

        try {

            const cart = await getCart();

            setCartItems(cart.cartItems);

            const total = cart.cartItems.reduce(
                (sum, item) => sum + item.unitPrice * item.quantity,0
            );
            setSubtotal(total);
        }
        catch (error) {
            console.log(error);

        }

    };

    const handlePayment = async() => {
        if (!address?.provinceId  || !address?.districtId || !address?.wardCode) {
            alert("Chọn đầy đủ địa chỉ giao hàng");
            return ;
        }

        const request = {
            provinceId: Number(address.provinceId),
            districtId: Number(address.districtId),
            wardCode: address.wardCode,
            shippingFees: shippingFees 
        }

        try {
            const order = await createOrderFromCart(request);
            setTxnRef(order.txnRef);
            const paymentUrl = await createVnpayPayment(
                order.totalAmount,
                order.txnRef
            );
            window.location.href = paymentUrl;
            
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="max-w-7xl mx-auto py-8 space-y-6">

            <h1 className="text-3xl font-bold">
                Thanh toán
            </h1>

            <ShippingAddress address={address} setAddress={setAddress}/>

            <CheckoutTable cartItems={cartItems} />

            <ShippingMethod shippingFees={shippingFees} />

            <OrderSummary subtotal={subtotal} shippingFee={totalShippingFee}/>

            <PaymentButton onCheckout={handlePayment}/>

        </div>

    );

}
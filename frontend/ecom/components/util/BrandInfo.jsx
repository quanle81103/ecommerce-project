import { useEffect, useState } from "react";
import { useChat } from "../context/ChatContext";
import { getShopByProduct } from "../services/dataService";

export default function BrandInfo({ productId}) {

    const { openChat } = useChat();
    const [shop, setShop] = useState(null);

    useEffect(() => {
        async function loadBrand() {
            try {
                const res = await getShopByProduct(productId);
                setShop(res);
            } catch (error) {
                console.log(error);
            }
        }
        loadBrand();
    }, [productId]);
    
    return (
        <div className="bg-white rounded-lg shadow p-6 flex justify-between ">
            {/* Left */}
            <div className="flex gap-4">
                <img
                    src={shop?.logoUrl}
                    alt={shop?.shopName}
                    className="w-20 h-20 rounded-full border object-cover"
                />

                <div className="flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">
                            {shop?.shopName}
                        </h2>

                        <p className="text-gray-500 text-sm">
                            Online vài phút trước
                        </p>
                    </div>

                    <div className="flex gap-3 mt-3">
                        <button 
                            className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-50"
                            onClick={() => openChat(shop)}    
                        >
                            Chat ngay
                        </button>

                        <button className="border px-4 py-2 rounded hover:bg-gray-100">
                            Xem shop
                        </button>
                    </div>
                </div>
            </div>

            {/* Right */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm">
                <div>
                    <span className="text-gray-500">
                        Sản phẩm:
                    </span>

                    <span className="text-red-500 ml-2">
                        {shop?.numOfProducts}
                    </span>
                </div>

                <div>
                    <span className="text-gray-500">
                        Thời gian phản hồi:
                    </span>

                    <span className="text-red-500 ml-2">
                        Trong vài giờ
                    </span>
                </div>
            </div>
        </div>
    )
}
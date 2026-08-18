import { useEffect, useState } from "react";
import { getProductById,addItem } from "../services/dataService";
import { FaCartPlus } from "react-icons/fa";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";

export default function ProductInfo({ productId }) {

    const [curIndex, setCurIndex] = useState(0);
    const [curQuantity, setCurQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const { addToCart } = useCart();

    // load product
    useEffect(() => {
        async function LoadProductInfo() {
            const res = await getProductById(productId);
            setProduct(res);
        }

        LoadProductInfo();

    }, [productId])
    
    // increase and decrease product quantity
    const increaseQuan = () => {
        setCurQuantity((cur) => 
            cur < product.inventory ? cur+1 : cur
        );
    };

    const decreaseQuan = () => {
        setCurQuantity((cur) => 
            cur < product.inventory && cur > 1 ? cur-1 : cur
        );
    };

    const handleAddToCart = async () => {
        try {
            await addToCart(productId, curQuantity);
            toast.success("Product has been added to your cart successfully");
        } catch (error) {
            console.log(error);
        }
    };
    

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex gap-2">
                <div className="w-5/12 flex flex-col aspect-square">
                    <img src={product?.image?.[curIndex]?.imageUlr} alt="..." className="w-full h-full object-cover rounded-2xl"/>

                    <div className="grid grid-cols-5 gap-2 mt-3">
                        {product?.image?.map((img, index) => (
                            <img src={img.imageUlr} key={img.id} onClick={() => setCurIndex(index)} className="h-20 w-full object-cover rounded border"/>
                        ))}
                    </div>
                </div>
                <div className="w-7/12 p-5 text-xl flex flex-col gap-5 py-10">
                    <h1 className="text-3xl font-sans">
                        {product?.name}
                    </h1>

                    <h2 className="text-red-500 bg-gray-100 p-5 text-3xl">{product?.price} đ</h2>
                    <span className="text-gray-500">Số lượng</span>
                    <div className="flex items-center h-16 w-fit gap-5">
                        <div className="border rounded">
                            <button onClick={decreaseQuan} className="w-10 hover:bg-gray-100">-</button>
                            <input type="text" value={curQuantity} readOnly className="w-14 text-center"/>
                            <button onClick={increaseQuan} className="w-10 hover:bg-gray-100">+</button>
                        </div>
                        
                        <span className="text-gray-500">
                            {product?.inventory} sản phẩm có sẵn
                        </span>
                    </div>
                    {/* button: AddToCart and Buy Now */}
                    <div className="flex gap-5 mt-5">
                        <button className="flex items-center justify-center gap-2 px-6 h-18 w-48 border border-red-500 text-red-500 bg-red-50 rounded hover:bg-red-100 transition-colors"
                            onClick={handleAddToCart}>
                            <FaCartPlus/>
                            <span>Add To Cart</span>
                        </button>

                        <button className="px-8 h-18 w-40 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                            Buy Now
                        </button>
                    </div>
                </div>           
            </div>
        </div>
    );
}
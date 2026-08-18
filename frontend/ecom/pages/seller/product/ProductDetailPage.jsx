import { useParams } from "react-router-dom";
import ProductInfo from "../components/ProductInfo";
import BrandInfo from "../components/BrandInfo";

export default function ProductDetailPage() {

    const { productId } = useParams();
    return (
        <div className="flex flex-col gap-6 my-20 mx-40">
            <ProductInfo productId={productId}/>
            <BrandInfo productId={productId}/>
        </div>
    )
}
import { useParams } from "react-router-dom";
import ProductInfo from "../../../components/product/ProductInfo";
import BrandInfo from "../../../components/util/BrandInfo";

export default function ProductDetailPage() {
    const { productId } = useParams();
    return <div className="app-container flex flex-col gap-5 py-6 sm:py-10"><ProductInfo productId={productId} /><BrandInfo productId={productId} /></div>;
}

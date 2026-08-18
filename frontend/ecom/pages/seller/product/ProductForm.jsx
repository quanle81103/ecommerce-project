import ProductBasicInfo from "./ProductBasicInfo";
import ProductImages from "./ProductImages";
import ProductCategory from "./ProductCategory";
import ProductPriceInventory from "./ProductPriceInventory";
import ProductShipping from "./ProductShipping";
import ProductAction from "./ProductAction";

export default function ProductForm(props) {

    return (

        <div className="space-y-6">

            <ProductBasicInfo {...props} />

            <ProductImages {...props} />

            <ProductCategory {...props} />

            <ProductPriceInventory {...props} />

            <ProductShipping {...props} />

            <ProductAction {...props} />

        </div>

    );

}
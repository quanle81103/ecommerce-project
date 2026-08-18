import ProductToolbar from "../../components/seller/product/ProductToolbar";
import ProductTable from "../../components/seller/product/ProductTable";
import { useEffect, useState } from "react";
import { deleteProduct, getProductsOfShop } from "../../services/dataService";

export default function SellerProductPage() {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const res = await getProductsOfShop();
        setProducts(res);
    };
    
    const handleDelete = async (productId) => {
        const confirmWindow = window.confirm("Do you want to delete this product permenantly");
        
        if (!confirmWindow) return;

        try {
            await deleteProduct(productId);
            setProducts(prev => prev.filter(product => product.id !== productId));
        } catch (error) {
            alert("Xóa sản phẩm thất bại");
        }
    };

    return (
        <>
            <ProductToolbar />
            <ProductTable products={products} handleDelete={handleDelete}/>
        </>
    ); 
}
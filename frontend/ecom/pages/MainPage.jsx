import { useState, useEffect } from "react";

import HeroBanner from "../components/util/HeroBanner";
import ProductCard from "../components/product/ProductCard";
import { getProducts, responseBanner } from "../services/dataService";

export default function MainPage() {

    const [products, setProducts] = useState([]);
    const [banners, setBanners] = useState([]);
    

    // load products
    useEffect(() => {
        async function loadProducts() {
            const res = await getProducts(0);
            setProducts(res.content);
        }

        loadProducts();
    }, []);

    // load banners
    useEffect(() => {
        async function loadBanner() {
            try {
                const res = await responseBanner();
                setBanners(res);
            } catch (error) {
                console.log(error);
            }
        }

        loadBanner();
    }, []);

    return (
        <>
            <HeroBanner banners={banners} />

            <div className="grid grid-cols-5 gap-2 mx-60 mt-20 mb-20">
                {
                    products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                }
            </div>
        </>
    );
}
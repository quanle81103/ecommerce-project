import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductDetailPage from "../pages/ProductDetailPage";

export default function ProductCard({ product }) {
    return (
        <div className="w-auto bg-white rounded-lg shadow p-3 border hover:border-blue-500 hover:shadow-lg transition-all">
            <Link to={`/products/${product.id}`}>
                <img src={product?.image?.[0]?.imageUlr} alt="" className="w-full h-56 object-fit"/>
                <div className="">
                    <h2 className="text-lg font-normal">{product?.name}</h2>
                    <p className="text-orange-400">{product?.price}</p>
                </div>
            </Link>
        </div>
    );
}
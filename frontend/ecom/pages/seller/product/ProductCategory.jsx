import { useEffect, useState } from "react";
import { getBrands, getCategories } from "../../../services/dataService";
export default function ProductCategory({ form, handleChange }){

    const [categories,setCategories]=useState([]);

    const [brands,setBrands]=useState([]);

    useEffect(()=>{

        // TODO
        const loadData = async() => {
            try {
                const resCat = await getCategories();
                setCategories(resCat);

                const resBrand = await getBrands();
                setBrands(resBrand); 
            } catch (error) {
                console.log(error);
            }
        }
        
        loadData();
    },[]);

    return(

        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-5">
                Danh mục
            </h2>
            <div className="grid grid-cols-2 gap-6">
                <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    className="border rounded-lg p-3"
                >
                    <option value="">
                        Chọn danh mục
                    </option>
                    {categories.map(category=>(
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <select
                    name="brandId"
                    value={form.brandId}
                    onChange={handleChange}
                    className="border rounded-lg p-3"
                >
                    <option value="">
                        Chọn thương hiệu
                    </option>
                    {brands.map(brand=>(
                        <option key={brand.id} value={brand.id}>
                            {brand.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
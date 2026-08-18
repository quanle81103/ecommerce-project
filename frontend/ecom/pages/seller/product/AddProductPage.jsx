import { useState } from "react";
import ProductForm from "./product/ProductForm";

export default function AddProductPage() {

    const [form, setForm] = useState({
        name: "",
        description: "",
        categoryId: "",
        brandId: "",
        price: "",
        inventory: "",
        weight: "",
        length: "",
        width: "",
        height: ""
    });

    const [files, setFiles] = useState([]);

    const handleChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async () => {

        const formData = new FormData();

        Object.entries(form).forEach(([key, value]) => {
            formData.append(key, value);
        });

        files.forEach(file => {
            formData.append("files", file);
        });

        console.log(formData);

        // await createProduct(formData)
    };

    return (
        <div className="bg-gray-100 min-h-screen p-8">

            <h1 className="text-3xl font-bold mb-8">
                Thêm sản phẩm
            </h1>

            <ProductForm
                form={form}
                files={files}
                setFiles={setFiles}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />

        </div>
    );

}
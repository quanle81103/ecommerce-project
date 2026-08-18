import { responseCategory } from "../../services/dataService";
import { useEffect, useState } from "react";

export default function CategoryBar() {
    
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function loadCategories() {
            try {
                const res = await responseCategory();
                setCategories(res);
            } catch (error) {
                console.log(error.message);
            }
        }

        loadCategories();
    }, []);

    return(
        <div className="flex gap-10 px-10 py-3 bg-gray-100 justify-center items-center text-lg font-mono">
            {
                categories.map((category) => (
                    <div key={category.id} className="cursor-pointer hover:text-orange-500" >
                        {category.name}
                    </div>
                ))
            }
        </div>
    );
}
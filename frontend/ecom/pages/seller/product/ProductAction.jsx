import { useNavigate } from "react-router-dom";

export default function ProductAction({handleSubmit}){

    const navigate = useNavigate();

    return(
        <div className="flex justify-end gap-4">
            <button onClick={()=>navigate("/seller/products")} className="px-8 py-3 rounded-lg border" >
                Hủy
            </button>
            <button onClick={handleSubmit} className="px-8 py-3 rounded-lg bg-orange-500 text-white hover:bg-orange-600">
                Đăng sản phẩm
            </button>
        </div>
    );
}
import { FaLongArrowAltLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import { forgetPasswordSchema } from "../utils/authSchema";
import { toast } from "sonner";
import { responseForgetPassword } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function ForgetPassword() {
    
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    async function handleForgetPassword() {
        // zod
        const result = forgetPasswordSchema.safeParse({
            email
        })

        if (!result.success) {
            toast.error(result.error.issues[0].message);
            return;
        }

        try {
            const res = await responseForgetPassword(email);
            toast.success("Hãy kiểm tra hòm thư email");
            navigate("/reset-password");
        } catch (error) {
            console.log(error);
            toast.error("1234456");
        }
    }

    return (
        <div className="h-full flex items-center justify-center">
            <div className="relative flex flex-col gap-5 w-80 border rounded p-4 bg-cyan-200">
                <Link to="/" className='absolute left-2'>
                    <FaLongArrowAltLeft />
                </Link>

                <h1 className="text-center bg">ForgetPassword</h1>

                <input
                    type="text" 
                    placeholder="Nhập email của bạn"
                    className="border-2 p-2 rounded bg-white text-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button 
                    type="submit" 
                    className="p-1 text-center bg-cyan-600 text-blue-50"
                    onClick={handleForgetPassword}
                >
                    Xác nhận
                </button>
            </div>  
        </div>
    )
}

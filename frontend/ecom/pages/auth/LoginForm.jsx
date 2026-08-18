import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "../utils/authSchema";
import { toast } from "sonner";

// Image
import facebookLogo from "../src/assets/facebook.png";
import googleLogo from "../src/assets/google.png";

import { response } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { initializeAuth } = useAuth();
    // hàm gọi axios trả về Promise
    async function handleLogin() {
        const result = loginSchema.safeParse({
            email, password
        })

        if (!result.success) {
            toast.error(result.error.issues[0].message);
            return;
        }

        try {   
            // token: Promise
            const token = await response(email, password);
            localStorage.setItem("Token", token);
            await initializeAuth();
            navigate("/");

        } catch (error) {
            console.log(error.response);
            console.log(error.message);
            toast.error("Email hoặc mật khẩu không đúng");
        }
    }

    return (
        <div className="flex justify-center h-full items-center">
            <div className="bg-cyan-200 w-screen p-6 border flex flex-col rounded-lg shadow-lg gap-8">
                {/* <img src="" alt="logo" className="border-2 rounded-lg"/> */}
                
                <h1 className="text-center font-serif">
                    Login Form
                </h1>

                <input 
                    type="text" 
                    placeholder="Nhập email của bạn" 
                    className="pt-3 p-2 text-lg rounded bg-white border-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div>
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="password" 
                            id="passwordId" 
                            placeholder="Nhập mật khẩu" 
                            className="pt-3 w-full text-lg p-2 rounded bg-white border-2 pr-8" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        
                        <button  
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                            {showPassword ? <FaEye/> : <FaEyeSlash/>}
                        </button>

                    </div>
                    <div className="flex justify-end gap-2">
                        
                        <Link to="/register">
                            Đăng ký
                        </Link>

                        <Link to="/forget-password">
                            Quên mật khẩu!
                        </Link>
                    </div>
                </div>

                <button 
                    className="p-2 pt-3 border bg-cyan-600 text-blue-50" 
                    onClick={handleLogin}
                >
                    Login
                </button>
                
                <div className="flex justify-center">
                    <p>Hoăc đăng nhập bằng:   </p>
                    <div className="w-20 h-20 flex flex-row gap-2">

                        {/*TODO: bổ sung đăng nhập bằng facebook và google*/}
                        <a href="">
                            <img src={facebookLogo} alt="FaceBook" />
                        </a>

                        <a href="">
                            <img src={googleLogo} alt="Google"/>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}


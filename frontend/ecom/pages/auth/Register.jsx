import { Link } from "react-router-dom"
import { FaLongArrowAltLeft, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"
import { useState } from "react"
export default function Register() {

    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");

    return (
        <div className="flex h-screen justify-center items-center bg-linear-to-r from-cyan-500 to-blue-500">
            <form className="flex flex-col bg-white/90 w-200 rounded-2xl shadow-2xl p-8 gap-5">
                <div className="relative">
                    <Link to="/" className="absolute left-2">
                        <FaLongArrowAltLeft />
                    </Link>
                </div>

                <h1 className="text-center text-2xl">Register Form</h1>
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <label className="block text-sm mb-1 font-medium">
                            First Name
                        </label>

                        <FaUser className="absolute left-3 top-10 text-gray-500 hover:text-cyan-600 transition duration-300"/>

                        <input
                            type="text"
                            placeholder="John"
                            className="w-full pl-10 p-2 border rounded-lg"/>
                    </div>

                    <div className="relative flex-1">
                        <label className="block text-sm mb-1 font-medium">
                            Second Name
                        </label>

                        <FaUser className="absolute left-3 top-10  text-gray-500 hover:text-cyan-600 transition duration-300"/>

                        <input
                            type="text"
                            placeholder="John"
                            className="w-full pl-10 p-2 border rounded-lg"
                        />
                    </div>
                </div>
                <div className="relative flex-1">
                    <label className="block text-sm font-medium mb-2">
                        Email:
                    </label>
                    <FaEnvelope 
                        className="absolute top-10 left-3 text-gray-500 hover:text-cyan-300 transition duration-200"/>
                    <input 
                        type="email" 
                        className="border rounded-lg w-full p-2 pl-10"
                        placeholder="xxxxxx@gmail.com"/>
                
                </div>
                <div className="relative flex-1">
                    <label className="text-sm font-medium block mb-2">
                        Password:
                    </label>
                    <FaLock className="absolute left-3 top-10 text-gray-500 hover:text-cyan-600"/>
                    <input 
                        type={showPassword ? "text" : "password"} 
                        name="password"
                        id="passwordId"
                        className="w-full border rounded-lg p-2 pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="button" onClick={(e) => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 ">
                        {showPassword ? <FaEyeSlash /> : <FaEye /> }
                    </button>
                </div>

                <div className="relative flex gap-8">
                    <div className="">
                        <label className="text-sm font-medium block mb-2">Town:</label>
                        
                        <input type="text" className="w-full border rounded-lg p-2 text-gray-500"/>
                    </div>
                    <div className="">
                        <label className="text-sm font-medium block mb-2">District:</label>
                        
                        <input type="text" className="w-full border rounded-lg p-2 text-gray-500"/>
                    </div>
                    <div className="">
                        <label className="text-sm font-medium block mb-2">Province:</label>
                        
                        <input type="text" className="w-full border rounded-lg p-2 text-gray-500"/>   
                    </div>
                </div>
                <div className="flex justify-end gap-2">

                    <button className="border rounded p-2 bg-red-500 hover:bg-red-700 hover:scale-105 transition dur" type="reset">Clear</button>
                    
                    <button className="border rounded p-2 bg-cyan-600" type="submit">Save</button>
                </div>
                <div className="text-center hover:text-cyan-600">
                    <p>Already have an account?</p>
                    <Link to='/'>
                        Login
                    </Link>
                </div>
            </form>
        </div>
    )   
}
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { FaSearch, FaCartArrowDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getMyShop } from "../services/dataService";

export default function Header() {
    const navigate = useNavigate();
    const { cart, loadCart } = useCart();
    const { isAuthenticated, user, logout, loadShop, shop } = useAuth();
    const [profileOpen, setProfileOpen] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        loadCart();
    }, []);

    const login = async () => {
        navigate("/login");
    };

    const handleLogout = async () => {
        logout();
        navigate("/");
    }

    const handleClickShopManagement = async () => {
        navigate("/seller");
    }

    useEffect(() => {

        if (!isAuthenticated) return;

        const fetchShop = async() => {
        
            try {
                await loadShop();
            } catch (error) {
                if (error.response?.status === 404) {
                    console.error(error);
                }
            }
            
        }

        fetchShop();
        
    }, [isAuthenticated]);

    return (
        <div className="flex items-center justify-center h-28 gap-10">
            <img src="../src/assets/lazada.jpg" alt="logo" className="w-30 h-20" onClick={() => navigate("/")}/>
            <div className="relative border rounded-2xl ">
                <input type="text" placeholder="Search in ...." className="text-lg w-2xl p-3 pr-12 rounded-2xl bg-gray-100 text-gray-600"/>
                <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500"/>
            </div>
            <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
                <FaCartArrowDown className="w-10 h-10"/>    
                <span className="absolute text-white text-xs h-5 w-5 -top-2 -right-2">{isAuthenticated ? cart?.cartItems?.length : null}</span>
                {open && (
                    <div className="absolute left-0 top-full pt-2 bg-white rounded border-2 w-xl px-2 py-2">
                        <div className="text-gray-400 px-4 py-3">Sản phẩm mới thêm</div>
                        <div className="max-h-80 overflow-y-auto">
                            {cart?.cartItems?.map(item => (
                                <div key={item.id} className="flex px-1 py-1 gap-3 hover:bg-gray-50">
                                    <img src={item.productUrl} alt="" className="w-14 h-14 rounded object-cover"/>
                                    <div className="flex-1">
                                        <p className="line-clamp-2 text-sm">
                                            {item.productName}
                                        </p>
                                        <p className="text-orange-500">
                                            {item.unitPrice} đ
                                        </p>
                                    </div>
                                </div>
                                
                            ))}
                        </div>
                        <div className="flex justify-end p-2">
                            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => navigate("/checkout")}>
                                Xem giỏ hàng
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {isAuthenticated ? (
                <div
                    className="relative"
                    onMouseEnter={() => setProfileOpen(true)}
                    onMouseLeave={() => setProfileOpen(false)}
                >
                    <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100">
                        <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                    </button>

                    {profileOpen && (
                        <div className="absolute right-0 top-full pt-2 w-56 bg-white rounded-lg shadow-lg border overflow-hidden z-50">
                            <button className="block w-full text-left px-4 py-3 hover:bg-gray-100">
                                Hồ sơ
                            </button>

                            <button className="block w-full text-left px-4 py-3 hover:bg-gray-100">
                                Đơn hàng
                            </button>

                            <button className="block w-full text-left px-4 py-3 hover:bg-gray-100">
                                Yêu thích
                            </button>

                            { shop && (<button className="block w-full text-left px-4 py-3 hover:bg-gray-100" onClick={handleClickShopManagement}>
                                Quản lý shop
                            </button>) }

                            <div className="border-t"></div>

                            <button className="block w-full text-left px-4 py-3 hover:bg-red-50 text-red-500" onClick={handleLogout}>
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <button className="px-4 py-2 bg-orange-500 text-white rounded-lg" onClick={login}>
                    Đăng nhập  aaaa
                </button>
            )}
        </div>
    );
}
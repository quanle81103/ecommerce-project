import { useEffect, useRef, useState } from "react";
import { FaCartArrowDown, FaSearch } from "react-icons/fa";
import { FiMenu, FiUser, FiX } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../src/assets/lazada.jpg";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatters";

export default function Header({ compact = false }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { cart, loadCart } = useCart();
    const { isAuthenticated, user, logout, shop } = useAuth();
    const [profileOpen, setProfileOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [keyword, setKeyword] = useState(new URLSearchParams(location.search).get("q") || "");
    const headerRef = useRef(null);

    useEffect(() => {
        if (isAuthenticated) loadCart().catch(() => undefined);
    }, [isAuthenticated, loadCart]);

    useEffect(() => {
        const closeMenus = (event) => {
            if (!headerRef.current?.contains(event.target)) {
                setProfileOpen(false);
                setCartOpen(false);
                setMobileOpen(false);
            }
        };
        document.addEventListener("pointerdown", closeMenus);
        return () => document.removeEventListener("pointerdown", closeMenus);
    }, []);

    const submitSearch = (event) => {
        event.preventDefault();
        const query = keyword.trim();
        navigate(query ? `/products?q=${encodeURIComponent(query)}` : "/products");
        setMobileOpen(false);
    };

    const handleLogout = () => {
        logout();
        setProfileOpen(false);
        navigate("/");
    };

    const cartCount = cart?.cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

    return (
        <header ref={headerRef} className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="app-container flex min-h-20 items-center gap-3 py-3 lg:gap-8">
                <button type="button" aria-label="Về trang chủ" onClick={() => navigate("/")} className="shrink-0 rounded-lg">
                    <img src={logo} alt="E-Commerce" className="h-12 w-20 rounded-lg object-cover sm:w-24" />
                </button>

                {!compact && (
                    <form onSubmit={submitSearch} className="relative hidden min-w-0 flex-1 sm:block">
                        <label htmlFor="global-search" className="sr-only">Tìm kiếm sản phẩm</label>
                        <input id="global-search" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Tìm sản phẩm..." className="field-control pr-12" />
                        <button type="submit" aria-label="Tìm kiếm" className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg text-orange-500 hover:bg-orange-50">
                            <FaSearch />
                        </button>
                    </form>
                )}

                <div className="ml-auto flex items-center gap-1 sm:gap-2">
                    <div className="relative">
                        <button type="button" aria-label={`Giỏ hàng có ${cartCount} sản phẩm`} aria-expanded={cartOpen} onClick={() => { setCartOpen((value) => !value); setProfileOpen(false); }} className="relative grid h-11 w-11 place-items-center rounded-xl text-slate-700 hover:bg-slate-100">
                            <FaCartArrowDown size={23} />
                            {cartCount > 0 && <span className="absolute right-0 top-0 min-w-5 rounded-full bg-orange-500 px-1 text-center text-xs font-bold text-white">{cartCount}</span>}
                        </button>
                        {cartOpen && (
                            <div className="absolute right-0 top-13 w-[min(92vw,24rem)] rounded-2xl border bg-white p-3 shadow-2xl">
                                <p className="px-2 pb-2 text-sm font-semibold text-slate-500">Giỏ hàng của bạn</p>
                                {!isAuthenticated ? (
                                    <div className="p-4 text-center text-sm text-slate-500">Đăng nhập để xem giỏ hàng.</div>
                                ) : cart?.cartItems?.length ? (
                                    <div className="max-h-72 space-y-1 overflow-y-auto">
                                        {cart.cartItems.slice(0, 5).map((item) => (
                                            <div key={item.id} className="flex gap-3 rounded-xl p-2 hover:bg-slate-50">
                                                <img src={item.productUrl} alt={item.productName} className="h-14 w-14 rounded-lg border object-cover" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="line-clamp-2 text-sm">{item.productName}</p>
                                                    <p className="mt-1 text-sm font-bold text-orange-600">{formatCurrency(item.unitPrice)} × {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-sm text-slate-500">Giỏ hàng đang trống.</div>
                                )}
                                <button type="button" className="primary-button mt-3 w-full" onClick={() => { navigate(isAuthenticated ? "/cart" : "/login?returnUrl=%2Fcart"); setCartOpen(false); }}>Xem giỏ hàng</button>
                            </div>
                        )}
                    </div>

                    {isAuthenticated ? (
                        <div className="relative">
                            <button type="button" aria-label="Mở menu tài khoản" aria-expanded={profileOpen} onClick={() => { setProfileOpen((value) => !value); setCartOpen(false); }} className="flex min-h-11 items-center gap-2 rounded-xl px-2 hover:bg-slate-100">
                                <span className="grid h-9 w-9 place-items-center rounded-full bg-orange-100 text-orange-600"><FiUser /></span>
                                <span className="hidden max-w-36 truncate text-sm font-semibold md:block">{user?.firstName} {user?.lastName}</span>
                            </button>
                            {profileOpen && (
                                <div className="absolute right-0 top-13 w-56 overflow-hidden rounded-2xl border bg-white py-2 shadow-2xl">
                                    <button type="button" className="block w-full px-4 py-3 text-left hover:bg-slate-50" onClick={() => navigate("/profile")}>Hồ sơ</button>
                                    <button type="button" className="block w-full px-4 py-3 text-left hover:bg-slate-50" onClick={() => navigate("/orders")}>Đơn mua</button>
                                    {shop && <button type="button" className="block w-full px-4 py-3 text-left hover:bg-slate-50" onClick={() => navigate("/seller")}>Quản lý shop</button>}
                                    <div className="my-1 border-t" />
                                    <button type="button" className="block w-full px-4 py-3 text-left text-red-600 hover:bg-red-50" onClick={handleLogout}>Đăng xuất</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button type="button" className="primary-button hidden sm:inline-flex" onClick={() => navigate("/login")}>Đăng nhập</button>
                    )}

                    <button type="button" aria-label={mobileOpen ? "Đóng menu" : "Mở menu"} className="grid h-11 w-11 place-items-center rounded-xl hover:bg-slate-100 sm:hidden" onClick={() => setMobileOpen((value) => !value)}>
                        {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                    </button>
                </div>
            </div>

            {!compact && mobileOpen && (
                <div className="border-t bg-white p-4 sm:hidden">
                    <form onSubmit={submitSearch} className="relative">
                        <label htmlFor="mobile-search" className="sr-only">Tìm kiếm sản phẩm</label>
                        <input id="mobile-search" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Tìm sản phẩm..." className="field-control pr-12" />
                        <button type="submit" aria-label="Tìm kiếm" className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center text-orange-500"><FaSearch /></button>
                    </form>
                    {!isAuthenticated && <button type="button" className="primary-button mt-3 w-full" onClick={() => navigate("/login")}>Đăng nhập</button>}
                </div>
            )}
        </header>
    );
}

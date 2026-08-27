import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

const linkClass = "block rounded py-1 hover:text-orange-400 focus-visible:text-orange-400";

export default function Footer() {
    return (
        <footer className="mt-12 bg-slate-950 text-slate-300">
            <div className="app-container py-10 sm:py-12">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <h2 className="mb-3 font-bold text-white">Về chúng tôi</h2>
                        <Link to="/" className={linkClass}>Giới thiệu</Link>
                        <span className={linkClass}>Điều khoản sử dụng</span>
                        <span className={linkClass}>Chính sách bảo mật</span>
                    </div>
                    <div>
                        <h2 className="mb-3 font-bold text-white">Hỗ trợ khách hàng</h2>
                        <span className={linkClass}>Trung tâm trợ giúp</span>
                        <span className={linkClass}>Hướng dẫn mua hàng</span>
                        <span className={linkClass}>Chính sách vận chuyển</span>
                    </div>
                    <div>
                        <h2 className="mb-3 font-bold text-white">Thanh toán an toàn</h2>
                        <p className="text-sm leading-7">Hỗ trợ VNPay và các phương thức được cung cấp trong quá trình thanh toán.</p>
                    </div>
                    <div>
                        <h2 className="mb-3 font-bold text-white">Theo dõi chúng tôi</h2>
                        <div className="flex gap-2">
                            {[FaFacebook, FaYoutube, FaInstagram].map((Icon, index) => (
                                <span key={index} className="grid h-11 w-11 place-items-center rounded-full bg-slate-800" aria-hidden="true"><Icon size={20} /></span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
                    <p>Hotline: 1900 xxx · Email: support@shop.com</p>
                    <p className="mt-2">© 2026 E-Commerce. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

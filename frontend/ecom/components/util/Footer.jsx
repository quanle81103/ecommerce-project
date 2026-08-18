import { FaFacebook, FaYoutube, FaInstagram } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-10 py-12">

                <div className="grid grid-cols-4 gap-10">

                    <div>
                        <h2 className="text-white text-lg font-bold mb-4">
                            Về chúng tôi
                        </h2>
                        <div className="space-y-2">
                            <p className="hover:text-orange-400 cursor-pointer">Giới thiệu</p>
                            <p className="hover:text-orange-400 cursor-pointer">Điều khoản</p>
                            <p className="hover:text-orange-400 cursor-pointer">Bảo mật</p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-white text-lg font-bold mb-4">
                            Hỗ trợ khách hàng
                        </h2>
                        <div className="space-y-2">
                            <p className="hover:text-orange-400 cursor-pointer">Trung tâm</p>
                            <p className="hover:text-orange-400 cursor-pointer">Hướng dẫn</p>
                            <p className="hover:text-orange-400 cursor-pointer">Vận chuyển</p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-white text-lg font-bold mb-4">
                            Thanh toán
                        </h2>
                        <div className="space-y-2">
                            <p>VNPay</p>
                            <p>Momo</p>
                            <p>Visa</p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-white text-lg font-bold mb-4">
                            Theo dõi chúng tôi
                        </h2>

                        <div className="flex gap-4">
                            <FaFacebook className="text-2xl cursor-pointer hover:text-blue-500" />
                            <FaYoutube className="text-2xl cursor-pointer hover:text-red-500" />
                            <FaInstagram className="text-2xl cursor-pointer hover:text-pink-500" />
                        </div>
                    </div>

                </div>

                <hr className="border-gray-700 my-8" />

                <div className="text-center space-y-2 text-sm">
                    <p>
                        Hotline: 1900 xxx | Email: support@shop.com
                    </p>

                    <p className="text-gray-500">
                        © 2025 E-Commerce. All rights reserved
                    </p>
                </div>
            </div>
        </footer>
    );
}
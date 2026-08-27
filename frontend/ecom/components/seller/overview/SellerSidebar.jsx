import {
    FaChartLine,
    FaBoxOpen,
    FaShoppingBag,
    FaMoneyBillWave,
    FaComments
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const menus = [
    {
        name: "Dashboard",
        icon: <FaChartLine />,
        path: "/seller"
    },
    {
        name: "Sản phẩm",
        icon: <FaBoxOpen />,
        path: "/seller/products"
    },
    {
        name: "Đơn hàng",
        icon: <FaShoppingBag />,
        path: "/seller/orders"
    },
    {
        name: "Doanh thu",
        icon: <FaMoneyBillWave />,
        path: "/seller/revenue"
    },
    {
        name: "Tin nhắn",
        icon: <FaComments />,
        path: "/seller/messages"
    }
];

export default function SellerSidebar() {
    return (
        <aside className="h-full min-h-screen w-64 bg-white p-6 shadow">

            <h1 className="mb-10 text-2xl font-bold text-orange-600">
                Quản lý Shop
            </h1>

            <div className="space-y-2">
                {menus.map(menu => (
                    <NavLink
                        key={menu.path}
                        to={menu.path}
                        end={menu.path === "/seller"}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all
                            ${
                                isActive
                                    ? "bg-orange-500 text-white shadow"
                                    : "text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                            }`
                        }
                    >
                        <span className="text-lg">
                            {menu.icon}
                        </span>

                        <span>
                            {menu.name}
                        </span>
                    </NavLink>
                ))}
            </div>
        </aside>
    );
}

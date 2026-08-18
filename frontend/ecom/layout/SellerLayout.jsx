import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import SellerSidebar from "../components/seller/overview/SellerSidebar";

export default function SellerLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <div className="flex flex-1">
                <SellerSidebar />

                <main className="flex-1 bg-slate-100 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
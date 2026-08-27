import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import SellerSidebar from "../components/seller/overview/SellerSidebar";
import Header from "../components/util/Header";

export default function SellerLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    useEffect(() => setSidebarOpen(false), [location.pathname]);
    useEffect(() => {
        if (!sidebarOpen) return undefined;
        const closeOnEscape = (event) => event.key === "Escape" && setSidebarOpen(false);
        document.addEventListener("keydown", closeOnEscape);
        return () => document.removeEventListener("keydown", closeOnEscape);
    }, [sidebarOpen]);

    return (
        <div className="flex min-h-screen flex-col bg-slate-100">
            <Header compact />
            <div className="flex flex-1">
                <div className="hidden lg:block"><SellerSidebar /></div>
                {sidebarOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <button type="button" aria-label="Đóng menu người bán" className="absolute inset-0 bg-slate-950/40" onClick={() => setSidebarOpen(false)} />
                        <div className="relative h-full w-[min(82vw,20rem)] bg-white shadow-2xl">
                            <button type="button" aria-label="Đóng menu" onClick={() => setSidebarOpen(false)} className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full hover:bg-slate-100">
                                <FiX size={22} />
                            </button>
                            <SellerSidebar />
                        </div>
                    </div>
                )}
                <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
                    <button type="button" onClick={() => setSidebarOpen(true)} className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-xl border bg-white px-4 font-medium shadow-sm lg:hidden">
                        <FiMenu /> Menu quản lý
                    </button>
                    <Outlet />
                </main>
            </div>
            <Toaster richColors position="top-right" />
        </div>
    );
}

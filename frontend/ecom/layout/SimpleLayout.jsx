import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Footer from "../components/util/Footer";
import Header from "../components/util/Header";

export default function SimpleLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
            <Header compact />
            <main className="flex-1"><Outlet /></main>
            <Footer />
            <Toaster richColors position="top-right" />
        </div>
    );
}

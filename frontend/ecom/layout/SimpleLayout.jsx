import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/util/Footer";
import { Toaster } from "sonner";

export default function SimpleLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />

            <Toaster position="top-right" />
        </div>
    );
}
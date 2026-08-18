import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/util/Footer";
import CategoryBar from "../components/util/CategoryBar";
import ChatButton from "../components/ChatButton";
import ChatBox from "../components/ChatBox";
import { Toaster } from "sonner";
import { useChat } from "../context/ChatContext";

export default function MainLayout() {
    const { isOpen, shop, closeChat } = useChat();

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <CategoryBar />

            <main className="flex-1">
                <Outlet />
            </main>

            <ChatButton />

            {isOpen && (
                <ChatBox
                    shop={shop}
                    onClose={closeChat}
                />
            )}

            <Footer />

            <Toaster position="top-right" />
        </div>
    );
}
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import ChatBox from "../components/seller/message/ChatBox";
import ChatButton from "../components/seller/message/ChatButton";
import CategoryBar from "../components/util/CategoryBar";
import Footer from "../components/util/Footer";
import Header from "../components/util/Header";
import { useChat } from "../context/ChatContext";

export default function MainLayout() {
    const { isOpen, closeChat } = useChat();
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
            <Header />
            <CategoryBar />
            <main className="flex-1"><Outlet /></main>
            <ChatButton />
            {isOpen && <ChatBox onClose={closeChat} />}
            <Footer />
            <Toaster richColors position="top-right" />
        </div>
    );
}

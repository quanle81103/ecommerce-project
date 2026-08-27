import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useChat } from "../../../context/ChatContext";

export default function ChatButton() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const { isOpen, openChat } = useChat();
    if (location.pathname.startsWith("/seller") || isOpen) return null;
    const handleOpen = () => isAuthenticated ? openChat(null) : navigate("/login?returnUrl=" + encodeURIComponent(location.pathname + location.search));
    return <button type="button" aria-label="Mở hộp thoại tin nhắn" onClick={handleOpen} className="fixed bottom-4 right-4 z-30 inline-flex min-h-12 items-center gap-2 rounded-full bg-orange-500 px-5 font-semibold text-white shadow-xl transition hover:bg-orange-600 sm:bottom-6 sm:right-6"><IoChatboxEllipsesOutline size={21} /><span className="hidden sm:inline">Tin nhắn</span></button>;
}

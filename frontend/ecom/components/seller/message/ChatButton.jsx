import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { useChat } from "../context/ChatContext";
import { useLocation } from "react-router-dom";

export default function ChatButton(){

    const { isOpen, openChat } = useChat();
    const location = useLocation();

    if (location.pathname.startsWith("/seller")) {
        return null;
    }
    
    if(isOpen) return null;

    return (
        <button
            onClick={() => openChat(null)}
            className="
                fixed
                bottom-0
                right-16
                w-32
                h-12
                bg-red-500
                text-white
                rounded-2xl
                flex
                items-center
                justify-center
                gap-2
                hover:bg-red-600
                transition
            "
        >
            <IoChatboxEllipsesOutline size={20} />
            <span>Chat</span>
        </button>
    );
}

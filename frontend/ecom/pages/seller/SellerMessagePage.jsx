import ConversationList from "../../components/seller/message/ConversationList";
import MessageList from "../../components/seller/message/MessageList";
import MessageInput from "../../components/seller/message/MessageInput";
import ChatHeader from "../../components/seller/message/ChatHeader";
import { useChat } from "../../context/ChatContext";
import { useEffect } from "react";

export default function SellerMessagePage() {
    const { messages, conversations, currentConversation, setCurrentConversation, selectConversation, loadSellerConversations } = useChat();

    useEffect(() => {
        loadSellerConversations();
    }, [loadSellerConversations]);

    return (
        <div className="flex h-[calc(100dvh-10rem)] min-h-120 overflow-hidden rounded-xl bg-white shadow-sm">
            <div className={(currentConversation ? "hidden md:block" : "block") + " w-full md:w-auto"}>
                <ConversationList conversations={conversations} currentConversation={currentConversation} selectConversation={selectConversation}/>
            </div>
            <div className={(currentConversation ? "flex" : "hidden md:flex") + " min-w-0 flex-1 flex-col text-base sm:text-lg"}>
                <ChatHeader conversation={currentConversation} onBack={() => setCurrentConversation(null)}/>
                <MessageList messages={messages}/>
                <MessageInput />
            </div>
        </div>
    );
}

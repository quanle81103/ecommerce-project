import ConversationList from "../../components/seller/message/ConversationList";
import ConversationItem from "../../components/seller/message/ConversationItem";
import MessageList from "../../components/seller/message/MessageList";
import MessageInput from "../../components/seller/message/MessageInput";
import ChatHeader from "../../components/seller/message/ChatHeader";
import { useChat } from "../../context/ChatContext";
import { useEffect } from "react";

export default function SellerMessagePage() {
    const { messages, conversationId, conversations, currentConversation, setCurrentConversation, selectConversation, sendMessage, loadSellerConversations } = useChat();

    useEffect(() => {
        loadSellerConversations();
    }, []);

    return (
        <div className="flex h-[calc(100vh-64px)] bg-white rounded-xl">
            <ConversationList conversations={conversations} currentConversation={currentConversation} selectConversation={selectConversation}/>
            <div className="flex-1 flex flex-col text-xl">
                <ChatHeader conversation={currentConversation}/>
                <MessageList messages={messages}/>
                <MessageInput conversationId={conversationId} sendMessage={sendMessage}/>
            </div>
        </div>
    );
}
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { connect, disconnect, getClient } from "../services/ChatService";
import { createConversation, getConversationsOfBuyer, getConversationsOfSeller, getMessages } from "../services/dataService";
import { useAuth } from "./AuthContext";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [conversationId, setConversationId] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [connectionState, setConnectionState] = useState("disconnected");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const subscriptionRef = useRef(null);

    useEffect(() => {
        if (!isAuthenticated) {
            disconnect();
            setConnectionState("disconnected");
            setConversations([]);
            setMessages([]);
            setIsOpen(false);
            return undefined;
        }
        setConnectionState("connecting");
        connect({
            onConnected: () => setConnectionState("connected"),
            onDisconnected: () => setConnectionState("reconnecting"),
            onError: () => setConnectionState("error")
        });
        return () => {
            subscriptionRef.current?.unsubscribe();
            subscriptionRef.current = null;
            disconnect();
        };
    }, [isAuthenticated]);

    const subscribeConversation = useCallback((id) => {
        const client = getClient();
        if (!id || !client?.connected) return false;
        subscriptionRef.current?.unsubscribe();
        subscriptionRef.current = client.subscribe("/topic/conversations/" + id, (frame) => {
            const incoming = JSON.parse(frame.body);
            setMessages((current) => current.some((message) => message.id === incoming.id) ? current : [...current, incoming]);
        });
        return true;
    }, []);

    const selectConversation = useCallback(async (conversation) => {
        if (!conversation?.id) return;
        setLoading(true);
        setError("");
        try {
            setCurrentConversation(conversation);
            setConversationId(conversation.id);
            setMessages(await getMessages(conversation.id) || []);
            subscribeConversation(conversation.id);
        } catch {
            setError("Không thể tải nội dung cuộc trò chuyện.");
        } finally {
            setLoading(false);
        }
    }, [subscribeConversation]);

    const loadBuyerConversations = useCallback(async () => {
        if (!isAuthenticated) return [];
        setLoading(true);
        setError("");
        try {
            const list = await getConversationsOfBuyer() || [];
            setConversations(list);
            return list;
        } catch {
            setError("Không thể tải danh sách cuộc trò chuyện.");
            return [];
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const loadSellerConversations = useCallback(async () => {
        if (!isAuthenticated) return [];
        setLoading(true);
        setError("");
        try {
            const list = await getConversationsOfSeller() || [];
            setConversations(list);
            if (list.length && !currentConversation) await selectConversation(list[0]);
            return list;
        } catch {
            setError("Không thể tải danh sách cuộc trò chuyện.");
            return [];
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, currentConversation, selectConversation]);

    const openChat = useCallback(async (shop) => {
        if (!isAuthenticated) throw new Error("AUTH_REQUIRED");
        setIsOpen(true);
        if (!shop?.id) {
            const list = await loadBuyerConversations();
            if (list.length && !currentConversation) await selectConversation(list[0]);
            return;
        }
        setLoading(true);
        setError("");
        try {
            const conversation = await createConversation(shop.id);
            await loadBuyerConversations();
            await selectConversation(conversation);
        } catch (requestError) {
            setError("Không thể mở cuộc trò chuyện.");
            throw requestError;
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, loadBuyerConversations, currentConversation, selectConversation]);

    const sendMessage = useCallback((id, content) => {
        const client = getClient();
        if (!id || !content.trim() || !client?.connected) return false;
        client.publish({ destination: "/app/" + id + "/messages", body: JSON.stringify({ content: content.trim() }) });
        return true;
    }, []);

    const handleSend = useCallback((content) => sendMessage(conversationId, content), [conversationId, sendMessage]);
    const closeChat = useCallback(() => {
        subscriptionRef.current?.unsubscribe();
        subscriptionRef.current = null;
        setIsOpen(false);
    }, []);

    const value = useMemo(() => ({
        isOpen, openChat, closeChat, messages, conversationId, conversations,
        setConversations, currentConversation, setCurrentConversation, selectConversation,
        sendMessage, handleSend, loadSellerConversations, loadBuyerConversations,
        connectionState, loading, error
    }), [isOpen, openChat, closeChat, messages, conversationId, conversations, currentConversation, selectConversation, sendMessage, handleSend, loadSellerConversations, loadBuyerConversations, connectionState, loading, error]);

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) throw new Error("useChat must be used inside ChatProvider");
    return context;
}

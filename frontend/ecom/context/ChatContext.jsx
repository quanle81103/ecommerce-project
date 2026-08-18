import { createContext, useContext, useState, useEffect, useRef } from "react";
import { connect, disconnect, getClient } from "../services/ChatService";
import { createConversation, getConversations, getConversationsOfBuyer, getConversationsOfSeller, getMessages } from "../services/dataService";

const ChatContext = createContext();

export function ChatProvider({ children }){
    const [isOpen, setIsOpen] = useState(false);

    const [shop, setShop] = useState(null);

    const [messages, setMessages] = useState([]);

    const [conversationId, setConversationId] = useState(null);

    const [conversations, setConversations] = useState([]);

    const [currentConversation, setCurrentConversation] = useState(null);

    const subscriptionRef = useRef(null);

    useEffect(() => {

        connect(() => {
            console.log("Socket ready");
        });

        return () => disconnect();

    }, []);

    const subscribeConversation=(conversationId)=>{
        console.log("Subscribe:", `/topic/conversations/${conversationId}`);
        const client=getClient();

        if(subscriptionRef.current){
            subscriptionRef.current.unsubscribe();
        }

        subscriptionRef.current = client.subscribe(

            `/topic/conversations/${conversationId}`,

            (message) => {
                const body=JSON.parse(message.body);
                
                setMessages(prev=>[
                    ...prev,
                    body
                ]);
            }
        );
    }

    const sendMessage = (conversationId, content)=>{

        const client = getClient();

        client.publish({

            destination:
                `/app/${conversationId}/messages`,

            body: JSON.stringify({
                content
            })

        });

    }

    const handleSend = async (message) => {
        if (!message.trim()) return false;

        await sendMessage(conversationId, message);

        return true;
    }

    const openChat = async (shop) => {

        // setShop(shop);

        // const list = await getConversations();

        // setConversations(list);

        // // create or get conversation
        const conversation = await createConversation(shop.id);

        setCurrentConversation(conversation);

        setConversationId(conversation.id);

        //  get chat history
        const history = await getMessages(conversation.id);

        setMessages(history);

        // subscribe websocket
        subscribeConversation(conversation.id);

        setIsOpen(true);
    }

    const loadSellerConversations = async () => {
        try {
            const conversations = await getConversationsOfSeller();

            console.log(conversations);

            setConversations(conversations);

            // Nếu chưa chọn cuộc trò chuyện nào thì chọn cuộc đầu tiên
            if (conversations.length > 0 && !currentConversation) {
                await selectConversation(conversations[0]);
            }

        } catch (error) {
            console.error(error);
        }
    };

    const loadBuyerConversations = async() => {
        try {
            const conversations = await getConversationsOfBuyer();

            console.log(conversations);

            setConversations(conversations);

            if (conversations.length > 0 && !currentConversation) {
                await selectConversation(conversations[0]);
            }
        }catch (error) {
            console.log(error);
        }
    }

    const selectConversation = async(conversation) => {
        setCurrentConversation(conversation);

        setConversationId(conversation.id);

        const history = await getMessages(conversation.id);

        setMessages(history);

        subscribeConversation(conversation.id);
    }

    const closeChat = () => {
        subscriptionRef.current?.unsubscribe();

        setConversationId(null);

        setMessages([]);

        setShop(null);
        
        setIsOpen(false);
    };

    return (
        <ChatContext.Provider
            value={{ isOpen, openChat, closeChat, messages, conversationId, subscribeConversation, sendMessage, conversations, setConversations, currentConversation, setCurrentConversation, selectConversation, handleSend, loadSellerConversations, loadBuyerConversations }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => useContext(ChatContext);
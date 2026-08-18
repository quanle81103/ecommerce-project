import { useEffect, useState } from "react";
import { MdCancelPresentation } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";

export default function ChatBox({ shop, onClose }) {
    const [message, setMessage] = useState("");
    const { conversations,currentConversation,messages,sendMessage,conversationId,selectConversation,closeChat, handleSend, loadBuyerConversations} = useChat();
    const { user } = useAuth();

    useEffect(() => {
        loadBuyerConversations();
    }, []);

    return (
        <div className="fixed bottom-5 right-5 w-225 h-175 bg-white rounded-xl shadow-2xl flex">

        {/* LEFT */}
        <div className="w-1/3 border-r flex flex-col">

            <div className="p-4 font-bold border-b">
                Cuộc trò chuyện
            </div>

            <div className="flex-1 overflow-y-auto">

                {conversations.map(conversation => (

                    <div
                        key={conversation.id}
                        onClick={() => selectConversation(conversation)}
                        className={`p-4 cursor-pointer hover:bg-gray-100

                        ${
                            currentConversation?.id===conversation.id
                            ? "bg-red-50"
                            : ""
                        }
                        `}
                    >

                        <h3 className="font-semibold">

                            {conversation.shopName}

                        </h3>

                        <p className="text-sm text-gray-500 truncate">

                            {conversation.lastMessage}

                        </p>

                    </div>

                ))}

            </div>

        </div>

        {/* RIGHT */}

        <div className="flex-1 flex flex-col">

            <div className="border-b p-4 flex justify-between">

                <h2>

                    {currentConversation?.shopName}

                </h2>

                <button onClick={closeChat}>

                    <MdCancelPresentation/>

                </button>

            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xl">

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={
                            message.userId === user?.id
                                ? "ml-auto bg-red-500 text-white rounded-xl p-3 w-fit max-w-[70%]"
                                : "bg-gray-100 rounded-xl p-3 w-fit max-w-[70%]"
                        }
                    >
                        {message.content}
                    </div>
                ))}

            </div>

            <div className="border-t p-3 flex">

                <input
                    className="flex-1 border rounded-lg px-3 py-3 text-xl"
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                    onKeyDown={async (e) => {
                        if (e.key === "Enter") {
                            const success = await handleSend(message);

                            if (success) {
                                setMessage("");
                            }
                        }
                    }}
                />

                <button
                    onClick={
                        async () => { 
                            const success = await handleSend(message)
                            if (success) {
                                setMessage("");
                            }
                        }
                    }
                    className="ml-2 bg-red-500 text-white rounded-lg px-5"
                >

                    <IoMdSend/>

                </button>

            </div>

        </div>

    </div>
    );
}
import { useState } from "react";
import { IoMdSend } from "react-icons/io";
import { useChat } from "../../../context/ChatContext";

export default function MessageInput({
    conversationId,
    sendMessage
}) {
    
    const [message,setMessage]=useState("");
    const { handleSend } = useChat();
    return (

        <div className="border-t p-4 flex">

            <input
                value={message}
                onChange={(e)=>setMessage(e.target.value)}
                onKeyDown={
                    async (e) => {
                        if (e.key === "Enter") {
                            const success = await handleSend(message);

                            if (success) {
                                setMessage("");
                            }
                        }
                    }
                }
                placeholder="Nhập tin nhắn..."
                className="flex-1 border rounded-lg px-4"
            />

            <button 
                onClick={async () => {
                    const success = await handleSend(message);

                    if (success) {
                        setMessage("");
                    }
                }}
                className="ml-3 bg-orange-500 text-white px-5 rounded-lg">
                <IoMdSend/>
            </button>

        </div>

    );
}
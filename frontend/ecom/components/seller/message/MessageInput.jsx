import { useState } from "react";
import { IoMdSend } from "react-icons/io";
import { useChat } from "../../../context/ChatContext";

export default function MessageInput() {
    
    const [message,setMessage]=useState("");
    const { handleSend, currentConversation, connectionState } = useChat();
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
                disabled={!currentConversation || connectionState !== "connected"}
                className="field-control min-w-0 flex-1"
            />

            <button 
                type="button"
                onClick={async () => {
                    const success = await handleSend(message);

                    if (success) {
                        setMessage("");
                    }
                }}
                disabled={!message.trim() || connectionState !== "connected"}
                aria-label="Gửi tin nhắn"
                className="primary-button px-4 sm:px-5">
                <IoMdSend/>
            </button>

        </div>

    );
}

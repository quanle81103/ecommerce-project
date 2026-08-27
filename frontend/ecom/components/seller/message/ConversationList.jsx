import ConversationItem from "./ConversationItem";
import { FaSearch } from "react-icons/fa";

export default function ConversationList({
    conversations,
    currentConversation,
    selectConversation
}) {

    return (
        <div className="flex h-full w-full flex-col border-r md:w-80">

            <div className="p-4 border-b">

                <h2 className="font-bold text-lg mb-3">
                    Tin nhắn
                </h2>

                <div className="relative">

                    <input
                        placeholder="Tìm cuộc trò chuyện"
                        className="w-full border rounded-lg px-3 py-2 pl-10"
                    />

                    <FaSearch className="absolute left-3 top-3 text-gray-400"/>

                </div>

            </div>

            <div className="flex-1 overflow-y-auto">

                {conversations.map(conversation=>(
                    <ConversationItem
                        key={conversation.id}
                        conversation={conversation}
                        active={currentConversation?.id===conversation.id}
                        onClick={()=>selectConversation(conversation)}
                    />
                ))}

            </div>

        </div>
    );
}

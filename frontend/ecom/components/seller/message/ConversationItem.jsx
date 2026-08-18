export default function ConversationItem ({ conversation, onClick }) {
    return (
        <div onClick={onClick} className="flex gap-3 border-b hover:bg-gray-50">
            <img src={conversation.logoUrl} alt="" className="w-12 h-12 rounded-full object-cover"/>

            <div className="flex-1 overflow-hidden">
                <div className="flex justify-between">
                    <h3 className="font-semibold truncate">
                        {conversation.buyerName}
                    </h3>
                    <span className="text-xs text-gray-400">
                        {conversation.lastMessageAt}
                    </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage}
                </p>
            </div>
        </div>
    );
}
export default function ConversationItem ({ conversation, onClick }) {
    return (
        <button type="button" onClick={onClick} className="flex w-full gap-3 border-b p-4 text-left hover:bg-gray-50">
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
        </button>
    );
}

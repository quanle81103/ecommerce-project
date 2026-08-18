export default function ChatHeader({ conversation }) {

    if(!conversation){
        return (
            <div className="h-16 border-b flex items-center px-6">
                Chọn một cuộc trò chuyện
            </div>
        );
    }

    return (
        <div className="h-16 border-b flex items-center px-6">
            <img
                src={conversation.shopLogo}
                alt=""
                className="w-10 h-10 rounded-full"
            />
            <div className="ml-3">
                <h2 className="font-semibold">
                    {conversation.buyerName}
                </h2>
            
            </div>
        </div>
    );
}
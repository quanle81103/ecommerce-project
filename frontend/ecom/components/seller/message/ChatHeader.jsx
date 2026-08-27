import { FiArrowLeft } from "react-icons/fi";

export default function ChatHeader({ conversation, onBack }) {

    if(!conversation){
        return (
            <div className="h-16 border-b flex items-center px-6">
                Chọn một cuộc trò chuyện
            </div>
        );
    }

    return (
        <div className="flex h-16 items-center border-b px-4 sm:px-6">
            <button type="button" aria-label="Quay lại danh sách cuộc trò chuyện" onClick={onBack} className="mr-2 grid h-10 w-10 place-items-center rounded-full hover:bg-slate-100 md:hidden"><FiArrowLeft /></button>
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

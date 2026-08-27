import { useEffect, useMemo, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { useAuth } from "../../../context/AuthContext";
import { useChat } from "../../../context/ChatContext";

export default function ChatBox({ onClose }) {
    const [message, setMessage] = useState("");
    const [query, setQuery] = useState("");
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const { user } = useAuth();
    const { conversations, currentConversation, messages, selectConversation, handleSend, loadBuyerConversations, connectionState, loading, error } = useChat();

    useEffect(() => { loadBuyerConversations(); inputRef.current?.focus(); }, [loadBuyerConversations]);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
    useEffect(() => {
        const closeOnEscape = (event) => event.key === "Escape" && onClose();
        document.addEventListener("keydown", closeOnEscape);
        return () => document.removeEventListener("keydown", closeOnEscape);
    }, [onClose]);

    const filtered = useMemo(() => conversations.filter((conversation) => (conversation.shopName || conversation.buyerName || "").toLowerCase().includes(query.toLowerCase())), [conversations, query]);
    const send = () => { if (handleSend(message)) setMessage(""); };

    return (
        <section role="dialog" aria-modal="true" aria-label="Tin nhắn" className="fixed inset-0 z-50 flex bg-white shadow-2xl sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[min(42rem,calc(100vh-2.5rem))] sm:w-[min(56rem,calc(100vw-2.5rem))] sm:overflow-hidden sm:rounded-2xl sm:border">
            <aside className={(currentConversation ? "hidden sm:flex" : "flex") + " w-full flex-col border-r sm:w-72"}>
                <div className="border-b p-4"><div className="flex items-center justify-between"><h2 className="font-bold">Cuộc trò chuyện</h2><button type="button" aria-label="Đóng tin nhắn" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full hover:bg-slate-100 sm:hidden"><MdClose size={22} /></button></div><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm cuộc trò chuyện" aria-label="Tìm cuộc trò chuyện" className="field-control mt-3" /></div>
                <div className="flex-1 overflow-y-auto">{loading && !filtered.length ? <p className="p-5 text-sm text-slate-500">Đang tải...</p> : error ? <p className="p-5 text-sm text-red-600">{error}</p> : !filtered.length ? <p className="p-5 text-sm text-slate-500">Chưa có cuộc trò chuyện.</p> : filtered.map((conversation) => <button key={conversation.id} type="button" onClick={() => selectConversation(conversation)} className={"block w-full border-b p-4 text-left hover:bg-slate-50 " + (currentConversation?.id === conversation.id ? "bg-orange-50" : "")}><strong className="block truncate">{conversation.shopName || conversation.buyerName}</strong><span className="mt-1 block truncate text-sm text-slate-500">{conversation.lastMessage || "Bắt đầu trò chuyện"}</span></button>)}</div>
            </aside>
            <div className={(currentConversation ? "flex" : "hidden sm:flex") + " min-w-0 flex-1 flex-col"}>
                <header className="flex h-16 items-center justify-between border-b px-4"><div><h2 className="font-bold">{currentConversation?.shopName || currentConversation?.buyerName || "Tin nhắn"}</h2><p className="text-xs text-slate-500">{connectionState === "connected" ? "Đã kết nối" : connectionState === "reconnecting" ? "Đang kết nối lại..." : "Chưa kết nối"}</p></div><button type="button" aria-label="Đóng tin nhắn" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full hover:bg-slate-100"><MdClose size={22} /></button></header>
                <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4" aria-live="polite">{messages.map((item) => <div key={item.id} className={"w-fit max-w-[80%] rounded-2xl px-4 py-3 " + (item.userId === user?.id ? "ml-auto bg-orange-500 text-white" : "bg-white shadow-sm")}>{item.content}</div>)}<div ref={messagesEndRef} /></div>
                <div className="flex gap-2 border-t p-3"><input ref={inputRef} value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(); } }} disabled={!currentConversation || connectionState !== "connected"} placeholder={connectionState === "connected" ? "Nhập tin nhắn..." : "Đang kết nối..."} className="field-control flex-1" /><button type="button" aria-label="Gửi tin nhắn" onClick={send} disabled={!message.trim() || connectionState !== "connected"} className="primary-button px-4"><IoMdSend size={20} /></button></div>
            </div>
        </section>
    );
}

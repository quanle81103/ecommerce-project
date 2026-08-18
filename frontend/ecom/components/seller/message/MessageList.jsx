import { useAuth } from "../../../context/AuthContext";

export default function MessageList({ messages }) {

    const { user } = useAuth();

    return (
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50">

            {messages.map(message => {

                const isMine = message.userId === user?.id;

                return (
                    <div
                        key={message.id}
                        className={
                            isMine
                                ? "ml-auto bg-orange-500 text-white rounded-2xl px-4 py-3 w-fit max-w-[70%]"
                                : "bg-white rounded-2xl px-4 py-3 shadow w-fit max-w-[70%]"
                        }
                    >
                        {message.content}
                    </div>
                );
            })}

        </div>
    );
}
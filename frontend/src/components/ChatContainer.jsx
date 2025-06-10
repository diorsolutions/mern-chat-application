import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import { Reply, Copy, Pin, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    message: null,
  });
  const [pinnedMessage, setPinnedMessage] = useState(null);

  const { setReplyTo } = useChatStore();

  const handleContextMenu = (e, message) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, message });
  };

  const handleCopy = () => {
    if (contextMenu.message) {
      navigator.clipboard.writeText(contextMenu.message.text);
      toast.success("Message copied to clipboard");
      setContextMenu({ ...contextMenu, visible: false });
    }
  };

  const handlePin = () => {
    if (contextMenu.message) {
      setPinnedMessage(contextMenu.message);
      setContextMenu({ ...contextMenu, visible: false });
    }
  };

  const { deleteMessage } = useChatStore();
  const handleDelete = async () => {
    if (contextMenu.message) {
      await deleteMessage(contextMenu.message._id);
      setContextMenu({ ...contextMenu, visible: false });
    }
  };

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      {pinnedMessage && (
        <div className="p-2 bg-base-200 text-sm w-full">
          Pinned: {pinnedMessage.text}
        </div>
      )}

      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onClick={() => setContextMenu({ ...contextMenu, visible: false })}
      >
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            } relative group`}
            onContextMenu={(e) => handleContextMenu(e, message)}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.replyTo && (
                <div className="text-xs opacity-70 border-l-2 border-blue-500 pl-2 mb-1">
                  <p className="font-bold">{message.replyTo.senderId === authUser._id ? "You" : selectedUser.fullName}</p>
                  <p>{message.replyTo.text}</p>
                </div>
              )}
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-2 transition-opacity duration-300"
              style={{
                left: message.senderId === authUser._id ? "auto" : "0",
                right: message.senderId === authUser._id ? "0" : "auto",
              }}
            >
              <button
                className="p-1 rounded-full bg-base-200 hover:bg-base-300"
                onClick={() => setReplyTo(message)}
              >
                <Reply size={16} />
              </button>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {contextMenu.visible && (
        <div
          className="absolute bg-base-100 border rounded-md shadow-lg p-2"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <ul>
            <li
              className="flex items-center gap-2 p-2 hover:bg-base-200 cursor-pointer"
              onClick={() => {
                setReplyTo(contextMenu.message);
                setContextMenu({ ...contextMenu, visible: false });
              }}
            >
              <Reply size={16} /> Reply
            </li>
            <li
              className="flex items-center gap-2 p-2 hover:bg-base-200 cursor-pointer"
              onClick={handleCopy}
            >
              <Copy size={16} /> Copy
            </li>
            <li
              className="flex items-center gap-2 p-2 hover:bg-base-200 cursor-pointer"
              onClick={handlePin}
            >
              <Pin size={16} /> Pin
            </li>
            {contextMenu.message?.senderId === authUser._id && (
              <li
                className="flex items-center gap-2 p-2 hover:bg-base-200 cursor-pointer text-red-500"
                onClick={handleDelete}
              >
                <Trash2 size={16} /> Delete
              </li>
            )}
          </ul>
        </div>
      )}

      <MessageInput />
    </div>
  );
};
export default ChatContainer;

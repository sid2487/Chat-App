import React, { useEffect, useRef, useState } from 'react'
import TypingIndicator from './TypingIndicator';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ChatBox = ({ messages, onSend, chatUser, socket, isTyping }) => {
  const [text, setText] = useState("");
  const bottomRef = useRef(null);
  const [online, setOnline] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const { user } = useAuth();

  const typingTimeoutRef = useRef(null);  

  useEffect(() => {
    setBlocked(user.user.blocked?.includes(chatUser._id));
  }, [chatUser]);

  const toggleBlock = async () => {
    try {
      if (blocked) {
        await axios.post(
          `http://localhost:5000/api/users/unblock/${chatUser._id}`,
          {},
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
      } else {
        await axios.post(
          `http://localhost:5000/api/users/block/${chatUser._id}`,
          {},
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
      }

      setBlocked(!blocked);
    } catch (error) {
      if (error.response?.status === 404) {
        // Optional: update local block state to reflect backend status or show message
        console.warn(
          "User is already blocked/unblocked or mutual block scenario."
        );
        // You can also fetch updated user info here to sync block state.
      } else {
        console.error("Error in blocking/unblocking", error.message);
      }
    }
  };
  
  useEffect(() => {
    if(chatUser && socket){
      socket.emit("check-online", { userId: chatUser._id}, (isOnline) => {
        setOnline(isOnline);
      })
    }
  }, [chatUser, socket])

  useEffect(() => {
    if(bottomRef.current){
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping])

  const handleTyping = () => {
    socket.emit("typing", { to: chatUser._id });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", { to: chatUser._id });
    }, 3000);
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || blocked) return;
    onSend(text);
    socket.emit("stop-typing", { to: chatUser._id });
    setText("");
  };
  return (
    <div className="flex flex-col w-2/3 p-4 bg-gray-50 relative">
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold text-lg">{chatUser.name}</div>
        <button
          onClick={toggleBlock}
          className="text-sm text-white px-2 py-1 rounded bg-red-500"
        >
          {blocked ? "Unblock" : "Block"}
        </button>
      </div>

      <div className={`text-sm ${online ? "text-green-500" : "text-gray-400"}`}>
        {online ? "Online" : "Offline"}
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 mb-2">
        {messages
          .filter((msg) => !blocked || msg.sender !== chatUser._id)
          .map((msg, i) => (
            <div
              key={i}
              className={`max-w-xs p-2 rounded ${
                msg.sender === chatUser._id
                  ? "bg-blue-100 self-start"
                  : "bg-green-100 self-end"
              }`}
            >
              {msg.text}
            </div>
          ))}
        {!blocked && isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {blocked ? (
        <div className="mb-2 text-red-600 font-semibold text-center">
          You have blocked this user.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2 mt-auto">
          <input
            className="flex-1 border px-3 py-2 rounded"
            placeholder={blocked ? "Blocked user" : "Type a message"}
            value={text}
            // onChange={(e) => setText(e.target.value)}
            // onKeyDown={handleTyping}
            onChange={(e) => {
              setText(e.target.value);
              if (!blocked) handleTyping(); // This will debounce
            }}
            disabled={blocked}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
}

export default ChatBox
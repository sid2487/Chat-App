import React, { useEffect, useState } from 'react'
import { useAuth } from "../context/AuthContext";
import axios from 'axios';
import io from "socket.io-client";
import ContactList from '../components/ContactList';
import ChatBox from '../components/ChatBox';

const socket = io("http://localhost:5000");

const ChatPage = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await axios.get("http://localhost:5000/api/auth/users", {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      console.log(data);
      setContacts(data.data.filter((u) => u._id !== user.user._id));
    };

    fetchUsers();
    socket.emit("add-user", user.user._id);
  }, []);

  useEffect(() => {
    if (currentChat) {
      const getMessages = async () => {
        const { data } = await axios.get(
          `http://localhost:5000/api/messages/${currentChat._id}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setMessages(data);
      };
      getMessages();
    }
  }, [currentChat]);

  useEffect(() => {
    socket.on("msg-receive", (msg) => {
      if (currentChat && msg.from === currentChat._id) {
        setMessages((prev) => [...prev, { ...msg, sender: currentChat._id }]);
      }
    });

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop-typing", () => setIsTyping(false));

    // socket.on("typing", ({ from }) => {
    //   if (currentChat && from === currentChat._id) setIsTyping(true);
    // });

    // socket.on("stop-typing", ({ from }) => {
    //   if (currentChat && from === currentChat._id) setIsTyping(false);
    // });

    return () => {
      socket.off("msg-receive");
      socket.off("typing");
      socket.off("stop-typing");
    };
  }, [currentChat]);

  const handleSendMessage = async (text) => {
    const payload = { to: currentChat._id, text };
    const { data } = await axios.post(
      "http://localhost:5000/api/messages/",
      payload,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );

    socket.emit("send-msg", { ...payload, from: user.user._id });
    setMessages([...messages, data]);
  };

  return (
    <div className="flex h-screen">
      <ContactList
        contacts={contacts}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
      />
      {currentChat ? (
        <ChatBox
          messages={messages}
          onSend={handleSendMessage}
          chatUser={currentChat}
          socket={socket}
          isTyping={isTyping}
        />
      ) : (
        <div className="w-2/3 flex items-center justify-center text-gray-500">
          Select a contact to start chatting
        </div>
      )}
    </div>
  );
  
}

export default ChatPage
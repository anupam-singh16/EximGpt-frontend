import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import './App.css';

function App() {
  const [chats, setChats] = useState([]);
  const [selectedChatIndex, setSelectedChatIndex] = useState(null);

  console.log(chats, 'chats')

  useEffect(() => {
    // Initialize with a new chat and add the initial bot message
    const initialChat = { messages: [{ type: 'bot', message: 'Hello, May I Help You?' }] };
    setChats([initialChat]);
    setSelectedChatIndex(0);
  }, []);

  const handleSelectChat = (index) => {
    setSelectedChatIndex(index);
  };

  const handleNewChat = () => {
    const newChat = { messages: [] };
    setChats([...chats, newChat]);
    setSelectedChatIndex(chats.length); // Select the new chat
  };

  const handleSendMessage = (message, chatIndex) => {
    const updatedChats = [...chats];
    updatedChats[chatIndex]?.messages?.push({ type: 'user', message });
    setChats(updatedChats);
  };

  const handleReceiveMessage = (message, chatIndex) => {
    if (chatIndex === selectedChatIndex) {  // Ensure bot only responds to the active chat
      const updatedChats = [...chats];
      updatedChats[chatIndex]?.messages?.push({ type: 'bot', message });
      setChats(updatedChats);
    }
  };

  useEffect(() => {
    const socket = io('http://localhost:4000');

    socket.on('query', (data) => {
      handleReceiveMessage(data?.message, selectedChatIndex);
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedChatIndex]);

  const handleDeleteChat = (index) => {
    const updatedChats = chats?.filter((_, i) => i !== index);

    setChats(updatedChats);
    if (index === selectedChatIndex) {

      setSelectedChatIndex(null);
    } else if (index < selectedChatIndex) {
      setSelectedChatIndex(selectedChatIndex - 1);
    }


  };

  return (
    <div className="app">
      <Sidebar
        chats={chats}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />
      {selectedChatIndex !== null && (
        <ChatWindow
          onNewChat={handleNewChat}
          chat={chats[selectedChatIndex]}
          onSendMessage={(message) => handleSendMessage(message, selectedChatIndex)}
        />
      )}
    </div>
  );
}

export default App;

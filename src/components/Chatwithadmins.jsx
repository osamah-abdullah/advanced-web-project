import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";

const ChatWithAdmins = () => {
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Create a list of admin data
  const adminList = Array.from({ length: 3 }, (_, index) => ({
    id: index + 1,
    name: `Admin${index + 1}`,
    image: "admin.png",
    status: index === 0 ? "online" : "offline",
  }));

  // Filter admins based on search term
  const filteredAdmins = adminList.filter((admin) =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    // Focus input when chat is opened
    if (selectedAdmin) {
      inputRef.current?.focus();
    }
  }, [messages, selectedAdmin]);

  // Handle sending messages
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "You",
      text: newMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    // Simulate admin response
    setTimeout(() => {
      const adminResponse = {
        id: Date.now() + 1,
        sender: selectedAdmin,
        text: "Thanks for your message! I'll get back to you soon.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, adminResponse]);
    }, 1000);
  };

  // Handle admin selection
  const handleAdminSelect = (admin) => {
    setSelectedAdmin(admin.name);
    // Clear previous chat messages when selecting a new admin
    setMessages([
      {
        id: Date.now(),
        sender: admin.name,
        text: `Hello! How can I assist you today?`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 bg-gray-900 p-5 text-white flex flex-col h-screen overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Fixed Header Section */}
          <div className="flex-none">
            <h1 className="text-2xl font-bold mb-5">Chat with Admins</h1>

            {/* Search Bar */}
            <div className="mb-5">
              <input
                type="text"
                placeholder="Search for an admin..."
                className="w-full p-3 rounded bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Admin List */}
            <div className="bg-gray-800 p-5 rounded mb-5">
              <h2 className="text-xl font-bold mb-5">Available Admins</h2>
              <div className="flex flex-wrap gap-[20px]">
                {filteredAdmins.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex flex-col items-center bg-gray-700 p-[10px] gap-[10px] rounded-full text-center h-[106.8px] w-[120px] cursor-pointer hover:bg-gray-600 relative"
                    onClick={() => handleAdminSelect(admin)}
                  >
                    <div
                      className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                        admin.status === "online"
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }`}
                    />
                    <img
                      src={admin.image}
                      alt={admin.name}
                      className="w-[50px] h-[50px] rounded-full"
                    />
                    <span className="text-gray-300">{admin.name}</span>
                  </div>
                ))}
              </div>
              {filteredAdmins.length === 0 && (
                <p className="text-gray-400 text-center mt-4">
                  No admins found
                </p>
              )}
            </div>
          </div>

          {/* Chat Box */}
          {selectedAdmin && (
            <div className="chat-container rounded">
              <div className="p-4 ">
                <h2 className="text-xl text-white/90">
                  Chat with: {selectedAdmin}
                </h2>
              </div>
              <div className="chat-box flex flex-col h-[calc(100vh-400px)] border border-gray-700/50 rounded">
                <div className="chat-messages flex-1 p-4 overflow-y-auto">
                  {messages.map((message) => (
                    <div key={message.id} className="mb-0">
                      <div className="px-4 py-2">
                        <span
                          className={`${
                            message.sender === "You"
                              ? "text-[#00ff00]"
                              : "text-[#00ffff]"
                          } font-medium`}
                        >
                          {message.sender}:
                        </span>
                        <span className="text-white/90"> {message.text}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="chat-input-area p-4 flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 bg-[#1a202c] text-white/90 placeholder-gray-500 p-4 rounded-lg focus:outline-none"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    type="submit"
                    onClick={handleSendMessage}
                    className="send-button bg-[#3ea6ff] text-white px-6 rounded-lg hover:bg-[#3ea6ff]/90 disabled:opacity-50"
                    disabled={!newMessage.trim()}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ChatWithAdmins;

import React, { useState } from 'react';

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am your AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    const botMessage = { sender: 'bot', text: `You asked: ${input}. Let me think...` };
    setTimeout(() => {
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="card p-4">
      <h2 className="heading-3 text-gray-900 dark:text-white mb-4">AI Chatbot</h2>
      <div className="chat-box border border-gray-300 dark:border-gray-700 rounded-md p-4 h-64 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${msg.sender === 'bot' ? 'text-left' : 'text-right'}`}
          >
            <span
              className={`inline-block px-3 py-2 rounded-lg ${
                msg.sender === 'bot'
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  : 'bg-primary-500 text-white'
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-gray-300 dark:border-gray-700 rounded-md p-2 text-sm dark:bg-gray-800 dark:text-gray-100"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="ml-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChatbot;
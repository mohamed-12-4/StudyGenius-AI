"use client";

import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';

const AIStudyGroup = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Welcome to the AI Study Group! How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('/api/ai-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI response');
      }

      const data = await response.json();
      const botMessage = { sender: 'bot', text: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage = { sender: 'bot', text: 'Sorry, I encountered an error. Please try again later.' };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-primary-500 text-white p-4 text-center font-bold text-lg">
        AI Study Group Chat
      </header>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg shadow-md ${
                  msg.sender === 'bot'
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    : 'bg-primary-500 text-white'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
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
            className="ml-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 flex items-center"
          >
            <FiSend className="mr-1" /> Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIStudyGroup;
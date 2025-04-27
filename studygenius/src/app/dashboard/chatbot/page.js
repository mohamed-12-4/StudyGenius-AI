'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiPaperclip, FiImage, FiInfo } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const Chatbot = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'bot', 
      text: 'Hello! I\'m your AI study assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState('general');
  const bottomRef = useRef(null);

  // List of available AI assistants
  const assistants = [
    { id: 'general', name: 'General Assistant', description: 'Help with any study-related questions' },
    { id: 'math', name: 'Math Expert', description: 'Specialized in mathematics and problem-solving' },
    { id: 'science', name: 'Science Helper', description: 'Help with physics, chemistry, and biology concepts' },
    { id: 'writing', name: 'Writing Assistant', description: 'Help with essays, papers, and writing tasks' },
    { id: 'language', name: 'Language Tutor', description: 'Assistance with learning new languages' }
  ];

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // In a real app, you would call an API endpoint to get AI response
      // For example:
      // const response = await fetch('/api/ai-response', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: input, assistantType: selectedAssistant })
      // });
      // const data = await response.json();
      
      // Simulating AI response with timeout
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          sender: 'bot',
          text: generateMockResponse(input, selectedAssistant),
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsTyping(false);
      
      const errorMessage = {
        id: messages.length + 2,
        sender: 'bot',
        text: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  // Mock response generator based on the selected assistant
  const generateMockResponse = (message, assistantType) => {
    const lowerMessage = message.toLowerCase();
    
    switch (assistantType) {
      case 'math':
        if (lowerMessage.includes('equation') || lowerMessage.includes('formula') || lowerMessage.includes('calculus')) {
          return "I can help with that math problem. In mathematical equations, it's important to understand the fundamental concepts before diving into complex calculations. Could you provide more specific details about the problem you're working on?";
        }
        break;
      case 'science':
        if (lowerMessage.includes('physics') || lowerMessage.includes('chemistry') || lowerMessage.includes('biology')) {
          return "That's an interesting scientific question. Science is all about observation and experimentation. To answer your specific question, I would need more context about the concept you're studying.";
        }
        break;
      case 'writing':
        if (lowerMessage.includes('essay') || lowerMessage.includes('paper') || lowerMessage.includes('write')) {
          return "For writing assignments, I recommend starting with a clear thesis statement and creating an outline. This helps organize your thoughts and ensures your argument flows logically. What specific aspect of writing are you working on?";
        }
        break;
      case 'language':
        if (lowerMessage.includes('spanish') || lowerMessage.includes('french') || lowerMessage.includes('language')) {
          return "Language learning is a journey! Consistent practice and immersion are key. Try to practice a little bit every day rather than cramming. What language are you learning, and what's your current proficiency level?";
        }
        break;
    }
    
    // Default responses if no specific pattern is matched
    const defaultResponses = [
      "That's an interesting question! To help you better, could you provide more context or details?",
      "I understand what you're asking. Let me suggest a few resources that might help with this topic.",
      "Great question! This is a complex topic, but I'll try to explain it simply.",
      "I can help you understand this concept. Let's break it down step by step.",
      "I'd be happy to assist with your question. Could you tell me what you've already tried?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-10rem)]">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">AI Study Assistant</h1>
      
      {/* Assistant selector */}
      <div className="mb-4 overflow-x-auto flex space-x-2 pb-2">
        {assistants.map(assistant => (
          <button
            key={assistant.id}
            onClick={() => setSelectedAssistant(assistant.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedAssistant === assistant.id
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {assistant.name}
          </button>
        ))}
      </div>
      
      {/* Selected assistant info */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 flex items-start">
        <FiInfo className="text-primary-500 mt-1 mr-2 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">
            {assistants.find(a => a.id === selectedAssistant)?.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {assistants.find(a => a.id === selectedAssistant)?.description}
          </p>
        </div>
      </div>
      
      {/* Chat messages container */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
        <div className="space-y-4">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[70%] px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-primary-500 text-white'
                    : message.isError
                      ? 'bg-danger-100 dark:bg-danger-900/30 text-danger-800 dark:text-danger-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                <div className="text-sm">{message.text}</div>
                <div className="text-xs mt-1 opacity-70 text-right">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={bottomRef} />
        </div>
      </div>
      
      {/* Input area */}
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message here..."
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none h-12 max-h-32 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              rows={1}
            />
          </div>
          
          <div className="flex space-x-2">
            <button 
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
              title="Upload file"
            >
              <FiPaperclip className="h-5 w-5" />
            </button>
            <button 
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
              title="Upload image"
            >
              <FiImage className="h-5 w-5" />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!input.trim()}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <FiSend className="mr-1" /> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
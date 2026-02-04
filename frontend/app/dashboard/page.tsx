'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatBotPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hello! I'm your AI assistant. How can I help you today?`,
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return `Hi ${user?.username}! How can I assist you today?`;
    } else if (lowerMessage.includes('help')) {
      return 'I can help you with various tasks. Try asking me about your account, features, or just chat with me!';
    } else if (lowerMessage.includes('account') || lowerMessage.includes('profile')) {
      return `Your account details:\n• Email: ${user?.email}\n• Username: ${user?.username}\n• Joined: ${new Date(user?.createdAt || '').toLocaleDateString()}`;
    } else if (lowerMessage.includes('time')) {
      return `Current time is: ${new Date().toLocaleTimeString()}`;
    } else if (lowerMessage.includes('date')) {
      return `Today's date is: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
    } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      return 'Goodbye! Have a great day! 👋';
    } else if (lowerMessage.includes('thanks') || lowerMessage.includes('thank you')) {
      return 'You\'re welcome! Let me know if you need anything else. 😊';
    } else if (lowerMessage.includes('how are you')) {
      return 'I\'m doing great, thanks for asking! How can I help you?';
    } else {
      const responses = [
        'That\'s interesting! Tell me more.',
        'I understand. How else can I assist you?',
        'Great question! I\'m here to help with any queries you have.',
        'Thanks for sharing! Is there anything specific you\'d like to know?',
        'I\'m processing that. Feel free to ask me anything!',
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2">
          AI ChatBot
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Ask me anything, I'm here to help!
        </p>
      </div>

      <div className="flex-1 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-2xl flex flex-col overflow-hidden">
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-white'
                  }`}
                >
                  <p className="text-sm sm:text-base whitespace-pre-line">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user'
                        ? 'text-blue-100'
                        : 'text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-zinc-100 dark:bg-zinc-700 rounded-2xl px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-zinc-200 dark:border-zinc-700 p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
              >
                Send
              </button>
            </form>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 text-center">
              Try asking: "help", "account", "time", or just chat naturally!
            </p>
          </div>
        </div>
      </div>
  );
}

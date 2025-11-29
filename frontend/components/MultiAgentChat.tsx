import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const MultiAgentChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && !uploadedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          image_url: uploadedImage
        })
      });

      const data = await response.json();
      
      const agentMessages: Message[] = data.responses.map((r: any) => ({
        id: `${Date.now()}-${r.agent}`,
        sender: r.agent,
        content: r.message,
        timestamp: new Date(r.time)
      }));

      setMessages(prev => [...prev, ...agentMessages]);
      setUploadedImage(null);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const getAgentColor = (sender: string) => {
    if (sender === 'You') return 'bg-blue-500 text-white';
    if (sender === 'VisionAgent') return 'bg-purple-100 text-purple-900';
    if (sender === 'RecommendationAgent') return 'bg-green-100 text-green-900';
    if (sender === 'ConversationAgent') return 'bg-yellow-100 text-yellow-900';
    if (sender === 'ImageGenAgent') return 'bg-pink-100 text-pink-900';
    return 'bg-gray-100 text-gray-900';
  };

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b">
        <h1 className="text-3xl font-serif text-gray-900">Multi-Agent Fashion Chat</h1>
        <p className="text-gray-600 mt-2">Chat with AI fashion agents - they collaborate in real-time</p>
      </div>

      <div className="flex-1 bg-white shadow-lg overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-2xl ${msg.sender === 'You' ? 'order-2' : 'order-1'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-700">{msg.sender}</span>
                <span className="text-xs text-gray-400">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className={`rounded-2xl px-4 py-3 ${getAgentColor(msg.sender)}`}>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white rounded-b-2xl shadow-lg p-4">
        {uploadedImage && (
          <div className="mb-3 relative inline-block">
            <img src={uploadedImage} alt="Upload" className="h-20 rounded-lg" />
            <button
              onClick={() => setUploadedImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
          >
            📎
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask the fashion agents anything..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !uploadedImage)}
            className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiAgentChat;

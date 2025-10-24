import { useState, useEffect, useRef } from 'react';
import { Brain, Sparkles } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { supabase } from './lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  image_url?: string;
  message_type?: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('timestamp', { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
  };

  const handleSendMessage = async (
    content: string,
    image?: string,
    mode: 'text' | 'image' | 'image-to-image' = 'text'
  ) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      image_url: image,
      message_type: mode,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    await supabase.from('messages').insert([userMessage]);

    try {
      let aiResponse: Message;

      if (mode === 'image' || mode === 'image-to-image') {
        const imageApiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-image`;
        const imageResponse = await fetch(imageApiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: content,
            sourceImage: image,
          }),
        });

        const imageData = await imageResponse.json();

        aiResponse = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: imageData.description || imageData.error || 'Unable to process image request.',
          timestamp: new Date().toISOString(),
          message_type: mode,
        };
      } else {
        const chatApiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-chat`;
        const chatResponse = await fetch(chatApiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: content,
            image: image,
          }),
        });

        const chatData = await chatResponse.json();

        aiResponse = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: chatData.response || chatData.error || 'Unable to get response.',
          timestamp: new Date().toISOString(),
          message_type: 'text',
        };
      }

      setMessages((prev) => [...prev, aiResponse]);
      await supabase.from('messages').insert([aiResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString(),
        message_type: 'text',
      };
      setMessages((prev) => [...prev, errorMessage]);
      await supabase.from('messages').insert([errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                R.O.N.I
              </h1>
              <p className="text-sm text-gray-600">Responsive Organic Neural Interface</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-emerald-600">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="text-sm font-medium">Gemini AI Powered</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 px-4">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl mb-6">
                <Brain className="w-14 h-14 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Welcome to R.O.N.I
              </h2>
              <p className="text-gray-600 text-center max-w-md mb-8">
                Your Responsive Organic Neural Interface powered by Google Gemini AI.
                Chat, generate images, or transform existing images!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                <button
                  onClick={() => handleSendMessage("What can you help me with?")}
                  className="p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all text-left"
                >
                  <div className="font-semibold text-gray-800 mb-1">Getting Started</div>
                  <div className="text-sm text-gray-600">What can you help me with?</div>
                </button>
                <button
                  onClick={() => handleSendMessage("Explain quantum computing in simple terms")}
                  className="p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all text-left"
                >
                  <div className="font-semibold text-gray-800 mb-1">Ask Questions</div>
                  <div className="text-sm text-gray-600">Explain quantum computing</div>
                </button>
                <button
                  onClick={() => handleSendMessage("Write a haiku about artificial intelligence")}
                  className="p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all text-left"
                >
                  <div className="font-semibold text-gray-800 mb-1">Creative Writing</div>
                  <div className="text-sm text-gray-600">Write a haiku about AI</div>
                </button>
                <button
                  onClick={() => handleSendMessage("What are the latest trends in technology?")}
                  className="p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all text-left"
                >
                  <div className="font-semibold text-gray-800 mb-1">Tech Insights</div>
                  <div className="text-sm text-gray-600">Latest technology trends</div>
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  imageUrl={message.image_url}
                />
              ))}
              {isLoading && (
                <div className="flex gap-4 p-6 bg-gradient-to-r from-slate-50 to-gray-50">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="font-semibold text-gray-900">R.O.N.I</div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
}

export default App;

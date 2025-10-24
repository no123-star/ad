import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
}

export function ChatMessage({ role, content, imageUrl }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-4 p-6 ${isUser ? 'bg-white' : 'bg-gradient-to-r from-slate-50 to-gray-50'}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isUser ? 'bg-blue-500' : 'bg-gradient-to-br from-emerald-500 to-teal-600'
      }`}>
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>
      <div className="flex-1 space-y-2">
        <div className="font-semibold text-gray-900">
          {isUser ? 'You' : 'R.O.N.I'}
        </div>
        {imageUrl && (
          <img
            src={`data:image/jpeg;base64,${imageUrl}`}
            alt="Message attachment"
            className="max-w-md rounded-lg border border-gray-200 shadow-sm"
          />
        )}
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </div>
  );
}

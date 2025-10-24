import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { ImageUpload } from './ImageUpload';

interface ChatInputProps {
  onSend: (message: string, image?: string, mode?: 'text' | 'image' | 'image-to-image') => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mode, setMode] = useState<'text' | 'image' | 'image-to-image'>('text');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim(), selectedImage || undefined, mode);
      setInput('');
      setSelectedImage(null);
      setMode('text');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white p-4">
      <div className="max-w-5xl mx-auto space-y-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('text')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'text'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Text Chat
          </button>
          <button
            type="button"
            onClick={() => setMode('image')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              mode === 'image'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Generate Image
          </button>
          <button
            type="button"
            onClick={() => setMode('image-to-image')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              mode === 'image-to-image'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Image to Image
          </button>
        </div>

        {(mode === 'image-to-image' || selectedImage) && (
          <ImageUpload
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
            onImageRemove={() => setSelectedImage(null)}
          />
        )}

        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={
                mode === 'text'
                  ? 'Ask R.O.N.I anything...'
                  : mode === 'image'
                  ? 'Describe the image you want to generate...'
                  : 'Upload an image and describe how to modify it...'
              }
              disabled={disabled}
              rows={1}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minHeight: '52px', maxHeight: '200px' }}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || disabled}
            className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
          >
            <Send className="w-5 h-5" />
            Send
          </button>
        </div>
      </div>
    </form>
  );
}

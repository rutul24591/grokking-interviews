'use client';
import { useRef, useEffect, useCallback } from 'react';
import { useChatStore } from './lib/message-store';
import type { ChatMessage } from './lib/chat-types';

export function ChatContainer({ messages: initialMessages, onSend }: { messages: ChatMessage[]; onSend: (content: string) => void }) {
  const listRef = useRef<HTMLDivElement>(null);
  const messages = useChatStore((s) => s.messages);
  const isAtBottom = useChatStore((s) => s.isAtBottom);
  const setIsAtBottom = useChatStore((s) => s.setIsAtBottom);

  useEffect(() => {
    useChatStore.setState({ messages: initialMessages });
  }, [initialMessages]);

  const onScroll = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    setIsAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 50);
  }, [setIsAtBottom]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <div ref={listRef} onScroll={onScroll} className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.senderId === 'me' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}>
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs opacity-70 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
      </div>
      <ChatInput onSend={onSend} />
    </div>
  );
}

function ChatInput({ onSend }: { onSend: (content: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = inputRef.current;
    if (!input || !input.value.trim()) return;
    onSend(input.value.trim());
    input.value = '';
  };
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
      <input ref={inputRef} placeholder="Type a message..." className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none" />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Send</button>
    </form>
  );
}

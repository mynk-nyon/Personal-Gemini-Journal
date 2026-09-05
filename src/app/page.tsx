'use client';

import { useState } from 'react';
import { Send, Book, Plus, History as HistoryIcon, Activity } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; content: string };

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // In a real app, this token comes from Firebase Auth
  const dummyToken = "Bearer dummy_token_for_local_ui_testing";

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = { role: 'user', content: input };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': dummyToken
        },
        body: JSON.stringify({
          history: messages,
          message: userMessage.content
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessages([...newHistory, { role: 'assistant', content: data.response }]);
      } else {
        alert("Error: " + (data.error || "Failed to fetch response"));
      }
    } catch (e) {
      alert("Network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (messages.length === 0) return;
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': dummyToken
        },
        body: JSON.stringify({ history: messages })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Journal Saved Successfully! \nTitle: " + data.entry.title);
        setMessages([]); // Clear chat for new entry
      } else {
        alert("Error: " + data.error);
      }
    } catch (e) {
      alert("Error saving journal.");
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-900">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border">
          <div className="flex justify-center mb-4 text-blue-600"><Book size={48} /></div>
          <h1 className="text-3xl font-bold text-center">Gemini Journal</h1>
          <p className="text-center text-gray-600">Secure AI-powered reflection & journaling.</p>
          <button 
            onClick={() => setIsAuthenticated(true)}
            className="w-full py-3 mt-4 font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
          >
            Sign In with Firebase
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col hidden md:flex">
        <div className="p-6 border-b flex items-center gap-2">
          <Book className="text-blue-600" />
          <h2 className="text-xl font-bold">Journal</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="flex items-center gap-3 w-full p-3 text-left bg-blue-50 text-blue-700 rounded-lg font-medium">
            <Plus size={18} /> New Entry
          </button>
          <button className="flex items-center gap-3 w-full p-3 text-left text-gray-600 hover:bg-gray-100 rounded-lg">
            <HistoryIcon size={18} /> History
          </button>
          <button className="flex items-center gap-3 w-full p-3 text-left text-gray-600 hover:bg-gray-100 rounded-lg">
            <Activity size={18} /> Insights
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <section className="flex-1 flex flex-col h-screen">
        <header className="p-6 border-b bg-white flex justify-between items-center shadow-sm">
          <h1 className="text-2xl font-bold">Reflect & Write</h1>
          {messages.length > 0 && (
            <button 
              onClick={handleSummarize}
              className="px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
            >
              Finish & Save Journal
            </button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl w-full mx-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <Book size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-lg">What would you like to reflect on today?</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={\`flex \${msg.role === 'user' ? 'justify-end' : 'justify-start'}\`}>
                <div className={\`max-w-[80%] rounded-2xl p-4 \${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white border text-gray-800 rounded-bl-none shadow-sm'
                }\`}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border text-gray-500 rounded-2xl rounded-bl-none p-4 shadow-sm animate-pulse">
                Thinking...
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t">
          <div className="max-w-4xl mx-auto flex gap-4">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 p-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              placeholder="Type your thoughts..."
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-4 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

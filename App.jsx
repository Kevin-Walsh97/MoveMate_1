import React, { useState } from 'react';
import axios from 'axios';
import './index.css'; // Tailwind should be imported here

const App = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hi there! I’m Urban Anchor’s assistant. Where are you moving from and to?" }
  ]);
  const [input, setInput] = useState('');
  const sessionId = 'demo-session'; // You can make this dynamic

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
        message: input,
        session_id: sessionId
      });

      const botReply = { sender: 'bot', text: res.data.reply };
      setMessages(prev => [...prev, botReply]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Oops! Something went wrong.' }]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Urban Anchor</h1>
        <div className="space-y-2 h-96 overflow-y-auto pr-2 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-xl px-4 py-2 max-w-xs ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex">
          <input
            type="text"
            className="flex-grow rounded-l-xl bg-gray-700 p-2 outline-none text-white"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 px-4 py-2 rounded-r-xl hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;

import './App.css'
import { useState } from 'react'
import React from 'react'

const ollamaUrl = 'http://localhost:11434/api/generate';  // Ollama API 地址

type Message = {
  text: string,
  sender: 'ai' | 'user'
};

function App() {
  const [newInputValue, setNewInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const newMessage: React.FormEventHandler = async (e) => {
    e.preventDefault();
    if (!newInputValue.trim()) return;
    
    // 添加用戶消息
    const newMessages: Message[] = [...messages, {
      text: newInputValue,
      sender: "user"
    }];
    setMessages(newMessages);
    setNewInputValue('');

    // 發送請求到 Ollama
    try {
      const response = await fetch(ollamaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "ycchen/breeze-7b-instruct-v1_0:latest",  //  Ollama model
          prompt: newInputValue, // User input value
          stream: false
        })
      });

      const data = await response.json();
      
      // get Ollama generative data
      setMessages([...newMessages, {
        sender: 'ai',
        text: data.response || "Error: No response from Ollama."
      }]);

    } catch (error) {
      console.error("Error communicating with Ollama:", error);
      setMessages([...newMessages, {
        sender: 'ai',
        text: "Error: Could not connect to Ollama."
      }]);
    }
  };

  return (
    <main>
      <h1>Ollama Chat Bot</h1>
      {/* ✅ 確保 chat-container 存在 */}
      <div className="chat-container">
        {messages.map((message, index) => (
          <div key={index} className={`message-container ${message.sender}`}>
            <p className={`message ${message.sender}`}>
              {message.text}
            </p>
          </div>
        ))}
      </div>

      <form className='input-form' onSubmit={newMessage}>
        <input
          type="text"
          placeholder="Message"
          value={newInputValue}
          onChange={e => setNewInputValue(e.currentTarget.value)}
        />
        <input type='submit' value="Send" />
      </form>
    </main>
  );
}

export default App;

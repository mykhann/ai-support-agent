import { useState, useRef, useEffect } from "react";
import "./FAQChat.css";

export default function FAQChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "Hello! I'm your FAQ Assistant. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        content: message,
        time: userTime
      },
    ]);

    setMessage("");

    // Simulating API loading state & response
    setTimeout(() => {
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "This is a real-time response from the FAQ bot. You can now easily map your backend API call right here!",
          time: botTime
        },
      ]);
    }, 1000);
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
        
        {/* Header */}
        <header className="chat-header">
          <div className="header-info">
            <div className="avatar bot-avatar-header">🤖</div>
            <div>
              <h2>FAQ Assistant</h2>
              <div className="status-container">
                <span className="status-dot"></span>
                <span className="status-text">Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Body */}
        <div className="chat-body">
          <div className="messages-wrapper">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-row ${msg.role}`}>
                {msg.role === "assistant" && (
                  <div className="avatar msg-avatar">🤖</div>
                )}
                
                <div className="message-content">
                  <div className="bubble">
                    {msg.content}
                  </div>
                  <span className="timestamp">{msg.time}</span>
                </div>

                {msg.role === "user" && (
                  <div className="avatar msg-avatar user-avatar">👤</div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Footer Input */}
        <footer className="chat-footer">
          <form className="input-container" onSubmit={handleSubmit}>
            <input
              type="text"
              className="chat-input"
              placeholder="Ask a question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" className="send-btn" disabled={!message.trim()}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </footer>

      </div>
    </div>
  );
}
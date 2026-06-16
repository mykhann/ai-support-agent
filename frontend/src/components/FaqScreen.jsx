import { useState, useRef, useEffect } from "react";
import axios from "axios"; // Import Axios
import "./FAQChat.css";

const API_BASE_URL = "https://doc-based-ai-support-agent.onrender.com/api"; 

export default function FAQChat() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [sessionId] = useState(() => `session_${Date.now()}`); 
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "Hello! I'm your Automation Knowledge Assistant. Select a pipeline query below or type your own to test the retrieval network.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
  ]);

  const suggestionCards = [
    { label: "🔄 Webhook Retry Limits", query: "What is the retry policy for failing webhook integrations?" },
    { label: "🔒 Webhook Security", query: "How do I authenticate incoming webhooks from external services?" },
    { label: "🧹 Clear Stalled Jobs", query: "How do I clear a stalled task or job in the background queue?" },
    { label: "📈 API Rate Limiting", query: "What is the API rate limit for our internal AI automation gateway?" }
  ];

  const messagesEndRef = useRef(null);

  // Fetch chat history on initial mount if needed
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const handleQuerySubmit = async (queryText) => {
    if (!queryText.trim() || isLoading) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Push user query locally right away
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        content: queryText,
        time: userTime
      },
    ]);

    setIsLoading(true);
    setLoadingStatus("🔍 Querying Database via Case-Insensitive Regex...");

    try {
   
      await new Promise((resolve) => setTimeout(resolve, 600));
      setLoadingStatus("🧠 Dynamic Context Extracted. Compiling Groq LLM system prompt...");
      await new Promise((resolve) => setTimeout(resolve, 600));
      setLoadingStatus("🚀 Routing contextual payload to Groq Infrastructure...");

      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message: queryText,
        sessionId: sessionId
      });

      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Append the real response from Groq
      if (response.data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            content: response.data.reply,
            time: botTime
          },
        ]);
      }

    } catch (error) {
      console.error("API Connection Error:", error);
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "❌ System Connection Fault: Failed to establish data stream pipeline with the automation server.",
          time: botTime
        },
      ]);
    } finally {
      setIsLoading(false);
      setLoadingStatus("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleQuerySubmit(message);
    setMessage("");
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
        
        {/* Header */}
        <header className="chat-header">
          <div className="header-info">
            <div className="avatar bot-avatar-header">🤖</div>
            <div>
              <h2>RAG Knowledge Bot</h2>
              <div className="status-container">
                <span className="status-dot"></span>
                <span className="status-text">Automation Active</span>
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

            {/* Render Suggestion Cards ONLY on initial greeting view */}
            {messages.length === 1 && !isLoading && (
              <div className="suggestions-grid">
                {suggestionCards.map((card, index) => (
                  <button 
                    key={index} 
                    type="button"
                    className="suggestion-card"
                    onClick={() => handleQuerySubmit(card.query)}
                  >
                    {card.label}
                  </button>
                ))}
              </div>
            )}

            {/* Pipeline Status Terminal Indicator */}
            {isLoading && (
              <div className="message-row assistant loading-row">
                <div className="avatar msg-avatar">🤖</div>
                <div className="message-content">
                  <div className="bubble loading-bubble">
                    <span className="spinner"></span>
                    <span className="loading-text">{loadingStatus}</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <footer className="chat-footer">
          <form className="input-container" onSubmit={handleSubmit}>
            <input
              type="text"
              className="chat-input"
              placeholder="Ask a technical or infrastructure question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" className="send-btn" disabled={!message.trim() || isLoading}>
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
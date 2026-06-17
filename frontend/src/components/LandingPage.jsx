import React from "react";
import "./LandingPage.css";

export default function LandingPage({ onEnterChat }) {
  const techStack = [
    { name: "React.js", category: "Frontend" },
    { name: "Groq Cloud API", category: "AI Brain" },
    { name: "MongoDB Atlas", category: "Database" },
    { name: "Node.js / Express", category: "Backend Server" }
  ];

  return (
    <div className="landing-page">
      {/* Abstract Background Glows */}
      <div className="glow-sphere glow-1"></div>
      <div className="glow-sphere glow-2"></div>

      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <span className="bot-icon">🤖</span>
          <span className="logo-text">Doc Based Q & A</span>
        </div>
        <div className="nav-badge">System Live</div>
      </nav>

      {/* Main Hero Container */}
      <main className="hero-container">
        <header className="hero-header">
          <div className="architecture-tag">💡 Smart AI Document Assistant</div>
          <h1>
            Turn Company Documents <br />
            into an <span className="gradient-text">Instant AI FAQ Bot</span>
          </h1>
          <p className="hero-subtitle">
            This app reads company rules, files, or answers that you add, and uses AI to reply to user questions instantly. It searches your records first, picks out the right context, and lets a fast AI model write back perfectly.
          </p>
        </header>

        {/* Dynamic CTA Module */}
        <div className="cta-wrapper">
          <button className="premium-btn" onClick={onEnterChat}>
            <span>Start Chatting</span>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z" />
            </svg>
          </button>
          <p className="cta-caption">Click to test the AI chat interface yourself.</p>
        </div>

        {/* Feature Grid / Recruiter Insights */}
        <section className="info-grid">
          <div className="info-card">
            <div className="card-icon">📂</div>
            <h3>Add Your Data</h3>
            <p>Recruiters or admins can easily save new questions and answers into the database using a secure endpoint backend tool.</p>
          </div>
          <div className="info-card">
            <div className="card-icon">⚡</div>
            <h3>Fast Text Search</h3>
            <p>The code takes user messages, looks through MongoDB records instantly using text filters, and finds matching data maps.</p>
          </div>
          <div className="info-card">
            <div className="card-icon">🏢</div>
            <h3>Great for Teams</h3>
            <p>Perfect for helping employees read company handbooks, checking HR rules, or answering customer support tickets automatically.</p>
          </div>
        </section>

        {/* Tech Stack Chips Section */}
        <section className="tech-stack-section">
          <h4>TECH STACK USED</h4>
          <div className="tech-chips">
            {techStack.map((tech, i) => (
              <div key={i} className="tech-chip">
                <span className="chip-name">{tech.name}</span>
                <span className="chip-cat">{tech.category}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="landing-footer">
        <p>© 2026 Developer Portfolio. Built to show full-stack AI development skills.</p>
      </footer>
    </div>
  );
}
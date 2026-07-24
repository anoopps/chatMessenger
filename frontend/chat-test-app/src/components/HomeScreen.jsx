import React from "react";

const HomeScreen = () => {
  return (
    <div className="d-flex flex-column h-100 text-light bg-dark overflow-auto px-4 py-5">
      
      {/* ── Hero Section ── */}
      <div className="text-center mt-5 mb-5">
        <h1 className="hero-title">AI Powered Real-Time Chat Application</h1>
        <p className="hero-subtitle">
          A modern real-time messaging platform built with React, Node.js, Socket.IO and AI.
        </p>
      </div>

      {/* ── Features Grid ── */}
      <div className="container mt-4 mb-5">
        <div className="row g-4">
          
          {/* Feature 1 */}
          <div className="col-12 col-md-6 col-xl-4">
            <div className="feature-card">
              <span className="feature-icon">🔐</span>
              <h3 className="feature-title">JWT Authentication</h3>
              <ul className="feature-list">
                <li>Secure authentication</li>
                <li>Protected routes</li>
              </ul>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="col-12 col-md-6 col-xl-4">
            <div className="feature-card">
              <span className="feature-icon">👤</span>
              <h3 className="feature-title">User Registration & Login</h3>
              <ul className="feature-list">
                <li>Create account</li>
                <li>Secure login</li>
              </ul>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="col-12 col-md-6 col-xl-4">
            <div className="feature-card">
              <span className="feature-icon">💬</span>
              <h3 className="feature-title">Chat Rooms</h3>
              <ul className="feature-list">
                <li>Join multiple chat rooms</li>
                <li>Organized conversations</li>
              </ul>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="col-12 col-md-6 col-xl-4">
            <div className="feature-card">
              <span className="feature-icon">⚡</span>
              <h3 className="feature-title">Real-Time Messaging</h3>
              <ul className="feature-list">
                <li>Powered by Socket.IO</li>
                <li>Instant message delivery</li>
              </ul>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="col-12 col-md-6 col-xl-4">
            <div className="feature-card">
              <span className="feature-icon">🤖</span>
              <h3 className="feature-title">AI Smart Reply Suggestions</h3>
              <ul className="feature-list">
                <li>Context-aware reply suggestions</li>
                <li>One-click message insertion</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
};

export default HomeScreen;

import React, { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../utils/api.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * SmartReplySuggestions
 *
 * Displays 3 AI-generated reply suggestions below the message list.
 * Manages its own network state: loading, suggestions, and error.
 *
 * Props:
 *   roomId            — current chat room ID (triggers a new fetch when changed)
 *   token             — JWT for the API call
 *   onSelectSuggestion — callback(text) called when a suggestion chip is clicked;
 *                        the parent uses this to prefill the message input
 *
 * Request flow:
 *   Component mounts / roomId changes
 *   → fetchSuggestions()
 *   → apiFetch POST /chatrooms/:roomId/suggestions
 *   → renders suggestion chips
 *   → user clicks chip → onSelectSuggestion(text) → MessageInput prefilled
 */
const SmartReplySuggestions = ({ roomId, token, onSelectSuggestion }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // -------------------------------------------------------------------
  // fetchSuggestions — wrapped in useCallback so it can be used both
  // in useEffect and as the retry button handler without creating a new
  // function reference on every render.
  // -------------------------------------------------------------------
  const fetchSuggestions = useCallback(async () => {
    if (!roomId || !token) return;

    setLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const result = await apiFetch(
        `${API_BASE_URL}/chatrooms/${roomId}/suggestions`,
        "POST",
        token,
        "smart-reply-suggestions"
      );

      if (result?.success && Array.isArray(result?.data?.suggestions)) {
        setSuggestions(result.data.suggestions);
      } else {
        // The API responded, but with an error payload (e.g., 422 empty room)
        const errorMsg = result?.error || "Could not load suggestions.";
        setError(errorMsg);
      }
    } catch (err) {
      // Network-level failure (no internet, server down, etc.)
      setError("Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [roomId, token]);

  // Fetch on mount and whenever the user switches rooms.
  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  // -------------------------------------------------------------------
  // Don't render the section at all if there's no active room.
  // -------------------------------------------------------------------
  if (!roomId) return null;

  return (
    <div className="smart-reply-container">
      <div className="smart-reply-header">
        {/* Sparkle icon to signal AI */}
        <span className="smart-reply-icon">✨</span>
        <span className="smart-reply-label">Suggested Replies</span>

        {/* Refresh button — always visible so users can manually regenerate */}
        {!loading && (
          <button
            className="smart-reply-refresh"
            onClick={fetchSuggestions}
            title="Refresh suggestions"
            aria-label="Refresh AI suggestions"
            id="smart-reply-refresh-btn"
          >
            ↺
          </button>
        )}
      </div>

      {/* ── Loading state ─────────────────────────────────────────── */}
      {loading && (
        <div className="smart-reply-loading" aria-live="polite">
          <span className="smart-reply-dot" />
          <span className="smart-reply-dot" />
          <span className="smart-reply-dot" />
          <span className="smart-reply-loading-text">Generating suggestions…</span>
        </div>
      )}

      {/* ── Error state ───────────────────────────────────────────── */}
      {!loading && error && (
        <div className="smart-reply-error" role="alert">
          <span className="smart-reply-error-icon">⚠</span>
          <span className="smart-reply-error-text">{error}</span>
          <button
            className="smart-reply-retry-btn"
            onClick={fetchSuggestions}
            id="smart-reply-retry-btn"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Success state: suggestion chips ───────────────────────── */}
      {!loading && !error && suggestions.length > 0 && (
        <div className="smart-reply-chips" role="group" aria-label="Suggested replies">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              id={`smart-reply-chip-${index}`}
              className="smart-reply-chip"
              onClick={() => onSelectSuggestion(suggestion)}
              title={`Use: "${suggestion}"`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartReplySuggestions;

import React from "react";
import { Link } from "react-router-dom";
import { siteConfig } from "../../config/siteConfig";

export function Logo({ 
  size = "md", // "sm", "md", "lg"
  showText = true, 
  showTagline = false,
  isDark = false,
  className = "" 
}) {
  const iconSizes = {
    sm: 28,
    md: 38,
    lg: 48
  };

  const currentSize = iconSizes[size] || 38;

  return (
    <Link to="/" className={`charmdrop-logo-brand ${className} ${isDark ? "logo-dark-theme" : ""}`}>
      <div className="logo-symbol-wrapper" style={{ width: currentSize, height: currentSize }}>
        <svg viewBox="0 0 64 64" fill="none" className="logo-svg-art">
          {/* Top Hanging String */}
          <line x1="32" y1="2" x2="32" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 1.5" className="logo-cord-stroke" />
          <circle cx="32" cy="24" r="3" fill="#6366F1" />

          {/* Hanging Modern Diamond Charm */}
          <g transform="translate(32, 40) rotate(45)">
            <rect 
              x="-11" 
              y="-11" 
              width="22" 
              height="22" 
              rx="4.5" 
              fill="url(#logoCharmGrad)" 
              stroke="#818CF8" 
              strokeWidth="2" 
            />
            <circle cx="0" cy="0" r="4.5" fill="#FFFFFF" />
          </g>

          {/* Golden Sparkle ✦ */}
          <path 
            d="M48 14 L49.5 20 L55.5 21.5 L49.5 23 L48 29 L46.5 23 L40.5 21.5 L46.5 20 Z" 
            fill="#E8B84A" 
            className="logo-sparkle-star"
          />
          <circle cx="48" cy="21.5" r="1.2" fill="#FFFBEB" />

          <defs>
            <linearGradient id="logoCharmGrad" x1="-11" y1="-11" x2="11" y2="11" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4F46E5" />
              <stop offset="0.5" stopColor="#7C3AED" />
              <stop offset="1" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="logo-text-block">
          <div className="logo-title-row">
            <span className="logo-text-main">{siteConfig.siteName}</span>
            <span className="logo-sub-badge">WIN</span>
          </div>
          {showTagline && (
            <span className="logo-tagline-text">{siteConfig.tagline}</span>
          )}
        </div>
      )}
    </Link>
  );
}

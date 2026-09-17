import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Download, 
  Sparkles, 
  ArrowRight, 
  Monitor, 
  ShieldCheck, 
  Zap, 
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { HangingCharm } from "../common/HangingCharm";
import { siteConfig } from "../../config/siteConfig";

const HERO_PRESETS = [
  { id: "evil-eye", name: "Evil Eye", label: "🧿 Evil Eye", category: "Lucky" },
  { id: "nimbu-mirchi", name: "Nimbu Mirchi", label: "Nimbu Mirchi", category: "Daily" },
  { id: "lucky-bell", name: "Fortune Bell", label: "🔔 Bell", category: "Lucky" },
  { id: "four-leaf-clover", name: "Four Leaf Clover", label: "🍀 Clover", category: "Lucky" },
  { id: "lucky-cat", name: "Lucky Cat", label: "🐱 Lucky Cat", category: "Lucky" }
];

export function HeroSection({ onOpenDownloadModal }) {
  const [activeHeroCharm, setActiveHeroCharm] = useState("evil-eye");

  const selectedPreset = HERO_PRESETS.find(p => p.id === activeHeroCharm) || HERO_PRESETS[0];

  return (
    <section className="charmdrop-hero-section">
      <div className="section-container">
        <div className="hero-two-col-grid">
          
          {/* LEFT COLUMN: Clean Content & CTAs */}
          <div className="hero-left-col">
            {/* Small Top Badge */}
            <motion.div
              className="hero-pill-badge"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="badge-win-dot" />
              <span>FREE FOR WINDOWS</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="hero-headline"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Your desktop. <br />
              <span className="hero-headline-accent">Your charm.</span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Bring a little charm to your screen.
            </motion.p>

            {/* Buttons: Get CharmDrop & Explore Charms */}
            <motion.div
              className="hero-buttons-row"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link
                to="/download"
                className="btn-royal-download"
                aria-label="Get CharmDrop"
              >
                <Download size={19} />
                <span>Get CharmDrop</span>
              </Link>

              <Link to="/charms" className="btn-clean-explore">
                <span>Explore Charms</span>
                <ArrowRight size={17} />
              </Link>
            </motion.div>

            {/* Small Supporting Text */}
            <motion.div 
              className="hero-support-label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span>Free • Windows 10 & 11</span>
            </motion.div>

            {/* Trust / Benefit Checkpoints */}
            <motion.div 
              className="hero-perks-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              <div className="perk-point">
                <CheckCircle2 size={16} className="text-royal-blue" />
                <span>Zero lag on games & apps</span>
              </div>
              <div className="perk-sep">•</div>
              <div className="perk-point">
                <CheckCircle2 size={16} className="text-royal-blue" />
                <span>7 Handcrafted charms</span>
              </div>
              <div className="perk-sep">•</div>
              <div className="perk-point">
                <CheckCircle2 size={16} className="text-royal-blue" />
                <span>Daily Nimbu Mirchi ritual</span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Desktop Window Mockup with Hanging Charm & Soft Blue Glow */}
          <motion.div 
            className="hero-right-col"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Soft Ambient Blue Glow Behind Mockup */}
            <div className="hero-soft-blue-glow" />

            {/* Main Desktop Mockup Frame */}
            <div className="hero-desktop-mockup">
              {/* Window Header */}
              <div className="mockup-header-bar">
                <div className="mockup-window-controls">
                  <span className="ctrl-dot dot-red" />
                  <span className="ctrl-dot dot-amber" />
                  <span className="ctrl-dot dot-green" />
                </div>
                <div className="mockup-header-title">
                  <Monitor size={13} />
                  <span>CharmDrop Desktop Preview</span>
                </div>
                <div className="mockup-header-status">
                  <span className="status-live-indicator" />
                  <span>Interactive Charm Preview</span>
                </div>
              </div>

              {/* Window Content Area with Hanging Charm */}
              <div className="mockup-window-canvas">
                {/* Hanging Charm Rig */}
                <div className="mockup-charm-center">
                  <HangingCharm
                    iconKey={activeHeroCharm}
                    size={110}
                    stringLength={120}
                    interactive={true}
                    caption="Drag or flick anywhere to swing"
                  />
                </div>

                {/* In-Window Charm Switcher Pills */}
                <div className="mockup-switcher-bar">
                  <span className="switcher-caption">Choose a charm:</span>
                  <div className="switcher-buttons-group">
                    {HERO_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => setActiveHeroCharm(preset.id)}
                        className={`switcher-mini-btn ${activeHeroCharm === preset.id ? "active" : ""}`}
                        title={preset.name}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Badge Accents */}
              <div className="floating-badge-accent top-right">
                <Sparkles size={14} className="badge-sparkle-gold" />
                <span>Always on top</span>
              </div>

              <div className="floating-badge-accent bottom-left">
                <RefreshCw size={13} className="badge-refresh-icon" />
                <span>Natural physics recoil</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

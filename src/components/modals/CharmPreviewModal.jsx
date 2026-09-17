import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Download, 
  Sparkles, 
  Flame, 
  Clock, 
  RefreshCw,
  CheckCircle2,
  Volume2,
  ArrowRight
} from "lucide-react";
import { HangingCharm } from "../common/HangingCharm";
import { siteConfig } from "../../config/siteConfig";

export function CharmPreviewModal({ charm, isOpen, onClose }) {
  const navigate = useNavigate();
  if (!isOpen || !charm) return null;

  const [isDemoFaded, setIsDemoFaded] = useState(false);
  const [demoStringLen, setDemoStringLen] = useState(120);

  const isNimbu = charm.id === "nimbu-mirchi";
  const hasBellSound = charm.id === "lucky-bell";
  const hasCatSound = charm.id === "lucky-cat";

  const handleUseCharm = () => {
    try {
      localStorage.setItem("selectedCharmId", charm.id);
    } catch (e) {}
    onClose();
    navigate(`/download?charm=${charm.id}`);
  };

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={onClose}>
        <motion.div
          className="modal-card charm-preview-modal-box"
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button className="modal-close-btn" onClick={onClose} aria-label="Close preview">
            <X size={20} />
          </button>

          <div className="preview-modal-grid">
            {/* Left/Top Interactive Hanging Canvas */}
            <div className="preview-charm-stage">
              <div className="stage-top-border">
                <span className="stage-label">Windows Desktop Simulation</span>
              </div>

              {/* The Hanging Charm in full interactive mode */}
              <div className="preview-hanging-rig">
                <HangingCharm
                  iconKey={charm.iconKey}
                  image={charm.image}
                  size={charm.image ? 135 : 110}
                  stringLength={demoStringLen}
                  interactive={true}
                  isFaded={isDemoFaded}
                  caption="Grab & drag anywhere to test swing"
                />
              </div>

              {/* Special interactive controls for Nimbu Mirchi */}
              {isNimbu && (
                <div className="stage-demo-toggle">
                  <button
                    onClick={() => setIsDemoFaded(!isDemoFaded)}
                    className={`btn-toggle-freshness ${isDemoFaded ? "state-faded" : "state-fresh"}`}
                  >
                    <RefreshCw size={14} className={isDemoFaded ? "spin-icon" : ""} />
                    <span>{isDemoFaded ? "Simulate: Day 2 (Faded)" : "Simulate: Day 1 (Fresh)"}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right Details Panel */}
            <div className="preview-charm-details">
              <div className="preview-category-row">
                <span className="preview-cat-badge">{charm.category}</span>
                {charm.isDaily && (
                  <span className="preview-daily-badge">
                    <Clock size={13} />
                    <span>Daily Refresh Charm</span>
                  </span>
                )}
                {hasBellSound && (
                  <span className="preview-sound-badge">
                    <Volume2 size={13} />
                    <span>Interactive Bell Sound</span>
                  </span>
                )}
                {hasCatSound && (
                  <span className="preview-sound-badge">
                    <Volume2 size={13} />
                    <span>Interactive Cat Sound</span>
                  </span>
                )}
                {charm.isPopular && !hasBellSound && !hasCatSound && (
                  <span className="preview-popular-badge">
                    <Flame size={13} />
                    <span>Trending Drop</span>
                  </span>
                )}
              </div>

              <h2 className="preview-charm-name">{charm.name}</h2>
              <p className="preview-charm-desc">{charm.description}</p>

              {/* Feature Highlights */}
              <div className="preview-specs-box">
                <div className="spec-row">
                  <span className="spec-label">Tag / Vibe</span>
                  <span className="spec-value">{charm.tag}</span>
                </div>
                {hasBellSound && (
                  <div className="spec-row">
                    <span className="spec-label">Audio Effect</span>
                    <span className="spec-value text-amber-600 font-semibold">Interactive bell sound</span>
                  </div>
                )}
                {hasCatSound && (
                  <div className="spec-row">
                    <span className="spec-label">Audio Effect</span>
                    <span className="spec-value text-amber-600 font-semibold">Interactive cat sound</span>
                  </div>
                )}
                <div className="spec-row">
                  <span className="spec-label">Desktop Behavior</span>
                  <span className="spec-value">Always on Top across Windows</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Supported Platform</span>
                  <span className="spec-value">Windows 10 & 11 (64-bit)</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Price</span>
                  <span className="spec-value font-bold text-emerald-600">Free</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="preview-modal-actions">
                <button
                  className="btn-preview-use-main"
                  onClick={handleUseCharm}
                >
                  <span>Use This Charm</span>
                  <ArrowRight size={18} />
                </button>
              </div>

              <div className="preview-footer-note">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>Works across your Windows desktop — not just inside your browser</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Download, 
  Sparkles, 
  Flame, 
  Clock, 
  RefreshCw,
  Eye,
  Sliders,
  CheckCircle2,
  Share2
} from "lucide-react";
import { HangingCharm } from "../common/HangingCharm";
import { siteConfig } from "../../config/siteConfig";

export function CharmPreviewModal({ charm, isOpen, onClose, onDownloadClick }) {
  if (!isOpen || !charm) return null;

  const [isDemoFaded, setIsDemoFaded] = useState(false);
  const [demoStringLen, setDemoStringLen] = useState(120);

  const isNimbu = charm.id === "nimbu-mirchi";

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
                  caption="Grab & drag anywhere inside this window"
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
                {charm.isPopular && (
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
                <div className="spec-row">
                  <span className="spec-label">Desktop Behavior</span>
                  <span className="spec-value">Always on Top / Clickable</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Supported Platform</span>
                  <span className="spec-value">Windows 10 & 11 (64-bit)</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Price</span>
                  <span className="spec-value font-bold text-emerald-600">₹0 (Free Forever)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="preview-modal-actions">
                <a
                  href={siteConfig.download.windows.url}
                  download={siteConfig.download.windows.filename}
                  className="btn-preview-download"
                  onClick={onClose}
                >
                  <Download size={18} />
                  <span>Download for Windows (Free)</span>
                </a>
              </div>

              <div className="preview-footer-note">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>Zero background lag • Hangs over games & browser windows</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

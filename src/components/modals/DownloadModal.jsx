import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Monitor, 
  Sparkles, 
  Check, 
  Copy, 
  Mail, 
  ArrowRight,
  ShieldCheck,
  Cpu,
  Laptop,
  Download
} from "lucide-react";
import { Instagram } from "../common/InstagramIcon";
import { siteConfig } from "../../config/siteConfig";

export function DownloadModal({ isOpen, onClose }) {
  const [emailInput, setEmailInput] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleNotifySubmit = (e) => {
    e.preventDefault();
    if (emailInput.trim().includes("@")) {
      setIsSubscribed(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={onClose}>
        <motion.div
          className="modal-card download-modal-box"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>

          {/* Top Hanging String Accent inside Modal */}
          <div className="modal-top-accent">
            <div className="modal-hanging-line" />
            <div className="modal-hanging-bead" />
          </div>

          <div className="download-modal-header">
            <div className="os-badge-chip">
              <Monitor size={15} />
              <span>Windows 10 & 11 • 64-bit</span>
            </div>

            <h3 className="download-modal-title">CharmDrop for Windows</h3>
            <p className="download-modal-subtitle">
              <span className="pill-ready-status" style={{ background: "#DCFCE7", color: "#15803D" }}>Available Now</span>
              Version {siteConfig.download.windows.version} is ready to download.
            </p>
          </div>

          {/* Direct Download Button */}
          <div style={{ padding: "0 1.5rem 1rem" }}>
            <a
              href={siteConfig.download.windows.url}
              download={siteConfig.download.windows.filename}
              className="btn-download-installer-main"
              style={{ width: "100%", margin: "0 auto", padding: "0.95rem" }}
              onClick={onClose}
            >
              <Download size={18} />
              <span>Download for Windows</span>
            </a>
          </div>

          {/* Early Access Notification Form */}
          <div className="modal-early-access-block">
            {!isSubscribed ? (
              <form onSubmit={handleNotifySubmit} className="early-access-form">
                <label className="form-input-label">Get notified for new charm drops</label>
                <div className="input-with-button">
                  <div className="input-icon-wrapper">
                    <Mail size={16} />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="email-input-field"
                    />
                  </div>
                  <button type="submit" className="btn-notify-submit">
                    <span>Subscribe</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
                <p className="form-micro-text">Zero spam. Only new charm pack releases.</p>
              </form>
            ) : (
              <motion.div 
                className="success-alert-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="success-icon-badge">
                  <Check size={20} />
                </div>
                <div>
                  <strong>You're on the list!</strong>
                  <p>We'll notify you whenever a new charm pack drops.</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Mobile / Cross-device share section */}
          <div className="modal-handoff-section">
            <div className="handoff-header">
              <Laptop size={16} className="handoff-icon" />
              <span>On mobile right now? Open on your PC</span>
            </div>
            <p className="handoff-desc">
              CharmDrop hangs natively on Windows. Copy the link to send it to your desktop via WhatsApp or Discord.
            </p>
            
            <button onClick={handleCopyLink} className="btn-copy-handoff">
              {copiedLink ? (
                <>
                  <Check size={16} className="text-emerald-500" />
                  <span>Link Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy Website URL for PC</span>
                </>
              )}
            </button>
          </div>

          {/* Social Instagram Growth Connection */}
          <div className="modal-footer-actions">
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-instagram-modal"
            >
              <Instagram size={17} />
              <span>Follow Drops on Instagram</span>
            </a>
            <button onClick={onClose} className="btn-secondary-modal">
              Close
            </button>
          </div>

          {/* System Spec Checkpoints */}
          <div className="modal-specs-strip">
            <div className="spec-item"><ShieldCheck size={13} /> 100% Virus-Free Local App</div>
            <div className="spec-item"><Cpu size={13} /> &lt;0.5% Background CPU</div>
            <div className="spec-item"><Sparkles size={13} /> ₹0 Free Forever</div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

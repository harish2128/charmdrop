import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Download, 
  Monitor, 
  ShieldAlert,
  Check, 
  Copy, 
  Laptop, 
  Smartphone, 
  ArrowRight,
  ExternalLink,
  Info,
  Layers
} from "lucide-react";
import { SectionTitle } from "../components/common/SectionTitle";
import { HangingCharm } from "../components/common/HangingCharm";
import { siteConfig } from "../config/siteConfig";

export function DownloadPage() {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const steps = [
    "Download CharmDrop.",
    `Open ${siteConfig.download.windows.filename}.`,
    "Complete the Windows installation.",
    "Launch CharmDrop.",
    "Choose a charm and make your desktop yours."
  ];

  return (
    <div className="download-page-container">
      {/* Page Hero */}
      <div className="page-hero-banner">
        <div className="section-container">
          <SectionTitle
            badge="Official Windows Release"
            badgeIcon={Monitor}
            title="CharmDrop"
            highlightText="for Windows."
            subtitle="Lightweight, interactive screen charms for your Windows desktop."
            align="center"
          />
        </div>
      </div>

      <div className="section-container">
        {/* Main Download Hub Card */}
        <div className="download-hub-grid">
          {/* Left: Main Installer Box */}
          <motion.div
            className="installer-primary-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="card-platform-strip">
              <Monitor size={18} />
              <span>Windows 10 & Windows 11</span>
            </div>

            <div className="installer-card-body">
              <div className="installer-icon-circle">
                <HangingCharm
                  iconKey="nimbu-mirchi"
                  size={70}
                  stringLength={50}
                  interactive={false}
                  caption=""
                />
              </div>

              <h2 className="installer-title">CharmDrop for Windows</h2>
              <p className="installer-subtitle">
                Version {siteConfig.download.windows.version}
              </p>

              <div className="installer-specs-tags">
                <span className="spec-pill">{siteConfig.download.windows.supportedOS}</span>
                <span className="spec-pill">{siteConfig.download.windows.architecture}</span>
                <span className="spec-pill">Free</span>
              </div>

              {/* Main CTA */}
              <a
                href={siteConfig.download.windows.url}
                download={siteConfig.download.windows.filename}
                className="btn-download-installer-main"
                aria-label="Download CharmDrop for Windows"
              >
                <Download size={20} />
                <span>Download for Windows</span>
              </a>

              {/* Installation Guide */}
              <div className="installation-guide-box">
                <div className="installation-guide-title">
                  <Layers size={16} className="text-accent" />
                  <span>Installation Guide</span>
                </div>
                <ol className="guide-steps-list">
                  {steps.map((step, idx) => (
                    <li key={idx} className="guide-step-item">
                      <span className="step-number-badge">{idx + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Windows Security Notice */}
              <div className="security-notice-banner">
                <ShieldAlert size={16} className="text-amber-600 flex-shrink-0" style={{ marginTop: "1px" }} />
                <span>
                  Windows may display a security confirmation when installing the current release.
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right: Mobile / Cross-Device Notice Card */}
          <motion.div
            className="mobile-handoff-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="handoff-card-header">
              <div className="handoff-icon-wrap">
                <Smartphone size={20} />
                <ArrowRight size={16} />
                <Laptop size={20} />
              </div>
              <h3>Browsing from Mobile?</h3>
            </div>

            <p className="handoff-text">
              CharmDrop desktop app is currently available for <strong>Windows</strong>. Open this page on your PC to download and install.
            </p>

            <div className="handoff-actions-list">
              <button onClick={handleCopyLink} className="btn-copy-url-big">
                {copiedLink ? (
                  <>
                    <Check size={18} className="text-emerald-500" />
                    <span>Link Copied! Paste on your PC</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    <span>Copy Link to Open on Windows PC</span>
                  </>
                )}
              </button>

              <a
                href={`https://wa.me/?text=Check%20out%20CharmDrop%20for%20Windows%20PC%3A%20${encodeURIComponent(window.location.origin + "/download")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-share-whatsapp"
              >
                <span>Share to WhatsApp / Send to Self</span>
                <ExternalLink size={14} />
              </a>
            </div>

            <div className="download-early-list-box">
              <h4>Desktop System Requirements</h4>
              <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: "1.5", marginTop: "0.4rem" }}>
                • Microsoft Windows 10 (64-bit) or Windows 11<br />
                • Standalone lightweight application (&lt;90 MB)<br />
                • Minimal background CPU usage
              </p>
            </div>
          </motion.div>
        </div>

        {/* Platform Notice Strip */}
        <div className="platform-notice-box">
          <Info size={18} className="text-indigo-600 flex-shrink-0" />
          <p>
            <strong>Platform Availability:</strong> CharmDrop desktop app is currently available for Windows 10 & 11 (64-bit).
          </p>
        </div>
      </div>
    </div>
  );
}


import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
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
  Layers, 
  Sparkles, 
  Volume2, 
  Power, 
  LayoutGrid,
  Info
} from "lucide-react";
import { SectionTitle } from "../components/common/SectionTitle";
import { HangingCharm } from "../components/common/HangingCharm";
import { siteConfig } from "../config/siteConfig";
import { getCharmById, charmsData } from "../data/charmsData";

export function DownloadPage() {
  const [searchParams] = useSearchParams();
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedCharmId, setSelectedCharmId] = useState("nimbu-mirchi");

  useEffect(() => {
    const urlCharm = searchParams.get("charm");
    if (urlCharm && charmsData.some((c) => c.id === urlCharm)) {
      setSelectedCharmId(urlCharm);
      try {
        localStorage.setItem("selectedCharmId", urlCharm);
      } catch (e) {}
    } else {
      try {
        const saved = localStorage.getItem("selectedCharmId");
        if (saved && charmsData.some((c) => c.id === saved)) {
          setSelectedCharmId(saved);
        }
      } catch (e) {}
    }
  }, [searchParams]);

  const activeCharm = getCharmById(selectedCharmId);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const hasBellSound = activeCharm.id === "lucky-bell";
  const hasCatSound = activeCharm.id === "lucky-cat";

  const installSteps = [
    "Download CharmDrop.",
    "Install it once.",
    "Open CharmDrop.",
    "Pick your charm.",
    "Keep CharmDrop running from the system tray."
  ];

  const appExamples = [
    "Browser",
    "VS Code",
    "Word",
    "Excel",
    "YouTube",
    "Desktop"
  ];

  return (
    <div className="download-page-container">
      {/* Page Hero */}
      <div className="page-hero-banner">
        <div className="section-container">
          <SectionTitle
            badge="Windows Desktop Edition"
            badgeIcon={Monitor}
            title="Your CharmDrop is"
            highlightText="almost ready."
            subtitle="Bring a little charm to your screen. Install once and keep your favorite talisman hanging across all your Windows apps."
            align="center"
          />
        </div>
      </div>

      <div className="section-container">
        {/* Main Download Grid */}
        <div className="download-hub-grid">
          {/* Left: Main Windows Installer Box */}
          <motion.div
            className="installer-primary-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="card-platform-strip">
              <Monitor size={18} />
              <span>Windows 10 & 11 (64-bit)</span>
            </div>

            <div className="installer-card-body">
              {/* Selected Charm Live Hanging Preview */}
              <div className="installer-selected-preview-wrap">
                <HangingCharm
                  iconKey={activeCharm.iconKey}
                  image={activeCharm.image}
                  size={100}
                  stringLength={80}
                  interactive={true}
                  caption="Previewing selected charm"
                />
              </div>

              <div className="selected-charm-meta-row">
                <span className="selected-charm-name">{activeCharm.name}</span>
                {hasBellSound && (
                  <span className="charm-sound-tag">
                    <Volume2 size={13} />
                    <span>Interactive bell sound</span>
                  </span>
                )}
                {hasCatSound && (
                  <span className="charm-sound-tag">
                    <Volume2 size={13} />
                    <span>Interactive cat sound</span>
                  </span>
                )}
              </div>

              <h2 className="installer-title">Get CharmDrop for Windows</h2>
              <p className="installer-subtitle">
                Version {siteConfig.download.windows.version} • Free
              </p>

              <div className="installer-specs-tags">
                <span className="spec-pill">Windows 10 & 11</span>
                <span className="spec-pill">64-bit</span>
                <span className="spec-pill">Free</span>
              </div>

              {/* Main Download CTA */}
              <a
                href={siteConfig.download.windows.url}
                download={siteConfig.download.windows.filename}
                className="btn-download-installer-main"
                aria-label="Get CharmDrop for Windows"
              >
                <Download size={20} />
                <span>Get CharmDrop for Windows</span>
              </a>

              {/* Secondary Deep Link Action for users who already installed CharmDrop */}
              <div className="installed-app-deeplink-box">
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = `charmdrop://charm/${selectedCharmId}`;
                  }}
                  className="btn-open-deeplink-secondary"
                  aria-label={`Open ${activeCharm.name} in CharmDrop`}
                >
                  <Sparkles size={15} />
                  <span>Open this charm in CharmDrop</span>
                </button>
              </div>

              <p className="installer-small-note">
                Install once. Keep your charm with you across your Windows screen.
              </p>

              {/* How to Start / Installation Steps */}
              <div className="installation-guide-box">
                <div className="installation-guide-title">
                  <Layers size={16} className="text-accent" />
                  <span>How to start:</span>
                </div>
                <ol className="guide-steps-list">
                  {installSteps.map((step, idx) => (
                    <li key={idx} className="guide-step-item">
                      <span className="step-number-badge">{idx + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Windows Security Notice for unsigned build */}
              <div className="security-notice-banner">
                <ShieldAlert size={16} className="text-amber-600 flex-shrink-0" style={{ marginTop: "1px" }} />
                <span>
                  Windows may display a standard security confirmation when installing. CharmDrop is clean, standalone, and ad-free.
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right: Instagram / Mobile Handoff & Always Available Info */}
          <div className="download-sidebar-column">
            {/* Mobile / Instagram Handoff Card */}
            <motion.div
              className="mobile-handoff-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="handoff-card-header">
                <div className="handoff-icon-wrap">
                  <Smartphone size={20} />
                  <ArrowRight size={16} />
                  <Laptop size={20} />
                </div>
                <h3>Browsing from Instagram or Mobile?</h3>
              </div>

              <p className="handoff-text">
                Love this charm? Open CharmDrop on your Windows laptop to bring it to your screen.
              </p>

              <div className="handoff-actions-list">
                <button onClick={handleCopyLink} className="btn-copy-url-big">
                  {copiedLink ? (
                    <>
                      <Check size={18} className="text-emerald-500" />
                      <span>Link Copied! Paste on your Windows laptop</span>
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      <span>Copy Website Link</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://wa.me/?text=Check%20out%20CharmDrop%20for%20Windows%20PC%3A%20${encodeURIComponent(window.location.origin + "/download")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-share-whatsapp"
                >
                  <span>Send Link to WhatsApp / Self</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </motion.div>

            {/* Always Available Across Your Windows Apps Card */}
            <motion.div
              className="always-available-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="avail-card-header">
                <Sparkles size={18} className="text-indigo-600" />
                <h4>Always Available on Screen</h4>
              </div>
              <p className="avail-card-text">
                CharmDrop can stay on top while you browse, work or create.
              </p>

              <div className="app-pills-wrap">
                {appExamples.map((app) => (
                  <span key={app} className="app-example-pill">
                    {app}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Start With Windows Card */}
            <motion.div
              className="startup-info-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <div className="avail-card-header">
                <Power size={18} className="text-emerald-600" />
                <h4>Start with Windows</h4>
              </div>
              <p className="avail-card-text">
                Want your charm back automatically when you start your laptop? Turn on <strong>Launch at Startup</strong> from CharmDrop settings.
              </p>
            </motion.div>

            {/* Switch Charm Link */}
            <div className="switch-charm-link-box">
              <Link to="/charms" className="btn-switch-charm-link">
                <LayoutGrid size={16} />
                <span>Choose a different charm from the gallery</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Small Browser-Only Option Note */}
        <div className="browser-option-footer-note">
          <Info size={16} className="text-slate-400 flex-shrink-0" />
          <span>
            <strong>Browser-only option:</strong> An optional browser overlay extension is also maintained for web-only usage.
          </span>
        </div>
      </div>
    </div>
  );
}

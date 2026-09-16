import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Monitor, 
  Sparkles, 
  Check, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Activity, 
  Power, 
  RefreshCw, 
  ExternalLink,
  Info,
  Clock
} from "lucide-react";
import { SectionTitle } from "../common/SectionTitle";
import { CharmVector } from "../common/CharmVector";
import { getCharmById } from "../../data/charmsData";

export function WindowsPreviewSection() {
  const charmOptions = [
    getCharmById("evil-eye"),
    getCharmById("nimbu-mirchi"),
    getCharmById("lucky-bell"),
    getCharmById("four-leaf-clover"),
    getCharmById("guardian-face"),
    getCharmById("lucky-cat"),
    getCharmById("daruma")
  ];

  const [activeCharm, setActiveCharm] = useState(charmOptions[0]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [physicsEnabled, setPhysicsEnabled] = useState(true);
  const [startupEnabled, setStartupEnabled] = useState(true);
  const [showSubMenu, setShowSubMenu] = useState(false);

  return (
    <section className="windows-preview-section">
      <div className="section-container">
        <SectionTitle
          badge="Native Windows Experience"
          badgeIcon={Monitor}
          title="Rests quietly in your tray."
          highlightText="Zero clutter."
          subtitle="CharmDrop doesn't clutter your taskbar. A lightweight native Windows tray icon gives you instant controls to switch charms, toggle physics, or grab daily drops."
          align="center"
        />

        <div className="windows-preview-layout">
          {/* Windows 11 Desktop Taskbar Simulation */}
          <div className="windows-desktop-frame">
            {/* Top Windows Wallpaper Canvas */}
            <div className="mockup-desktop-screen">
              {/* Simulated Hanging Charm on Screen */}
              <div className="screen-active-charm-display">
                <div className="screen-anchor-bead" />
                <div className="screen-cord-line" />
                <motion.div
                  className="screen-charm-body"
                  animate={{
                    rotate: physicsEnabled ? [-4, 4, -4] : 0
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3.2,
                    ease: "easeInOut"
                  }}
                >
                  <CharmVector 
                    iconKey={activeCharm.iconKey} 
                    image={activeCharm.image} 
                    size={88} 
                  />
                </motion.div>
                <div className="screen-charm-nameplate">
                  Active: {activeCharm.name}
                </div>
              </div>

              {/* Windows System Tray Context Menu (Interactive!) */}
              <motion.div 
                className="windows-tray-menu-card"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                {/* Menu Header */}
                <div className="tray-menu-header">
                  <div className="tray-brand-title">
                    <Sparkles size={14} className="text-indigo-400" />
                    <span>CharmDrop ✨</span>
                  </div>
                  <span className="tray-version-tag">v1.0-win</span>
                </div>

                {/* Current Active Charm Display with submenu hover */}
                <div 
                  className="tray-menu-item item-current-charm"
                  onClick={() => setShowSubMenu(!showSubMenu)}
                >
                  <div className="item-left">
                    <span className="item-label">Current Charm</span>
                    <span className="item-charm-value">
                      <img 
                        src={activeCharm.image} 
                        alt={activeCharm.name} 
                        style={{ width: "18px", height: "18px", objectFit: "contain" }} 
                      />
                      {activeCharm.name}
                    </span>
                  </div>
                  <ChevronRight size={14} className="item-chevron" />
                </div>

                {/* Dropdown Charm Quick Picker */}
                {showSubMenu && (
                  <motion.div 
                    className="tray-sub-picker"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    {charmOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setActiveCharm(opt);
                          setShowSubMenu(false);
                        }}
                        className={`sub-picker-item ${activeCharm.id === opt.id ? "active" : ""}`}
                      >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                          <img 
                            src={opt.image} 
                            alt={opt.name} 
                            style={{ width: "16px", height: "16px", objectFit: "contain" }} 
                          />
                          {opt.name}
                        </span>
                        {activeCharm.id === opt.id && <Check size={13} />}
                      </button>
                    ))}
                  </motion.div>
                )}

                <div className="tray-divider" />

                {/* Toggle Items */}
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="tray-menu-item clickable-toggle"
                >
                  <div className="item-left">
                    {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                    <span>Chime Sound Effects</span>
                  </div>
                  <div className={`tray-checkbox ${soundEnabled ? "checked" : ""}`}>
                    {soundEnabled && <Check size={12} />}
                  </div>
                </button>

                <button
                  onClick={() => setPhysicsEnabled(!physicsEnabled)}
                  className="tray-menu-item clickable-toggle"
                >
                  <div className="item-left">
                    <Activity size={15} />
                    <span>144Hz Physics Engine</span>
                  </div>
                  <div className={`tray-checkbox ${physicsEnabled ? "checked" : ""}`}>
                    {physicsEnabled && <Check size={12} />}
                  </div>
                </button>

                <button
                  onClick={() => setStartupEnabled(!startupEnabled)}
                  className="tray-menu-item clickable-toggle"
                >
                  <div className="item-left">
                    <Power size={15} />
                    <span>Launch at Windows Startup</span>
                  </div>
                  <div className={`tray-checkbox ${startupEnabled ? "checked" : ""}`}>
                    {startupEnabled && <Check size={12} />}
                  </div>
                </button>

                <div className="tray-divider" />

                {/* Utility Items */}
                <div className="tray-menu-item non-interactive">
                  <div className="item-left">
                    <RefreshCw size={14} />
                    <span>Check for New Charms</span>
                  </div>
                  <span className="tray-pill-mini">Up to date</span>
                </div>

                <div className="tray-menu-item item-exit">
                  <span>Quit CharmDrop</span>
                </div>
              </motion.div>
            </div>

            {/* Windows 11 Taskbar at Bottom */}
            <div className="windows-taskbar-bar">
              {/* Windows 11 Center Start & App Icons */}
              <div className="taskbar-center-icons">
                <div className="win-start-icon" title="Start">
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="#0284C7">
                    <rect x="1" y="1" width="6.5" height="6.5" rx="0.5" />
                    <rect x="8.5" y="1" width="6.5" height="6.5" rx="0.5" />
                    <rect x="1" y="8.5" width="6.5" height="6.5" rx="0.5" />
                    <rect x="8.5" y="8.5" width="6.5" height="6.5" rx="0.5" />
                  </svg>
                </div>
                <div className="taskbar-app-icon icon-search" />
                <div className="taskbar-app-icon icon-edge" />
                <div className="taskbar-app-icon icon-explorer" />
              </div>

              {/* Windows 11 System Tray on Right */}
              <div className="taskbar-system-tray">
                <div className="tray-icon-charmdrop active" title="CharmDrop (Active)">
                  <CharmVector iconKey="evil-eye" size={16} glow={false} />
                </div>
                <div className="tray-mini-status">
                  <Clock size={12} />
                  <span>7:42 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Detail Callouts */}
          <div className="preview-details-column">
            <div className="preview-spec-card">
              <div className="spec-card-icon">
                <Power size={20} />
              </div>
              <div>
                <h4>Zero Taskbar Footprint</h4>
                <p>Runs quietly in the notification tray so your taskbar remains clean and distraction-free.</p>
              </div>
            </div>

            <div className="preview-spec-card">
              <div className="spec-card-icon">
                <RefreshCw size={20} />
              </div>
              <div>
                <h4>Instant Charm Swapping</h4>
                <p>Swap between the Lucky Cat, Twin-Scroll Turbo, or Pixel Sword in two clicks right from your tray.</p>
              </div>
            </div>

            <div className="preview-spec-card">
              <div className="spec-card-icon">
                <Info size={20} />
              </div>
              <div>
                <h4>Seamless Electron / Native Architecture</h4>
                <p>Built to interface with lightweight Windows transparent rendering with low memory impact.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

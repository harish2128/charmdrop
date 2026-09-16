import React from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  RotateCcw, 
  Move, 
  Pin, 
  Layers, 
  Power, 
  Sliders, 
  Volume2, 
  DownloadCloud, 
  Smile, 
  Monitor, 
  RefreshCw, 
  Gift,
  Zap
} from "lucide-react";
import { SectionTitle } from "../common/SectionTitle";

export function FeaturesSection() {
  const featuresList = [
    {
      icon: Sparkles,
      title: "Interactive Hanging Charms",
      desc: "Anchored to top screen bezel with natural pendulum physics that react to cursor movement.",
      tag: "Physics"
    },
    {
      icon: RotateCcw,
      title: "Realistic Swing Simulation",
      desc: "Mathematical inertial decay and spring damping calculated in real-time.",
      tag: "144Hz"
    },
    {
      icon: Move,
      title: "Drag & Pin Anywhere",
      desc: "Grab and pull the charm across your screen, let it recoil or anchor to any monitor corner.",
      tag: "Tactile"
    },
    {
      icon: Pin,
      title: "Always on Top Overlay",
      desc: "Lightweight transparent window layer that floats seamlessly over games, IDEs and browsers.",
      tag: "Overlay"
    },
    {
      icon: Power,
      title: "Windows Startup Support",
      desc: "Optional silent startup with Windows. Greets you with your chosen talisman on boot.",
      tag: "Native"
    },
    {
      icon: Sliders,
      title: "System Tray Controls",
      desc: "Right-click the system tray icon to switch charms, change swing tension, or mute sound effects.",
      tag: "Quick Access"
    },
    {
      icon: RefreshCw,
      title: "Daily Charm Refresh",
      desc: "Signature Nimbu Mirchi mechanic with automatic daily aging and one-click morning hanging.",
      tag: "Signature"
    },
    {
      icon: DownloadCloud,
      title: "In-App Charm Updates",
      desc: "New drops arrive directly into your collection without needing to reinstall the application.",
      tag: "Cloud Drops"
    },
    {
      icon: Smile,
      title: "Custom Emojis",
      desc: "Hang any favorite Unicode emoji or custom transparent PNG sticker from your screen.",
      tag: "Coming Soon",
      isComingSoon: true
    },
    {
      icon: Monitor,
      title: "Multi-Monitor Support",
      desc: "Hang distinct charms on your primary ultrawide and secondary vertical coding monitor.",
      tag: "Coming Soon",
      isComingSoon: true
    },
    {
      icon: Volume2,
      title: "Subtle Chime Audio",
      desc: "Delicate windchime and mechanical click sounds on release with instant mute toggle.",
      tag: "Audio"
    },
    {
      icon: Gift,
      title: "Free Charm Packs",
      desc: "All initial packs — Lucky, Racing, Gaming, Heroes, Sports, and Emoji — are ₹0 free.",
      tag: "100% Free"
    }
  ];

  return (
    <section className="features-section" id="features">
      <div className="section-container">
        <SectionTitle
          badge="Engineered for Windows"
          badgeIcon={Zap}
          title="Designed for performance."
          highlightText="Zero desktop clutter."
          subtitle="CharmDrop uses native hardware acceleration to deliver buttery 144Hz physics without eating up your GPU or slowing down gaming framerates."
          align="center"
        />

        <div className="features-grid-layout">
          {featuresList.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                className={`feature-card-item ${feat.isComingSoon ? "coming-soon-card" : ""}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (idx % 4) * 0.08 }}
              >
                <div className="feature-card-header">
                  <div className="feature-icon-wrapper">
                    <Icon size={20} />
                  </div>
                  <span className={`feature-pill-tag ${feat.isComingSoon ? "tag-soon" : ""}`}>
                    {feat.tag}
                  </span>
                </div>

                <h3 className="feature-card-title">{feat.title}</h3>
                <p className="feature-card-desc">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Download, 
  Monitor, 
  Sparkles, 
  RotateCcw, 
  Move, 
  Layers, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Sliders,
  ArrowRight,
  Laptop
} from "lucide-react";
import { SectionTitle } from "../components/common/SectionTitle";
import { HangingCharm } from "../components/common/HangingCharm";
import { siteConfig } from "../config/siteConfig";

export function HowItWorks({ onOpenDownloadModal }) {
  const steps = [
    {
      num: "01",
      title: "Download the Windows Installer",
      desc: "Grab the lightweight 64-bit installer built specifically for Windows 10 and Windows 11. It takes less than 15 seconds to download.",
      details: ["Under 15MB file size", "No admin privileges required", "Clean digital signature"]
    },
    {
      num: "02",
      title: "Silent Tray Placement",
      desc: "CharmDrop runs silently in the background and places a discreet system tray icon in the bottom-right corner of your taskbar.",
      details: ["Zero taskbar clutter", "Uses under 25MB RAM", "Optional launch on Windows boot"]
    },
    {
      num: "03",
      title: "Pick & Position Your Charm",
      desc: "Choose from authentic Lucky Talismans like Nimbu Mirchi, Fortune Bell, Lucky Cat, Daruma, or Evil Eye. Click and drag the charm to your ideal screen location.",
      details: ["Anchor to top screen bezel", "Supports ultrawide & 4K displays", "Smooth natural physics recoil"]
    },
    {
      num: "04",
      title: "Enjoy the Daily Ritual",
      desc: "Watch your charm swing naturally as you switch between apps, code, or game. If you choose Nimbu Mirchi, replace it each morning for good fortune.",
      details: ["Always on top overlay", "Interactive chime and meow audio", "Daily 24-hour refresh cycle"]
    }
  ];

  return (
    <div className="how-it-works-page">
      {/* Page Hero */}
      <div className="page-hero-banner">
        <div className="section-container">
          <SectionTitle
            badge="Architecture & Guide"
            badgeIcon={Monitor}
            title="How CharmDrop"
            highlightText="works on Windows."
            subtitle="Everything you need to know about installing, customizing, and enjoying interactive hanging charms on Windows 10 & 11."
            align="center"
          />
        </div>
      </div>

      <div className="section-container">
        {/* Interactive Physics Deep Dive */}
        <div className="hiw-feature-split">
          <div className="split-text-col">
            <div className="split-badge">
              <RotateCcw size={15} />
              <span>Physics Engine</span>
            </div>
            <h2>True Pendulum Motion</h2>
            <p>
              CharmDrop doesn't play a repeating pre-rendered video. Instead, each charm's movement is calculated via a real-time pendulum physics simulation with angular inertia and spring dampening.
            </p>
            <ul className="split-perks-list">
              <li><CheckCircle2 size={16} className="text-emerald-500" /> Reacts dynamically to cursor flick velocity</li>
              <li><CheckCircle2 size={16} className="text-emerald-500" /> Decays smoothly back to natural vertical rest</li>
              <li><CheckCircle2 size={16} className="text-emerald-500" /> Renders smoothly with low CPU/GPU overhead</li>
            </ul>
          </div>

          <div className="split-visual-col">
            <div className="physics-demo-box">
              <HangingCharm
                iconKey="nimbu-mirchi"
                size={100}
                stringLength={120}
                interactive={true}
                caption="Drag and release to test the recoil"
              />
            </div>
          </div>
        </div>

        {/* Detailed 4-Step Breakdown */}
        <div className="hiw-steps-section">
          <SectionTitle
            badge="Step-by-Step Setup"
            title="Up and running"
            highlightText="in four steps."
            align="center"
          />

          <div className="detailed-steps-grid">
            {steps.map((step, idx) => (
              <motion.div
                key={step.num}
                className="detailed-step-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="step-num-circle">{step.num}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>

                <div className="step-perks-box">
                  {step.details.map((detail, i) => (
                    <div key={i} className="step-perk-line">
                      <CheckCircle2 size={13} className="text-indigo-500" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* System Specs Card */}
        <div className="hiw-specs-card">
          <div className="specs-card-header">
            <Monitor size={22} className="text-indigo-600" />
            <div>
              <h3>System Requirements</h3>
              <p>CharmDrop is ultra-lightweight and engineered for all modern Windows machines.</p>
            </div>
          </div>

          <div className="specs-table-grid">
            <div className="spec-table-cell">
              <span className="spec-head">Operating System</span>
              <span className="spec-val">Windows 10 (64-bit) / Windows 11</span>
            </div>
            <div className="spec-table-cell">
              <span className="spec-head">RAM Usage</span>
              <span className="spec-val">~25MB - 35MB</span>
            </div>
            <div className="spec-table-cell">
              <span className="spec-head">CPU Utilization</span>
              <span className="spec-val">&lt; 0.5% idle (hardware accelerated)</span>
            </div>
            <div className="spec-table-cell">
              <span className="spec-head">Display Support</span>
              <span className="spec-val">1080p, 1440p, 4K, Ultrawide (60Hz - 240Hz)</span>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="hiw-cta-bottom">
          <Link to="/download" className="btn-primary-lead">
            <Download size={18} />
            <span>Download CharmDrop for Windows</span>
          </Link>
          <Link to="/charms" className="btn-secondary-link">
            <span>Explore Complete Charm Catalog</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Heart, 
  Monitor, 
  ShieldCheck, 
  Zap, 
  Palette, 
  Smile, 
  RefreshCw,
  Award,
  ArrowRight
} from "lucide-react";
import { SectionTitle } from "../components/common/SectionTitle";
import { HangingCharm } from "../components/common/HangingCharm";
import { siteConfig } from "../config/siteConfig";

export function About({ onOpenDownloadModal }) {
  const pillars = [
    {
      icon: Heart,
      title: "Playful Intention",
      desc: "Computers have become utilitarian and sterile. CharmDrop brings back warmth, fun, and tactile micro-moments to your everyday workflow."
    },
    {
      icon: ShieldCheck,
      title: "Zero Bloatware",
      desc: "No background telemetries, no cryptocurrency miners, no sneaky adware. CharmDrop runs purely locally on your Windows PC."
    },
    {
      icon: Zap,
      title: "144Hz Native Performance",
      desc: "Built with hardware accelerated transparency so you can keep charms swinging even while rendering 3D graphics or playing competitive games."
    },
    {
      icon: RefreshCw,
      title: "Living Daily Rituals",
      desc: "Features like Daily Nimbu Mirchi transform passive wallpaper into an enjoyable, intentional 24-hour routine."
    }
  ];

  const roadmapItems = [
    { status: "Live", title: "Windows 10 & 11 Core App", desc: "Native tray client with full authentic charm catalog." },
    { status: "In Progress", title: "Custom Emoji & Sticker Uploader", desc: "Hang any favorite custom transparent PNG or Unicode emoji." },
    { status: "Planned", title: "Multi-Monitor Spatial Anchoring", desc: "Hang independent charms across dual and triple display battlestations." },
    { status: "Planned", title: "Community Artist Drop Portal", desc: "Empowering indie digital artists to release exclusive charm designs." }
  ];

  return (
    <div className="about-page-container">
      {/* Page Hero */}
      <div className="page-hero-banner">
        <div className="section-container">
          <SectionTitle
            badge="Our Story & Philosophy"
            badgeIcon={Sparkles}
            title="A little charm"
            highlightText="for your screen."
            subtitle="We believe the digital workspace should feel alive, personal, and a little lucky."
            align="center"
          />
        </div>
      </div>

      <div className="section-container">
        {/* Story Split Section */}
        <div className="about-story-split">
          <div className="story-text-col">
            <h2 className="story-title">Why we created CharmDrop</h2>
            <p className="story-para">
              Remember when desktop computers had personality? Before every app became a flat grey rectangular window, screens had character.
            </p>
            <p className="story-para">
              We asked ourselves: <em>What if your screen had something living and hanging over your work?</em> A talisman to ward off bugs, a twin-scroll turbo for late-night grind sessions, or a fresh Nimbu Mirchi every single morning.
            </p>
            <p className="story-para">
              That's <strong>CharmDrop</strong> — a lightweight, free Windows desktop charm platform where you can let physical momentum and personality hang freely.
            </p>
          </div>

          <div className="story-visual-col">
            <div className="story-charm-frame">
              <HangingCharm
                iconKey="lucky-cat"
                size={110}
                stringLength={110}
                interactive={true}
                caption="Maneki Neko bringing good luck"
              />
            </div>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="about-pillars-section">
          <SectionTitle
            badge="Our Core Pillars"
            badgeIcon={Award}
            title="Crafted with care."
            align="center"
          />

          <div className="pillars-grid">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div key={i} className="pillar-card">
                  <div className="pillar-icon-box">
                    <Icon size={22} />
                  </div>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Roadmap */}
        <div className="about-roadmap-section">
          <SectionTitle
            badge="Looking Forward"
            title="The CharmDrop Roadmap"
            subtitle="Here's what we're building next for the Windows desktop ecosystem."
            align="center"
          />

          <div className="roadmap-timeline">
            {roadmapItems.map((item, idx) => (
              <div key={idx} className="roadmap-row">
                <div className={`roadmap-status-pill ${item.status.toLowerCase().replace(" ", "-")}`}>
                  {item.status}
                </div>
                <div className="roadmap-content">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="about-cta-bar">
          <h3>Ready to charm your desktop?</h3>
          <p>Bring motion, personality, and luck to your Windows desktop today.</p>
          <Link to="/download" className="btn-about-download">
            <span>Download for Windows (Free)</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

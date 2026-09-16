import React from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Shield, Download, Heart, ArrowRight } from "lucide-react";
import { SectionTitle } from "../common/SectionTitle";
import { siteConfig } from "../../config/siteConfig";

export function FreeSection({ onOpenDownloadModal }) {
  const freePerks = [
    "Full interactive desktop charms engine",
    "Lucky & Talisman collection (Evil eye, clover, lucky cat)",
    "High-octane Racing collection (Turbo, JDM, apex aero)",
    "Retro & Cyber Gaming collection (8-bit sword, gamepad)",
    "Original Hero-Inspired collection (Armored Core, Vigilante)",
    "Signature Daily Nimbu Mirchi 24h refresh cycle",
    "Continuous cloud charm drop updates",
    "Native support for Windows 10 & Windows 11 (64-bit)"
  ];

  return (
    <section className="free-pricing-section">
      <div className="section-container">
        <SectionTitle
          badge="Pure & Simple"
          badgeIcon={Sparkles}
          title="Free means"
          highlightText="free."
          subtitle="No paywalls. No recurring subscriptions. No hidden credit card requirements. Just great design and personality for your screen."
          align="center"
        />

        <div className="free-card-wrapper">
          <motion.div
            className="free-plan-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Card Ribbon */}
            <div className="plan-badge-ribbon">
              <Sparkles size={14} />
              <span>CORE EXPERIENCE</span>
            </div>

            <div className="plan-header-layout">
              <div>
                <h3 className="plan-tier-name">CharmDrop Community Edition</h3>
                <p className="plan-tier-desc">Everything you need to hang, swing, and personalize your screen.</p>
              </div>

              <div className="plan-price-block">
                <div className="price-amount-row">
                  <span className="price-symbol">₹</span>
                  <span className="price-number">0</span>
                </div>
                <span className="price-sub-term">Forever Free</span>
              </div>
            </div>

            <div className="plan-divider-line" />

            {/* Included Features List */}
            <div className="plan-features-grid">
              {freePerks.map((perk, i) => (
                <div key={i} className="plan-perk-item">
                  <div className="perk-check-circle">
                    <Check size={14} />
                  </div>
                  <span className="perk-label-text">{perk}</span>
                </div>
              ))}
            </div>

            <div className="plan-action-bar">
              <a
                href={siteConfig.download.windows.url}
                download={siteConfig.download.windows.filename}
                className="btn-download-free-tier"
              >
                <Download size={18} />
                <span>Download Free for Windows</span>
                <ArrowRight size={16} />
              </a>
              <div className="no-card-guarantee">
                <Shield size={15} className="text-emerald-500" />
                <span>No credit card. No subscription. 100% Free.</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

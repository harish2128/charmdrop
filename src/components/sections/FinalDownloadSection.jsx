import React from "react";
import { motion } from "framer-motion";
import { Download, Monitor, Sparkles, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { HangingCharm } from "../common/HangingCharm";
import { siteConfig } from "../../config/siteConfig";

export function FinalDownloadSection({ onOpenDownloadModal }) {
  return (
    <section className="final-download-cta-section" id="download">
      <div className="section-container">
        <motion.div
          className="final-cta-card"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Top Hanging Charm in CTA */}
          <div className="cta-top-hanging-charm">
            <HangingCharm
              iconKey="evil-eye"
              size={90}
              stringLength={100}
              interactive={true}
              caption=""
            />
          </div>

          <div className="cta-text-content">
            <div className="cta-badge-pill">
              <Sparkles size={14} />
              <span>Free for Windows 10 & 11</span>
            </div>

            <h2 className="cta-headline">
              Your desktop is <br />
              <span className="gradient-text-accent">missing something.</span>
            </h2>

            <p className="cta-subheading">
              Give it a little movement, personality, and charm. Download CharmDrop and bring your screen to life in seconds.
            </p>

            <div className="cta-button-group">
              <a
                href={siteConfig.download.windows.url}
                download={siteConfig.download.windows.filename}
                className="btn-cta-download"
                aria-label="Download CharmDrop for Windows"
              >
                <Download size={20} />
                <span>Download for Windows</span>
                <ArrowRight size={18} />
              </a>
            </div>

            {/* Sub-label indicators */}
            <div className="cta-meta-notes">
              <div className="meta-note-item">
                <Monitor size={14} />
                <span>Windows 10 & Windows 11 (64-bit)</span>
              </div>
              <span className="meta-dot">•</span>
              <div className="meta-note-item">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Completely Free</span>
              </div>
              <span className="meta-dot">•</span>
              <div className="meta-note-item">
                <Zap size={14} className="text-amber-400" />
                <span>Lightweight & Fast</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  DownloadCloud, 
  Check, 
  Bell, 
  ArrowRight, 
  Plus,
  RefreshCw,
  Layers
} from "lucide-react";
import { SectionTitle } from "../common/SectionTitle";
import { CharmVector } from "../common/CharmVector";
import { getCharmById } from "../../data/charmsData";

export function NewCharmUpdateSection({ onOpenDownloadModal }) {
  const [hasAdded, setHasAdded] = useState(false);
  const luckyCatCharm = getCharmById("lucky-cat");

  return (
    <section className="new-charm-update-section">
      <div className="section-container">
        <SectionTitle
          badge="Seamless Cloud Drops"
          badgeIcon={DownloadCloud}
          title="Your collection"
          highlightText="keeps growing."
          subtitle="You will never need to reinstall CharmDrop when new charms drop. Discover seasonal updates, collaboration charms, and community favorites delivered directly over the air."
          align="center"
        />

        <div className="update-flow-container">
          {/* Flow Visualization Steps */}
          <div className="cloud-drop-steps-row">
            <div className="drop-step-pill">
              <span className="step-tag">01</span>
              <span>CharmDrop Active</span>
            </div>
            <div className="drop-step-arrow">→</div>
            <div className="drop-step-pill">
              <span className="step-tag">02</span>
              <span>New Drop Released</span>
            </div>
            <div className="drop-step-arrow">→</div>
            <div className="drop-step-pill highlight">
              <span className="step-tag">03</span>
              <span>1-Click Add to Tray</span>
            </div>
          </div>

          {/* Interactive In-App Notification Mockup Card */}
          <motion.div
            className="inapp-drop-notification-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="notification-ribbon">
              <Sparkles size={14} />
              <span>NEW CHARM DROP DETECTED</span>
            </div>

            <div className="notification-content-layout">
              {/* Charm Art Preview */}
              <div className="notification-charm-preview">
                <motion.div
                  animate={{ rotate: [-5, 5, -5] }}
                  transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
                >
                  <CharmVector 
                    iconKey="lucky-cat" 
                    image={luckyCatCharm?.image} 
                    size={90} 
                  />
                </motion.div>
                <div className="charm-drop-name">Maneki Neko (Lucky Cat)</div>
              </div>

              {/* Notification Copy & Action */}
              <div className="notification-copy-col">
                <div className="notification-header-row">
                  <div className="bell-badge">
                    <Bell size={16} />
                  </div>
                  <div>
                    <h4 className="notif-title">A new charm has arrived!</h4>
                    <p className="notif-sub">Added to the Lucky Talisman family</p>
                  </div>
                </div>

                <p className="notif-description">
                  The Golden Maneki Neko beckons good fortune, high frame rates, and bug-free code right from your Windows desktop.
                </p>

                <div className="notif-action-row">
                  {!hasAdded ? (
                    <button
                      onClick={() => setHasAdded(true)}
                      className="btn-add-collection"
                    >
                      <Plus size={16} />
                      <span>Add to Collection</span>
                    </button>
                  ) : (
                    <motion.div
                      className="btn-added-state"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <Check size={18} className="text-emerald-400" />
                      <span>Added to your Windows Tray!</span>
                    </motion.div>
                  )}

                  <button
                    onClick={() => setHasAdded(false)}
                    className="btn-reset-demo"
                    title="Reset demo"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

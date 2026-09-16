import React from "react";
import { motion } from "framer-motion";
import { Users, Quote } from "lucide-react";
import { SectionTitle } from "../common/SectionTitle";
import { CharmVector } from "../common/CharmVector";
import { communitySetups, getCharmById } from "../../data/charmsData";

export function SocialProofSection() {
  return (
    <section className="social-proof-section">
      <div className="section-container">
        <SectionTitle
          badge="Community Battlestations"
          badgeIcon={Users}
          title="See how desks are"
          highlightText="hanging personality."
          subtitle="From mechanical keyboard streamers to midnight code sessions, here is how the CharmDrop community customizes their screen real estate."
          align="center"
        />

        <div className="community-setups-grid">
          {communitySetups.map((setup, idx) => {
            const charmObj = getCharmById(setup.iconKey) || getCharmById(setup.id);
            return (
              <motion.div
                key={setup.id}
                className="community-setup-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
              >
                <div className="setup-card-header">
                  <span className="setup-user-badge">{setup.userTag}</span>
                  <span className="setup-tag-pill">{setup.tag}</span>
                </div>

                {/* Setup Visual Showcase */}
                <div className="setup-display-screen">
                  <div className="setup-screen-top-bezel">
                    <div className="setup-anchor-dot" />
                    <div className="setup-string-line" />
                  </div>
                  
                  <div className="setup-charm-container">
                    <motion.div
                      animate={{ rotate: [-4, 4, -4] }}
                      transition={{ repeat: Infinity, duration: 3 + idx * 0.3, ease: "easeInOut" }}
                    >
                      <CharmVector 
                        iconKey={setup.iconKey} 
                        image={charmObj?.image} 
                        size={70} 
                      />
                    </motion.div>
                  </div>

                  <div className="setup-wallpaper-label">
                    <span>Theme: {setup.wallpaperStyle}</span>
                  </div>
                </div>

                <div className="setup-card-body">
                  <h4 className="setup-card-title">{setup.title}</h4>
                  <div className="setup-quote-row">
                    <Quote size={16} className="setup-quote-icon" />
                    <p className="setup-quote-text">{setup.quote}</p>
                  </div>

                  <div className="setup-active-charm-footer">
                    <span className="footer-label">Active Charm:</span>
                    <span className="footer-value">{setup.activeCharm}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

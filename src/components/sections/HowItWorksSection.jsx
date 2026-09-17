import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Heart, Download, Monitor } from "lucide-react";
import { SectionTitle } from "../common/SectionTitle";
import { howItWorksSteps } from "../../data/charmsData";

export function HowItWorksSection({ onOpenDownloadModal }) {
  const stepIcons = [Heart, Download, Monitor];

  return (
    <section className="how-it-works-section" id="how-it-works">
      <div className="section-container">
        <SectionTitle
          badge="Simple 3-Step Setup"
          badgeIcon={Sparkles}
          title="From download to desktop"
          highlightText="in three easy steps."
          subtitle="Works across your Windows desktop — not just inside your browser."
          align="center"
        />

        <div className="steps-cards-grid">
          {howItWorksSteps.map((stepItem, index) => {
            const Icon = stepIcons[index] || Sparkles;
            return (
              <motion.div
                key={stepItem.step}
                className="step-process-card"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
              >
                {/* Top Number & Badge */}
                <div className="step-card-top">
                  <span className="step-number-watermark">{stepItem.step}</span>
                  <span className="step-badge-pill">{stepItem.badge}</span>
                </div>

                {/* Step Icon */}
                <div className="step-icon-circle">
                  <Icon size={24} />
                </div>

                {/* Content */}
                <h3 className="step-card-title">{stepItem.title}</h3>
                <p className="step-card-desc">{stepItem.description}</p>

                {/* Connector line for desktop */}
                {index < howItWorksSteps.length - 1 && (
                  <div className="step-arrow-connector" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Small Supporting Text & Action Prompt */}
        <div className="steps-bottom-action">
          <p className="steps-support-text" style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
            Works across your Windows desktop — not just inside your browser.
          </p>
          <Link to="/download" className="btn-start-setup">
            <span>Get CharmDrop for Windows</span>
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}

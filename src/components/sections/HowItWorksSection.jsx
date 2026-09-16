import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, MonitorCheck, Palette, PlayCircle, Sparkles, ArrowRight } from "lucide-react";
import { SectionTitle } from "../common/SectionTitle";
import { howItWorksSteps } from "../../data/charmsData";

export function HowItWorksSection({ onOpenDownloadModal }) {
  const stepIcons = [Download, MonitorCheck, Palette, PlayCircle];

  return (
    <section className="how-it-works-section" id="how-it-works">
      <div className="section-container">
        <SectionTitle
          badge="Quick & Painless"
          badgeIcon={Sparkles}
          title="From download to desktop"
          highlightText="in under a minute."
          subtitle="No complex configuration or heavy dependencies. Install CharmDrop, pick your hanging vibe, and watch your screen come alive."
          align="center"
        />

        <div className="steps-cards-grid">
          {howItWorksSteps.map((stepItem, index) => {
            const Icon = stepIcons[index];
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

        {/* Action Prompt */}
        <div className="steps-bottom-action">
          <Link to="/download" className="btn-start-setup">
            <span>Ready? Get CharmDrop for Windows</span>
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}

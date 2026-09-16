import React from "react";
import { ShieldCheck, Lock } from "lucide-react";
import { SectionTitle } from "../components/common/SectionTitle";
import { siteConfig } from "../config/siteConfig";

export function Privacy() {
  return (
    <div className="legal-page-container">
      <div className="page-hero-banner">
        <div className="section-container">
          <SectionTitle
            badge="Privacy & Security"
            badgeIcon={ShieldCheck}
            title="Privacy Policy"
            highlightText="Zero Telemetry."
            subtitle={`Last updated: January 2026 • Effective for ${siteConfig.siteName}`}
            align="center"
          />
        </div>
      </div>

      <div className="section-container legal-content-wrapper">
        <div className="legal-card">
          <div className="legal-highlight-strip">
            <Lock size={20} className="text-emerald-500" />
            <p>
              <strong>Summary:</strong> CharmDrop is designed to run locally on your Windows machine. We do not track your mouse clicks, record your screen, or sell personal data.
            </p>
          </div>

          <section className="legal-section">
            <h3>1. What Information We Do (and Do Not) Collect</h3>
            <p>
              <strong>Local Operation:</strong> All hanging charms, physics simulations, and settings (such as sound on/off and launch on startup) are processed and stored locally on your Windows PC via local configuration files.
            </p>
            <p>
              <strong>Website Analytics:</strong> On our website ({siteConfig.siteName}), we may collect anonymous, aggregated traffic statistics to understand which charm categories are popular. We do not use intrusive cross-site tracking cookies.
            </p>
          </section>

          <section className="legal-section">
            <h3>2. Screen Privacy & Transparency</h3>
            <p>
              CharmDrop uses Windows native alpha-blended transparency APIs to draw hanging charms above your desktop. CharmDrop <strong>never captures, records, or streams</strong> any pixels of your active windows, browser contents, or personal files.
            </p>
          </section>

          <section className="legal-section">
            <h3>3. Email Subscriptions & Notifications</h3>
            <p>
              If you voluntarily enter your email to receive early access builds or notifications about new charm drops, we use your email solely for CharmDrop product updates. You can unsubscribe at any time with a single click.
            </p>
          </section>

          <section className="legal-section">
            <h3>4. Third-Party Services</h3>
            <p>
              Our website provides links to our Instagram profile ({siteConfig.instagramHandle}). Any interaction on external platforms is governed by their respective privacy policies.
            </p>
          </section>

          <section className="legal-section">
            <h3>5. Contact Us</h3>
            <p>
              If you have any questions regarding privacy or security in CharmDrop, please contact us at <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

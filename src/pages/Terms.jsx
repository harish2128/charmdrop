import React from "react";
import { FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { SectionTitle } from "../components/common/SectionTitle";
import { siteConfig } from "../config/siteConfig";

export function Terms() {
  return (
    <div className="legal-page-container">
      <div className="page-hero-banner">
        <div className="section-container">
          <SectionTitle
            badge="Terms & Conditions"
            badgeIcon={FileText}
            title="Terms of Service"
            highlightText="Fair & Simple."
            subtitle={`Last updated: January 2026 • CharmDrop Platform`}
            align="center"
          />
        </div>
      </div>

      <div className="section-container legal-content-wrapper">
        <div className="legal-card">
          <section className="legal-section">
            <h3>1. Agreement to Terms</h3>
            <p>
              By downloading, installing, or accessing CharmDrop (website and Windows desktop software), you agree to be bound by these Terms of Service. If you do not agree with these terms, please do not use the application.
            </p>
          </section>

          <section className="legal-section">
            <h3>2. Free License Grant</h3>
            <p>
              CharmDrop grants you a free, non-exclusive, non-transferable, revocable license to install and run the CharmDrop software on your personal Windows 10 & Windows 11 devices for personal and non-commercial desktop personalization.
            </p>
          </section>

          <section className="legal-section">
            <h3>3. Intellectual Property & Original Artworks</h3>
            <p>
              All original visual assets, brand trademarks, logos, animations, and vector illustrations available on CharmDrop are proprietary to CharmDrop or licensed partners.
            </p>
            <p>
              You agree not to decompile, reverse-engineer, redistribute, sell, or repackage CharmDrop assets into commercial standalone software without express written permission.
            </p>
          </section>

          <section className="legal-section">
            <h3>4. Disclaimer of Warranties</h3>
            <p>
              CharmDrop is provided on an "AS IS" and "AS AVAILABLE" basis. While we meticulously test on modern Windows configurations for maximum stability and minimum CPU usage, we make no warranties that the software will be uninterrupted or error-free on every hardware setup.
            </p>
          </section>

          <section className="legal-section">
            <h3>5. Termination</h3>
            <p>
              You may terminate this agreement at any time simply by uninstalling CharmDrop from your Windows PC using standard Windows Add or Remove Programs.
            </p>
          </section>

          <section className="legal-section">
            <h3>6. Inquiries</h3>
            <p>
              For legal, licensing, or press inquiries, contact <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  MessageSquare, 
  Sparkles,
  ExternalLink,
  Globe
} from "lucide-react";
import { Instagram } from "../components/common/InstagramIcon";
import { SectionTitle } from "../components/common/SectionTitle";
import { siteConfig } from "../config/siteConfig";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "Charm Request",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  const faqs = [
    {
      q: "Which Windows versions are supported?",
      a: "CharmDrop is fully compatible with 64-bit editions of Microsoft Windows 10 and Windows 11. It utilizes native Windows transparent window composition."
    },
    {
      q: "Will CharmDrop slow down my games or coding applications?",
      a: "No! CharmDrop utilizes hardware-accelerated GPU composition and consumes less than 0.5% CPU when idle and ~30MB of RAM. You can also pause physics anytime."
    },
    {
      q: "How does the Daily Nimbu Mirchi work?",
      a: "When active, your Nimbu Mirchi stays crisp and vibrant for 24 hours. After that, it visually fades. Clicking 'Hang New Nimbu Mirchi' from the tray or app resets it for the new day."
    },
    {
      q: "Can I request a custom charm?",
      a: "Yes! Use the contact form on this page with topic 'Charm Request' or tag us on Instagram reels with your ideas for racing cars, anime styles, or talismans."
    },
    {
      q: "Is CharmDrop really 100% free?",
      a: "Yes! The core application, the full charm catalog, daily refreshes, and upcoming drops are completely free with zero subscription fees."
    }
  ];

  return (
    <div className="contact-page-container">
      {/* Page Hero */}
      <div className="page-hero-banner">
        <div className="section-container">
          <SectionTitle
            badge="Get in Touch"
            badgeIcon={MessageSquare}
            title="Questions or requests?"
            highlightText="We'd love to hear."
            subtitle="Have an idea for a new charm drop, need help with Windows installation, or want to collaborate?"
            align="center"
          />
        </div>
      </div>

      <div className="section-container">
        <div className="contact-grid-split">
          {/* Left: Interactive Contact Form */}
          <div className="contact-form-card">
            <h3>Send us a message</h3>
            <p className="form-lead-text">Fill out the form below and we will get back to you within 24 hours.</p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="actual-contact-form">
                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Topic</label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="form-select"
                  >
                    <option value="Charm Request">🎨 Request a New Charm</option>
                    <option value="Windows Support">💻 Windows Installation Help</option>
                    <option value="Bug Report">🐛 Bug Report</option>
                    <option value="Collaboration">🤝 Creator / Collaboration</option>
                    <option value="Other">✨ Other Feedback</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what you'd like to see in CharmDrop..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-textarea"
                  />
                </div>

                <button type="submit" className="btn-submit-contact">
                  <Send size={16} />
                  <span>Send Message</span>
                </button>
              </form>
            ) : (
              <motion.div
                className="form-success-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="success-icon-wrap">
                  <CheckCircle2 size={32} className="text-emerald-500" />
                </div>
                <h4>Message Sent!</h4>
                <p>Thank you for reaching out, {formData.name}. We'll review your request and get in touch.</p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", topic: "Charm Request", message: "" });
                  }}
                  className="btn-send-another"
                >
                  Send another message
                </button>
              </motion.div>
            )}
          </div>

          {/* Right: Direct Channels & FAQ */}
          <div className="contact-info-col">
            <div className="direct-channels-box">
              <h4>Direct Channels</h4>

              <a
                href={siteConfig.companyWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="channel-link-item"
              >
                <div className="channel-icon-pill">
                  <Globe size={18} />
                </div>
                <div>
                  <strong>Company Website</strong>
                  <p>{siteConfig.companyName}</p>
                </div>
                <ExternalLink size={14} className="ml-auto text-slate-400" />
              </a>

              <a href={`mailto:${siteConfig.companyEmail}`} className="channel-link-item">
                <div className="channel-icon-pill">
                  <Mail size={18} />
                </div>
                <div>
                  <strong>Email Support</strong>
                  <p>{siteConfig.companyEmail}</p>
                </div>
              </a>

              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="channel-link-item"
              >
                <div className="channel-icon-pill instagram-icon-pill">
                  <Instagram size={18} />
                </div>
                <div>
                  <strong>Instagram Community</strong>
                  <p>{siteConfig.instagramHandle}</p>
                </div>
                <ExternalLink size={14} className="ml-auto text-slate-400" />
              </a>
            </div>

            {/* FAQ Accordion */}
            <div className="faq-accordion-block">
              <h4>Frequently Asked Questions</h4>
              <div className="faq-list">
                {faqs.map((faq, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div key={i} className={`faq-item ${isOpen ? "open" : ""}`}>
                      <button
                        onClick={() => setOpenFaq(isOpen ? -1 : i)}
                        className="faq-question-btn"
                        aria-expanded={isOpen}
                      >
                        <span>{faq.q}</span>
                        <ChevronDown size={16} className={`faq-chevron ${isOpen ? "rotate-180" : ""}`} />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            className="faq-answer-drawer"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <p>{faq.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

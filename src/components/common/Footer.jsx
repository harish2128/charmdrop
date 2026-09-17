import React from "react";
import { Link } from "react-router-dom";
import { Monitor, Heart, ArrowUpRight, Globe, Mail } from "lucide-react";
import { Instagram } from "./InstagramIcon";
import { Logo } from "./Logo";
import { siteConfig } from "../../config/siteConfig";
import nimbuMirchiImage from "../../assets/charms/lucky/nimbu-mirchi.png";

export function Footer() {
  return (
    <footer className="charmdrop-footer-section">
      <div className="footer-top-wave-divider" />
      
      <div className="footer-container">
        <div className="footer-grid-layout">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <Logo size="md" showText={true} showTagline={true} />
            <p className="footer-brand-description">
              The free interactive desktop charm platform for Windows 10 and 11.
              Hang authentic lucky talismans, fortune bells, and daily Nimbu Mirchi right from the top of your screen.
            </p>
            
            <div className="footer-os-badge">
              <div className="os-badge-dot" />
              <Monitor size={14} />
              <span>Native Windows 10 & 11 Application</span>
            </div>

            <div className="footer-social-links">
              <div className="footer-developer-credit">
                <span className="dev-credit-label">Developed by</span>
                <a
                  href={siteConfig.companyWebsiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dev-company-link"
                >
                  <strong>{siteConfig.companyName}</strong>
                  <ArrowUpRight size={13} />
                </a>
              </div>

              <div className="footer-company-links-list">
                <a
                  href={siteConfig.companyWebsiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-pill"
                  aria-label="Tetrionyx Technologies Website"
                >
                  <Globe size={14} />
                  <span>Website</span>
                  <ArrowUpRight size={12} />
                </a>

                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-pill"
                  aria-label="Tetrionyx Technologies Instagram"
                >
                  <Instagram size={14} />
                  <span>{siteConfig.instagramHandle}</span>
                  <ArrowUpRight size={12} />
                </a>

                <a
                  href={`mailto:${siteConfig.companyEmail}`}
                  className="footer-social-pill"
                  aria-label="Email Tetrionyx Technologies"
                >
                  <Mail size={14} />
                  <span>{siteConfig.companyEmail}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-nav-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/charms">Charm Collection</Link></li>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/about">About CharmDrop</Link></li>
              <li><Link to="/contact">Contact & FAQ</Link></li>
            </ul>
          </div>

          {/* Charms Categories */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Collection</h4>
            <ul className="footer-nav-list">
              <li><Link to="/charms?cat=Lucky">🧿 Lucky Talismans (13)</Link></li>
              <li><Link to="/charms">🍋 Daily Nimbu Mirchi</Link></li>
              <li><Link to="/charms">🔔 Fortune Brass Bell</Link></li>
              <li><Link to="/charms">🐱 Maneki Neko (Lucky Cat)</Link></li>
              <li><Link to="/charms">🧿 Greek Evil Eye</Link></li>
              <li><Link to="/charms">🪶 Sacred Dreamcatcher</Link></li>
            </ul>
          </div>

          {/* Download & Legal */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Platform</h4>
            <ul className="footer-nav-list">
              <li>
                <Link to="/download" className="footer-btn-link">
                  Download Installer (Free)
                </Link>
              </li>
              <li><Link to="/download">Windows System Specs</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>

            <div className="footer-nimbu-mini-badge">
              <img 
                src={nimbuMirchiImage} 
                alt="Daily Nimbu Mirchi" 
                style={{ 
                  height: "28px", 
                  width: "auto", 
                  objectFit: "contain"
                }} 
              />
              <div>
                <strong>Daily Nimbu Mirchi</strong>
                <p>Refreshes every 24 hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-left">
            <span>© {siteConfig.year} {siteConfig.siteName}. All rights reserved.</span>
            <span className="footer-dot-sep">•</span>
            <span className="footer-win-tag">Made for Windows 10 & 11</span>
          </div>
          <div className="footer-bottom-right">
            <span>Designed with</span>
            <Heart size={13} className="heart-icon-pink" />
            <span>for screen personality</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

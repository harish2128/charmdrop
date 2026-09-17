import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  Menu, 
  X, 
  Monitor, 
  Sparkles, 
  ChevronRight, 
  ExternalLink 
} from "lucide-react";
import { Instagram } from "./InstagramIcon";
import { Logo } from "./Logo";
import { siteConfig } from "../../config/siteConfig";

export function Navbar({ onOpenDownloadModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Charms", path: "/charms" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <>
      <header className={`charmdrop-navbar-header ${isScrolled ? "navbar-scrolled" : "navbar-top"}`}>
        <div className="navbar-container">
          {/* Brand Logo */}
          <div className="navbar-left">
            <Logo size="md" showText={true} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="navbar-center-links" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`nav-link-item ${isActive ? "active-link" : ""}`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="nav-active-indicator"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="navbar-right-actions">
            {/* Instagram Social link */}
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              title={`Follow ${siteConfig.instagramHandle} on Instagram`}
              aria-label={`Follow ${siteConfig.instagramHandle} on Instagram`}
            >
              <Instagram size={18} />
            </a>

            {/* Main Download for Windows CTA */}
            <Link
              to="/download"
              className="btn-download-nav"
              aria-label="Download CharmDrop for Windows"
            >
              <Monitor size={15} className="btn-icon-win" />
              <span>Download for Windows</span>
              <span className="btn-tag-free">Free</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              className="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              className="mobile-drawer-content"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="drawer-header">
                <Logo size="sm" showText={true} />
                <button 
                  className="drawer-close-btn"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="drawer-links-list">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`drawer-link-item ${location.pathname === link.path ? "active" : ""}`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight size={16} className="drawer-chevron" />
                  </Link>
                ))}
              </div>

              <div className="drawer-platform-badge">
                <Monitor size={16} />
                <span>Made for Windows 10 & 11</span>
              </div>

              <div className="drawer-bottom-cta">
                <Link
                  to="/download"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary-block"
                >
                  <Download size={18} />
                  <span>Download for Windows</span>
                </Link>

                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-block"
                >
                  <Instagram size={18} />
                  <span>Follow on Instagram</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

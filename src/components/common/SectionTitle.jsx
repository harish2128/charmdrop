import React from "react";
import { motion } from "framer-motion";

export function SectionTitle({
  badge,
  badgeIcon: BadgeIcon,
  title,
  highlightText,
  subtitle,
  align = "center", // "left", "center", "right"
  dark = false,
  className = ""
}) {
  const isLeft = align === "left";

  return (
    <motion.div 
      className={`section-header-block ${align} ${dark ? "dark-theme" : ""} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ textAlign: align, maxWidth: isLeft ? "680px" : "780px", margin: isLeft ? "0 0 2.5rem 0" : "0 auto 3rem auto" }}
    >
      {badge && (
        <div className={`section-badge-pill ${dark ? "dark" : ""}`} style={{ justifyContent: isLeft ? "flex-start" : "center" }}>
          {BadgeIcon && <BadgeIcon size={14} className="badge-pill-icon" />}
          <span>{badge}</span>
        </div>
      )}

      <h2 className="section-main-heading">
        {title}{" "}
        {highlightText && <span className="gradient-text-accent">{highlightText}</span>}
      </h2>

      {subtitle && (
        <p className="section-subtitle-description">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

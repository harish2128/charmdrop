import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Clock, Sparkles, Flame } from "lucide-react";
import { CharmVector } from "../common/CharmVector";
import { playCharmSound } from "../../utils/soundEffects";

export function CharmCard({
  charm,
  onPreviewClick,
  className = ""
}) {
  const [isHovered, setIsHovered] = useState(false);

  const {
    name,
    category,
    description,
    iconKey,
    color,
    accentColor,
    isNew,
    isDaily,
    isPopular,
    tag,
    swingSpeed = 3.0
  } = charm;

  const handleHoverStart = () => {
    setIsHovered(true);
    playCharmSound(charm);
  };

  return (
    <motion.div
      className={`charm-card-box ${className}`}
      onHoverStart={handleHoverStart}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      layout
    >
      {/* Top badges */}
      <div className="card-badge-row">
        <span className="card-cat-pill">{category}</span>
        
        {isDaily && (
          <span className="card-daily-pill" title="Refreshes every 24 hours">
            <Clock size={12} />
            <span>Daily</span>
          </span>
        )}
        {isNew && !isDaily && (
          <span className="card-new-pill">
            <Sparkles size={12} />
            <span>New Drop</span>
          </span>
        )}
        {isPopular && !isNew && !isDaily && (
          <span className="card-pop-pill">
            <Flame size={12} />
            <span>Trending</span>
          </span>
        )}
      </div>

      {/* Visual Canvas with Swinging Charm */}
      <div className="card-visual-stage">
        {/* Top String */}
        <div className="card-string-line" />

        {/* Charm Vector / Real Image with animated swing on hover or continuous gentle sway */}
        <motion.div
          className="card-vector-wrapper"
          style={{ transformOrigin: "top center" }}
          animate={{
            rotate: isHovered ? [-6, 6, -6] : [-2.5, 2.5, -2.5],
            scale: isHovered ? 1.05 : 1
          }}
          transition={{
            repeat: Infinity,
            duration: isHovered ? 2.0 : swingSpeed,
            ease: "easeInOut"
          }}
        >
          <CharmVector 
            iconKey={iconKey} 
            size={78} 
            image={charm.image} 
          />
        </motion.div>

        {/* Subtle hover gradient ring behind the charm */}
        <div 
          className="card-glow-backdrop" 
          style={{ 
            background: `radial-gradient(circle, ${accentColor || color}25 0%, transparent 70%)` 
          }} 
        />
      </div>

      {/* Card Info */}
      <div className="card-body-content">
        <div className="card-title-row">
          <h3 className="card-charm-name">{name}</h3>
          {tag && <span className="card-tag-sub">{tag}</span>}
        </div>

        <p className="card-charm-desc">{description}</p>

        {/* Action Button */}
        <div className="card-action-footer">
          <button
            onClick={() => onPreviewClick(charm)}
            className="btn-card-preview"
            aria-label={`Preview ${name}`}
          >
            <Eye size={16} />
            <span>Preview Charm</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

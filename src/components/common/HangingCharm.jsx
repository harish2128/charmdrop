import React, { useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { CharmVector } from "./CharmVector";
import { Sparkles } from "lucide-react";
import { playCharmSound } from "../../utils/soundEffects";

export function HangingCharm({
  iconKey = "evil-eye",
  size = 90,
  stringLength = 140,
  showString = true,
  interactive = true,
  isFaded = false,
  showBadge = false,
  badgeText = "Interactive Charm",
  caption = "Grab it. Move it. Let it swing.",
  className = "",
  image = null
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const isNimbu = iconKey === "nimbu-mirchi";

  // Drag physics tracking
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // Smooth spring physics for natural recoil
  const springX = useSpring(dragX, { stiffness: 180, damping: 14 });
  const springY = useSpring(dragY, { stiffness: 220, damping: 20 });

  // Angular rotation derived from horizontal displacement (pendulum effect anchored at top)
  const dynamicRotate = useTransform(springX, [-150, 0, 150], [-16, 0, 16]);

  const handleHoverStart = () => {
    setIsHovered(true);
    playCharmSound(iconKey);
  };

  const handleDragStart = () => {
    setIsDragging(true);
    setHasInteracted(true);
    playCharmSound(iconKey);
  };

  return (
    <div className={`hanging-charm-wrapper ${className}`} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Top Anchor Pin on the "ceiling / screen edge" */}
      <div className="charm-anchor-point">
        <div className="anchor-screw" />
        <div className="anchor-glow" />
      </div>

      {/* Main Pendulum Rig */}
      <motion.div
        className="pendulum-rig"
        style={{
          transformOrigin: "top center",
          x: springX,
          y: springY,
          rotate: dynamicRotate,
          cursor: interactive ? (isDragging ? "grabbing" : "grab") : "default",
          touchAction: "none"
        }}
        animate={
          !isDragging
            ? {
                rotate: isHovered ? [-4.5, 4.5, -4.5] : [-3, 3, -3],
                transition: {
                  repeat: Infinity,
                  duration: isHovered ? 2.5 : 3.8,
                  ease: "easeInOut"
                }
              }
            : undefined
        }
        drag={interactive}
        dragConstraints={{ left: -140, right: 140, top: -20, bottom: 90 }}
        dragElastic={0.45}
        onDragStart={handleDragStart}
        onDrag={(e, info) => {
          dragX.set(info.offset.x);
          dragY.set(info.offset.y);
        }}
        onDragEnd={() => {
          setIsDragging(false);
          dragX.set(0);
          dragY.set(0);
        }}
        onHoverStart={handleHoverStart}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Hanging Braided Cord / String */}
        {showString && (
          <div 
            className="charm-string-cord"
            style={{ 
              height: `${stringLength}px`, 
              width: "3px", 
              margin: "0 auto", 
              position: "relative" 
            }}
          >
            <div className="string-ring-connector">
              <span className="connector-gold-crimp" />
              <span className="connector-red-bead" />
              <span className="connector-gold-ring" />
            </div>
          </div>
        )}

        {/* Charm Vector / Real Image Body */}
        <div className="charm-body-container" style={{ transformOrigin: "top center", marginTop: "12px" }}>
          <CharmVector 
            iconKey={iconKey} 
            size={size} 
            isFaded={isFaded} 
            glow={true}
            image={image}
          />

          {/* Micro sparkle indicator on hover */}
          {isHovered && !isDragging && (
            <motion.div 
              className="charm-sparkle-indicator"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <Sparkles size={16} className="sparkle-gold-icon" />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Caption & Playful Hint */}
      {caption && (
        <motion.div 
          className="charm-play-hint"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <span className="hint-pill">
            <span className="pulsing-dot" />
            {hasInteracted ? "Releasing tension..." : caption}
          </span>
        </motion.div>
      )}

      {/* Optional Badge */}
      {showBadge && (
        <div className="charm-feature-badge">
          {badgeText}
        </div>
      )}
    </div>
  );
}

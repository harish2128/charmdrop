import React from "react";
import nimbuMirchiImage from "../../assets/charms/lucky/nimbu-mirchi.png";
import guardianFaceImage from "../../assets/charms/lucky/guardian-face.png";
import evilEyeImage from "../../assets/charms/lucky/evil-eye.png";
import luckyCatImage from "../../assets/charms/lucky/lucky-cat.png";
import luckyBellImage from "../../assets/charms/lucky/lucky-bell.png";
import fourLeafCloverImage from "../../assets/charms/lucky/four-leaf-clover.png";
import darumaImage from "../../assets/charms/lucky/lucky-daruma.png";
import luckyCloverImage from "../../assets/charms/lucky/lucky-clover.png";
import dreamcatcherImage from "../../assets/charms/lucky/dreamcatcher.png";
import luckyHorseshoeImage from "../../assets/charms/lucky/lucky-horseshoe.png";
import redLuckyKnotImage from "../../assets/charms/lucky/red-lucky-knot.png";
import yinYangImage from "../../assets/charms/lucky/yin-yang.png";
import luckyLotusImage from "../../assets/charms/lucky/lucky-lotus.png";

const CHARM_IMAGE_MAP = {
  "nimbu-mirchi": nimbuMirchiImage,
  "guardian-face": guardianFaceImage,
  "evil-eye": evilEyeImage,
  "lucky-cat": luckyCatImage,
  "maneki-neko": luckyCatImage,
  "lucky-bell": luckyBellImage,
  "four-leaf-clover": fourLeafCloverImage,
  "daruma": darumaImage,
  "lucky-daruma": darumaImage,
  "lucky-clover": luckyCloverImage,
  "dreamcatcher": dreamcatcherImage,
  "lucky-horseshoe": luckyHorseshoeImage,
  "red-lucky-knot": redLuckyKnotImage,
  "yin-yang": yinYangImage,
  "lucky-lotus": luckyLotusImage,
};

export function CharmVector({ 
  iconKey, 
  size = 80, 
  className = "", 
  isFaded = false,
  glow = true,
  image = null
}) {
  const filterStyle = isFaded 
    ? { 
        filter: "grayscale(35%) saturate(45%) brightness(0.85)", 
        opacity: 0.45, 
        transition: "all 0.5s ease" 
      } 
    : { 
        filter: "none", 
        opacity: 1, 
        transition: "all 0.5s ease" 
      };

  const resolvedImage = image || (iconKey ? CHARM_IMAGE_MAP[iconKey] : null);

  if (resolvedImage) {
    return (
      <div 
        className={`real-charm-box ${className}`}
        style={{
          display: "inline-flex",
          alignItems: "flex-start",
          justifyContent: "center",
          transformOrigin: "top center",
          height: `${Math.round(size * 1.55)}px`,
          maxHeight: `${Math.round(size * 1.55)}px`
        }}
      >
        <img
          src={resolvedImage}
          alt={iconKey || "Charm"}
          className="real-charm-image"
          draggable={false}
          style={{
            height: "100%",
            width: "auto",
            maxWidth: "100%",
            objectFit: "contain",
            objectPosition: "center",
            transformOrigin: "top center",
            display: "block",
            userSelect: "none",
            WebkitUserDrag: "none",
            pointerEvents: "none",
            ...filterStyle
          }}
        />
      </div>
    );
  }

  switch (iconKey) {
    case "evil-eye":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} style={isFaded ? { filter: "grayscale(75%) contrast(85%) opacity(0.55)", transition: "filter 0.6s ease" } : { transition: "filter 0.6s ease" }}>
          <defs>
            <radialGradient id="ee-glass" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="90%" stopColor="#1E3A8A" />
              <stop offset="100%" stopColor="#0F172A" />
            </radialGradient>
            <filter id="ee-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#3B82F6" floodOpacity={glow ? "0.4" : "0"} />
            </filter>
          </defs>
          {/* Top Hanging Ring */}
          <circle cx="50" cy="8" r="6" stroke="#94A3B8" strokeWidth="2.5" fill="none" />
          <circle cx="50" cy="8" r="2.5" fill="#3B82F6" />
          {/* Main Talisman Outer Disc */}
          <circle cx="50" cy="54" r="42" fill="url(#ee-glass)" filter="url(#ee-glow)" />
          {/* Gold Rim */}
          <circle cx="50" cy="54" r="41" stroke="#F59E0B" strokeWidth="1.5" strokeOpacity="0.4" fill="none" />
          {/* White Layer */}
          <circle cx="50" cy="54" r="28" fill="#F8FAFC" />
          {/* Light Blue Layer */}
          <circle cx="50" cy="54" r="18" fill="#38BDF8" />
          {/* Deep Pupil */}
          <circle cx="50" cy="54" r="9" fill="#0F172A" />
          {/* Crystal Highlight Reflections */}
          <ellipse cx="43" cy="46" rx="6" ry="3.5" transform="rotate(-30 43 46)" fill="#FFFFFF" fillOpacity="0.8" />
          <circle cx="58" cy="62" r="2" fill="#FFFFFF" fillOpacity="0.6" />
        </svg>
      );

    case "nimbu-mirchi":
      return (
        <div 
          className={`real-charm-box ${className}`}
          style={{
            display: "inline-flex",
            alignItems: "flex-start",
            justifyContent: "center",
            transformOrigin: "top center",
            height: `${Math.round(size * 1.55)}px`,
            maxHeight: `${Math.round(size * 1.55)}px`
          }}
        >
          <img
            src={image || nimbuMirchiImage}
            alt="Nimbu Mirchi"
            className="real-charm-image"
            draggable={false}
            style={{
              height: "100%",
              width: "auto",
              maxWidth: "100%",
              objectFit: "contain",
              transformOrigin: "top center",
              display: "block",
              userSelect: "none",
              WebkitUserDrag: "none",
              pointerEvents: "none",
              ...filterStyle
            }}
          />
        </div>
      );

    case "lucky-cat":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} style={filterStyle}>
          <defs>
            <linearGradient id="cat-gold" x1="20" y1="20" x2="80" y2="80">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
          </defs>
          {/* Top Ring */}
          <circle cx="50" cy="8" r="5" stroke="#EAB308" strokeWidth="2" fill="none" />
          {/* Cat Ears */}
          <path d="M28 32 L36 14 L50 28 Z" fill="url(#cat-gold)" stroke="#CA8A04" strokeWidth="1.5" />
          <path d="M33 28 L37 18 L46 27 Z" fill="#F43F5E" />
          <path d="M72 32 L64 14 L50 28 Z" fill="url(#cat-gold)" stroke="#CA8A04" strokeWidth="1.5" />
          <path d="M67 28 L63 18 L54 27 Z" fill="#F43F5E" />
          {/* Cat Head */}
          <circle cx="50" cy="40" r="24" fill="url(#cat-gold)" stroke="#CA8A04" strokeWidth="1.5" />
          {/* Cat Body */}
          <ellipse cx="50" cy="70" rx="22" ry="24" fill="url(#cat-gold)" stroke="#CA8A04" strokeWidth="1.5" />
          {/* Red Collar & Golden Bell */}
          <rect x="34" y="52" width="32" height="6" rx="3" fill="#DC2626" />
          <circle cx="50" cy="58" r="5" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
          <circle cx="50" cy="59" r="1.5" fill="#78350F" />
          {/* Waving Paw (Right) */}
          <ellipse cx="76" cy="38" rx="8" ry="12" transform="rotate(25 76 38)" fill="url(#cat-gold)" stroke="#CA8A04" strokeWidth="1.5" />
          <circle cx="78" cy="30" r="4" fill="#FDE047" />
          {/* Left Paw holding gold coin */}
          <ellipse cx="28" cy="65" rx="7" ry="10" transform="rotate(-20 28 65)" fill="url(#cat-gold)" />
          <ellipse cx="50" cy="74" rx="10" ry="14" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
          <rect x="47" y="70" width="6" height="8" rx="1" fill="#CA8A04" />
          {/* Cute Face */}
          <path d="M40 38 Q44 42 48 38" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M52 38 Q56 42 60 38" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
          <polygon points="50,43 47,46 53,46" fill="#F43F5E" />
          <path d="M47 46 Q50 50 53 46" stroke="#1E293B" strokeWidth="1.5" fill="none" />
          {/* Whiskers */}
          <line x1="30" y1="42" x2="22" y2="40" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="30" y1="46" x2="22" y2="47" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="70" y1="42" x2="78" y2="40" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="70" y1="46" x2="78" y2="47" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case "clover":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} style={filterStyle}>
          <defs>
            <radialGradient id="clover-green" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="60%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="8" r="5" stroke="#10B981" strokeWidth="2" fill="none" />
          <line x1="50" y1="13" x2="50" y2="24" stroke="#047857" strokeWidth="2" />
          {/* 4 Leaves */}
          <g transform="translate(50, 52)">
            {/* Top Leaf */}
            <path d="M0 -6 C-14 -22 14 -22 0 -6 Z" fill="url(#clover-green)" transform="rotate(0)" />
            {/* Right Leaf */}
            <path d="M0 -6 C-14 -22 14 -22 0 -6 Z" fill="url(#clover-green)" transform="rotate(90)" />
            {/* Bottom Leaf */}
            <path d="M0 -6 C-14 -22 14 -22 0 -6 Z" fill="url(#clover-green)" transform="rotate(180)" />
            {/* Left Leaf */}
            <path d="M0 -6 C-14 -22 14 -22 0 -6 Z" fill="url(#clover-green)" transform="rotate(270)" />
            <circle cx="0" cy="0" r="3.5" fill="#047857" />
            {/* Stem */}
            <path d="M0 0 Q6 24 16 32" stroke="#047857" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
        </svg>
      );

    case "f1-car":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} style={filterStyle}>
          <defs>
            <linearGradient id="f1-red" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="60%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="8" r="5" stroke="#EF4444" strokeWidth="2" fill="none" />
          {/* Car Body (Top Down / Isometric Aero Profile) */}
          <g transform="translate(50, 54) rotate(-35)">
            {/* Rear Wing */}
            <rect x="-24" y="-30" width="48" height="8" rx="2" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
            <rect x="-20" y="-32" width="40" height="3" rx="1.5" fill="#EF4444" />
            {/* Rear Wheels */}
            <rect x="-30" y="-22" width="10" height="18" rx="3" fill="#0F172A" />
            <rect x="20" y="-22" width="10" height="18" rx="3" fill="#0F172A" />
            {/* Main Chassis */}
            <path d="M-12 -22 L-14 4 L-8 26 L8 26 L14 4 L12 -22 Z" fill="url(#f1-red)" stroke="#7F1D1D" strokeWidth="1.5" />
            {/* Cockpit & Halo */}
            <ellipse cx="0" cy="-2" rx="6" ry="10" fill="#0F172A" />
            <circle cx="0" cy="-2" r="4" fill="#F59E0B" />
            <path d="M-6 -6 L0 4 L6 -6" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Sidepods & Air Intake */}
            <rect x="-18" y="-8" width="6" height="14" rx="2" fill="#DC2626" />
            <rect x="12" y="-8" width="6" height="14" rx="2" fill="#DC2626" />
            {/* Front Wheels */}
            <rect x="-28" y="16" width="9" height="16" rx="3" fill="#0F172A" />
            <rect x="19" y="16" width="9" height="16" rx="3" fill="#0F172A" />
            {/* Front Wing Aero */}
            <path d="M-26 30 L26 30 L22 36 L-22 36 Z" fill="#1E293B" stroke="#EF4444" strokeWidth="1" />
          </g>
        </svg>
      );

    case "turbo":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} style={filterStyle}>
          <defs>
            <radialGradient id="turbo-sn" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#A78BFA" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#5B21B6" />
            </radialGradient>
            <linearGradient id="turbo-pipe" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="8" r="5" stroke="#8B5CF6" strokeWidth="2" fill="none" />
          {/* Turbo Outlet pipe */}
          <path d="M60 30 L84 22 L88 38 L68 44 Z" fill="url(#turbo-pipe)" stroke="#1E293B" strokeWidth="1.5" />
          {/* Main Compressor Snail Housing */}
          <path d="M50 24 C68 24 82 38 82 56 C82 74 68 88 50 88 C32 88 18 74 18 56 C18 42 28 30 42 26 Z" fill="url(#turbo-sn)" stroke="#4C1D95" strokeWidth="2" />
          {/* Center Inlet Bell */}
          <circle cx="50" cy="56" r="20" fill="#0F172A" stroke="#06B6D4" strokeWidth="2" />
          {/* Turbine Vanes */}
          <g transform="translate(50, 56)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <path key={deg} d="M0 0 Q6 -10 14 -16" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${deg})`} />
            ))}
            <circle cx="0" cy="0" r="4" fill="#F59E0B" />
          </g>
          {/* Bolts around housing */}
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <circle key={i} cx={50 + 26 * Math.cos((deg * Math.PI) / 180)} cy={56 + 26 * Math.sin((deg * Math.PI) / 180)} r="2" fill="#E2E8F0" />
          ))}
        </svg>
      );

    case "jdm-car":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} style={filterStyle}>
          <defs>
            <linearGradient id="jdm-neon" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="8" r="5" stroke="#EC4899" strokeWidth="2" fill="none" />
          {/* Hanging drift tow strap */}
          <rect x="47" y="13" width="6" height="18" rx="2" fill="#EC4899" />
          <circle cx="50" cy="24" r="2" fill="#FDE047" />
          {/* JDM Car Body Profile angled */}
          <g transform="translate(50, 60) rotate(-15)">
            {/* Underglow glow */}
            <ellipse cx="0" cy="18" rx="38" ry="6" fill="#EC4899" fillOpacity="0.4" filter="blur(4px)" />
            {/* Big GT Spoiler */}
            <path d="M-36 -8 L-34 -20 L-22 -20 L-24 -8" stroke="#1E293B" strokeWidth="2" fill="none" />
            <rect x="-38" y="-22" width="18" height="4" rx="2" fill="#0F172A" />
            {/* Car Coupe Body */}
            <path d="M-36 12 L-34 -2 L-20 -4 L-10 -16 L14 -16 L28 -2 L38 2 L40 12 L34 16 L-32 16 Z" fill="url(#jdm-neon)" stroke="#1E293B" strokeWidth="1.5" />
            {/* Windows & Tint */}
            <path d="M-8 -13 L12 -13 L22 -2 L-16 -2 Z" fill="#0F172A" />
            {/* Front Headlights & Tail Lights */}
            <polygon points="36,4 40,4 38,10 34,10" fill="#38BDF8" />
            <polygon points="-36,0 -32,0 -33,6 -36,6" fill="#EF4444" />
            {/* Wheels & Bronze Rims */}
            <circle cx="-22" cy="16" r="8" fill="#0F172A" />
            <circle cx="-22" cy="16" r="4.5" fill="#D97706" />
            <circle cx="24" cy="16" r="8" fill="#0F172A" />
            <circle cx="24" cy="16" r="4.5" fill="#D97706" />
          </g>
        </svg>
      );

    case "helmet":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} style={filterStyle}>
          <defs>
            <linearGradient id="vis-chameleon" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="8" r="5" stroke="#F97316" strokeWidth="2" fill="none" />
          {/* Main Helmet Shell */}
          <path d="M24 64 C20 44 26 24 50 24 C74 24 80 44 76 64 C74 76 66 82 50 82 C34 82 26 76 24 64 Z" fill="#1E293B" stroke="#F97316" strokeWidth="2" />
          {/* Racing Stripes */}
          <path d="M46 24 L46 82" stroke="#F97316" strokeWidth="4" />
          <path d="M52 24 L52 82" stroke="#FFFFFF" strokeWidth="2" />
          {/* Aerodynamic Visor */}
          <path d="M28 44 C34 38 66 38 72 44 C76 50 72 60 64 62 C54 64 46 64 36 62 C28 60 24 50 28 44 Z" fill="url(#vis-chameleon)" stroke="#0F172A" strokeWidth="1.5" />
          {/* Visor Glare */}
          <path d="M34 44 C42 41 58 41 66 44" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" />
          {/* Chin Vent */}
          <rect x="44" y="68" width="12" height="4" rx="2" fill="#0F172A" />
        </svg>
      );

    case "controller":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} style={filterStyle}>
          <defs>
            <linearGradient id="ctrl-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="50%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#9333EA" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="8" r="5" stroke="#6366F1" strokeWidth="2" fill="none" />
          {/* Hanging Cord */}
          <line x1="50" y1="13" x2="50" y2="34" stroke="#6366F1" strokeWidth="2" strokeDasharray="2 2" />
          {/* Controller Body */}
          <path d="M22 42 C30 38 70 38 78 42 C88 48 92 74 82 84 C74 92 64 82 58 68 C54 62 46 62 42 68 C36 82 26 92 18 84 C8 74 12 48 22 42 Z" fill="url(#ctrl-grad)" stroke="#312E81" strokeWidth="2" />
          {/* D-Pad (Left) */}
          <rect x="26" y="52" width="6" height="14" rx="2" fill="#1E293B" />
          <rect x="22" y="56" width="14" height="6" rx="2" fill="#1E293B" />
          {/* Action Buttons (Right) */}
          <circle cx="74" cy="52" r="3" fill="#EF4444" />
          <circle cx="80" cy="58" r="3" fill="#3B82F6" />
          <circle cx="68" cy="58" r="3" fill="#10B981" />
          <circle cx="74" cy="64" r="3" fill="#F59E0B" />
          {/* Glowing Analog Sticks */}
          <circle cx="38" cy="64" r="6" fill="#0F172A" stroke="#06B6D4" strokeWidth="1.5" />
          <circle cx="62" cy="64" r="6" fill="#0F172A" stroke="#EC4899" strokeWidth="1.5" />
          {/* Center LED */}
          <circle cx="50" cy="48" r="2.5" fill="#38BDF8" />
        </svg>
      );

    case "pixel-sword":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} style={filterStyle}>
          <circle cx="50" cy="8" r="5" stroke="#06B6D4" strokeWidth="2" fill="none" />
          <g transform="translate(50, 52) rotate(45)">
            {/* Pixel Diamond Blade */}
            <rect x="-4" y="-38" width="8" height="36" fill="#38BDF8" />
            <polygon points="-4,-38 0,-46 4,-38" fill="#E0F2FE" />
            <rect x="-2" y="-34" width="4" height="30" fill="#FFFFFF" fillOpacity="0.7" />
            {/* Crossguard */}
            <rect x="-14" y="-2" width="28" height="6" rx="1" fill="#0284C7" stroke="#0369A1" strokeWidth="1" />
            <rect x="-12" y="-1" width="6" height="4" fill="#38BDF8" />
            <rect x="6" y="-1" width="6" height="4" fill="#38BDF8" />
            {/* Handle & Pommel */}
            <rect x="-3" y="4" width="6" height="14" fill="#78350F" />
            <rect x="-5" y="18" width="10" height="6" rx="2" fill="#F59E0B" />
            <circle cx="0" cy="21" r="2" fill="#FEF08A" />
          </g>
        </svg>
      );

    case "armored-hero":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} style={filterStyle}>
          <defs>
            <linearGradient id="armor-red" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="60%" stopColor="#991B1B" />
              <stop offset="100%" stopColor="#7F1D1D" />
            </linearGradient>
            <linearGradient id="armor-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="8" r="5" stroke="#EAB308" strokeWidth="2" fill="none" />
          {/* Futuristic Mecha Armor Helmet (Original concept) */}
          <path d="M26 40 C26 22 40 18 50 18 C60 18 74 22 74 40 C74 62 66 78 50 82 C34 78 26 62 26 40 Z" fill="url(#armor-red)" stroke="#7F1D1D" strokeWidth="2" />
          {/* Gold Faceplate Inset */}
          <path d="M34 36 L40 26 L60 26 L66 36 L62 58 L50 72 L38 58 Z" fill="url(#armor-gold)" stroke="#A16207" strokeWidth="1.5" />
          {/* Glowing Cybernetic Eye Slits */}
          <polygon points="38,44 46,44 44,48 39,47" fill="#38BDF8" filter="drop-shadow(0 0 4px #0ea5e9)" />
          <polygon points="62,44 54,44 56,48 61,47" fill="#38BDF8" filter="drop-shadow(0 0 4px #0ea5e9)" />
          {/* Arc Forehead Core */}
          <polygon points="50,28 47,33 53,33" fill="#38BDF8" />
          {/* Titanium Jaw Lines */}
          <line x1="42" y1="62" x2="58" y2="62" stroke="#78350F" strokeWidth="2" />
          <line x1="45" y1="66" x2="55" y2="66" stroke="#78350F" strokeWidth="1.5" />
        </svg>
      );

    case "masked-hero":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} style={filterStyle}>
          <defs>
            <linearGradient id="mask-red" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F43F5E" />
              <stop offset="50%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#9F1239" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="8" r="5" stroke="#E11D48" strokeWidth="2" fill="none" />
          {/* Stealth Urban Mask (Original Concept) */}
          <ellipse cx="50" cy="52" rx="26" ry="32" fill="url(#mask-red)" stroke="#881337" strokeWidth="2" />
          {/* Geometric Hex Web pattern */}
          <path d="M50 20 L50 84" stroke="#1E293B" strokeWidth="1" strokeOpacity="0.4" />
          <path d="M24 52 L76 52" stroke="#1E293B" strokeWidth="1" strokeOpacity="0.4" />
          <ellipse cx="50" cy="52" rx="14" ry="18" stroke="#1E293B" strokeWidth="1" strokeOpacity="0.4" fill="none" />
          <ellipse cx="50" cy="52" rx="22" ry="26" stroke="#1E293B" strokeWidth="1" strokeOpacity="0.4" fill="none" />
          {/* White Angular Lenses */}
          <path d="M32 46 C34 40 44 42 46 48 C44 56 36 56 32 46 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
          <path d="M68 46 C66 40 56 42 54 48 C56 56 64 56 68 46 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
        </svg>
      );

    case "thunder-hammer":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} style={filterStyle}>
          <circle cx="50" cy="8" r="5" stroke="#38BDF8" strokeWidth="2" fill="none" />
          <g transform="translate(50, 52) rotate(-25)">
            {/* Heavy Hammer Head */}
            <rect x="-22" y="-24" width="44" height="26" rx="4" fill="#64748B" stroke="#334155" strokeWidth="2" />
            <rect x="-18" y="-20" width="36" height="18" rx="2" fill="#94A3B8" />
            {/* Runic engraving */}
            <path d="M-8 -11 L0 -17 L8 -11 L0 -5 Z" stroke="#38BDF8" strokeWidth="1.5" fill="none" />
            {/* Sturdy Handle */}
            <rect x="-4" y="2" width="8" height="34" rx="2" fill="#78350F" />
            <line x1="-4" y1="8" x2="4" y2="12" stroke="#F59E0B" strokeWidth="1.5" />
            <line x1="-4" y1="16" x2="4" y2="20" stroke="#F59E0B" strokeWidth="1.5" />
            <line x1="-4" y1="24" x2="4" y2="28" stroke="#F59E0B" strokeWidth="1.5" />
            {/* Pommel Strap */}
            <circle cx="0" cy="38" r="3" fill="#64748B" />
            {/* Lightning Sparks */}
            <path d="M16 -24 L22 -32 L18 -26 L26 -30" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      );

    case "shield-hero":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} style={filterStyle}>
          <circle cx="50" cy="8" r="5" stroke="#3B82F6" strokeWidth="2" fill="none" />
          {/* Concentric Kinetic Shield */}
          <circle cx="50" cy="54" r="36" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
          <circle cx="50" cy="54" r="28" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          <circle cx="50" cy="54" r="20" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
          <circle cx="50" cy="54" r="12" fill="#2563EB" />
          {/* Center Star */}
          <polygon points="50,44 53,51 60,51 54,55 57,62 50,58 43,62 46,55 40,51 47,51" fill="#FFFFFF" />
        </svg>
      );

    case "fire":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} style={filterStyle}>
          <defs>
            <linearGradient id="flame-grad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#FACC15" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="8" r="5" stroke="#F97316" strokeWidth="2" fill="none" />
          {/* Outer Flame */}
          <path d="M50 18 C58 32 78 44 78 64 C78 78 66 88 50 88 C34 88 22 78 22 64 C22 48 38 38 42 28 C44 38 52 40 50 18 Z" fill="url(#flame-grad)" />
          {/* Inner Core Flame */}
          <path d="M50 48 C56 56 64 64 64 74 C64 82 58 86 50 86 C42 86 36 82 36 74 C36 66 44 60 46 54 C48 60 52 60 50 48 Z" fill="#FEF08A" />
        </svg>
      );

    case "rocket":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} style={filterStyle}>
          <circle cx="50" cy="8" r="5" stroke="#6366F1" strokeWidth="2" fill="none" />
          <g transform="translate(50, 50) rotate(-45)">
            {/* Rocket Fins */}
            <path d="M-14 12 L-22 28 L-8 22 Z" fill="#EF4444" />
            <path d="M14 12 L22 28 L8 22 Z" fill="#EF4444" />
            {/* Rocket Fuselage */}
            <path d="M0 -34 C16 -18 16 14 12 24 L-12 24 C-16 14 -16 -18 0 -34 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* Nose Cone */}
            <path d="M0 -34 C8 -24 8 -18 0 -18 C-8 -18 -8 -24 0 -34 Z" fill="#EF4444" />
            {/* Porthole Window */}
            <circle cx="0" cy="-2" r="7" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
            <circle cx="-2" cy="-4" r="2" fill="#FFFFFF" />
            {/* Thruster Exhaust Flame */}
            <polygon points="-8,24 0,38 8,24" fill="#F59E0B" />
            <polygon points="-4,24 0,32 4,24" fill="#FDE047" />
          </g>
        </svg>
      );

    case "crown":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} style={filterStyle}>
          <defs>
            <linearGradient id="cr-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="60%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="8" r="5" stroke="#EAB308" strokeWidth="2" fill="none" />
          {/* Royal Crown */}
          <path d="M18 72 L22 36 L36 52 L50 28 L64 52 L78 36 L82 72 Z" fill="url(#cr-gold)" stroke="#B45309" strokeWidth="2" />
          <rect x="16" y="72" width="68" height="10" rx="3" fill="#B45309" />
          {/* Gems */}
          <circle cx="22" cy="36" r="3.5" fill="#EF4444" />
          <circle cx="50" cy="28" r="4.5" fill="#3B82F6" />
          <circle cx="78" cy="36" r="3.5" fill="#10B981" />
          <circle cx="34" cy="77" r="2.5" fill="#EF4444" />
          <circle cx="50" cy="77" r="3" fill="#38BDF8" />
          <circle cx="66" cy="77" r="2.5" fill="#10B981" />
        </svg>
      );

    case "lightning":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} style={filterStyle}>
          <defs>
            <linearGradient id="lt-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="8" r="5" stroke="#F59E0B" strokeWidth="2" fill="none" />
          <polygon points="54,18 28,52 48,52 42,86 74,46 54,46" fill="url(#lt-grad)" stroke="#D97706" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );

    default:
      // No fallback placeholder - real assets must be supplied
      return null;
  }
}

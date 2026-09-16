# CharmDrop

CharmDrop is a lightweight, interactive desktop widget and companion website designed for Windows 10 and 11. It allows users to hang authentic talismans, fortune bells, and daily refreshed charms (such as the traditional Nimbu Mirchi) from the top of their screen with realistic pendulum physics, cursor proximity interactions, and audio feedback.

---

## Features

- **Interactive Verlet Physics Engine**: 12-point particle rope simulation with organic breeze sway, realistic momentum release, and settling dynamics.
- **Cursor Proximity & Drag Interaction**: Charms naturally react and push away from moving mouse cursors, with support for fluid drag, flick, and mouse wheel impulses.
- **Authentic Transparent Assets**: 13 canonical handcrafted Lucky charms with authentic transparent backgrounds and centered aspect ratios.
- **Targeted Sound Effects Engine**: Meaningful chime audio for Fortune Bell and reactive meow audio for Maneki Neko (Lucky Cat).
- **Daily Nimbu Mirchi Talisman**: 24-hour fresh talisman lifecycle with morning fresh hanging and fading state persistence.
- **Windows System Tray & Positioning**: Full system tray integration with presets (Top-Left, Top-Center, Top-Right), custom position memory, startup launch toggle, and hotkey shortcuts.
- **Single Instance & Security**: Strict Electron production hardening (`contextIsolation: true`, `nodeIntegration: false`, zero direct shell/fs renderer access).
- **Responsive Website & Gallery**: Fast companion web application built with React, Vite, Framer Motion, and Lucide icons.

---

## Website Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation & Development
```bash
# Install root dependencies
npm install

# Start development server
npm run dev

# Build production bundle (outputs to /dist)
npm run build

# Preview production build locally
npm run preview
```

---

## Desktop App Setup

The desktop application is located in the `desktop-test/` directory.

### Development Mode
```bash
cd desktop-test
npm install
npm run dev
```

### Production Build (Windows Installer)
```bash
cd desktop-test
npm run build:win
```
The output installer `CharmDrop-Setup-1.0.0.exe` and blockmap will be placed in `desktop-test/release/`.

---

## Project Structure

```text
Charmdrop/
├── index.html                 # Website entry HTML
├── vite.config.js             # Vite configuration
├── package.json               # Website npm configuration
├── public/                    # Static public web assets & audio
│   └── assets/sounds/         # Web audio assets
├── src/                       # Website React source
│   ├── assets/charms/lucky/   # Web transparent PNG charm assets
│   ├── components/            # Reusable UI cards, sections, modals
│   ├── config/siteConfig.js   # Global metadata and release links
│   ├── data/charmsData.js     # Canonical website charm registry
│   ├── pages/                 # Website route pages
│   ├── styles/                # CSS design system
│   └── utils/soundEffects.js  # Web Audio API synthesis
├── desktop-test/              # Electron Desktop Application
│   ├── main.js                # Main process (tray, window, IPC, persistence)
│   ├── preload.js             # Secure context bridge API
│   ├── renderer.js            # Renderer entry
│   ├── index.html             # Desktop charm stage & selector UI
│   ├── about.html             # About CharmDrop window
│   ├── style.css              # Desktop styling & animations
│   ├── data/charms.js         # Canonical desktop charm registry
│   ├── js/                    # Physics engine, sound manager, daily manager
│   ├── assets/                # Desktop icons, tray assets, charms, sounds
│   └── release/               # Built Windows NSIS installers & binaries
├── README.md                  # Developer & client technical documentation
└── CLIENT_HANDOVER.md         # Client handover and operations manual
```

---

## Charm Asset Management

- **Desktop Assets**: Stored in `desktop-test/assets/charms/lucky/` as transparent PNGs (PNG-32).
- **Website Assets**: Stored in `src/assets/charms/lucky/` as transparent PNGs.
- **Audio Assets**: Stored in `desktop-test/assets/sounds/` and `public/assets/sounds/`.

### Canonical 13 Approved Charms

1. `nimbu-mirchi` — Nimbu Mirchi (Daily Refresh Talisman)
2. `guardian-face` — Guardian Face
3. `evil-eye` — Evil Eye
4. `lucky-cat` — Maneki Neko (Lucky Cat) `[Sound Enabled]`
5. `four-leaf-clover` — Four Leaf Clover
6. `lucky-bell` — Fortune Bell `[Sound Enabled]`
7. `daruma` — Daruma
8. `lucky-clover` — Lucky Clover
9. `dreamcatcher` — Dreamcatcher
10. `lucky-horseshoe` — Lucky Horseshoe
11. `red-lucky-knot` — Red Lucky Knot
12. `yin-yang` — Yin Yang
13. `lucky-lotus` — Lucky Lotus

---

## Adding a Charm

To register a new charm in both the website and desktop application:

1. Place the transparent PNG artwork into `src/assets/charms/lucky/` and `desktop-test/assets/charms/lucky/`.
2. Add the charm object to `src/data/charmsData.js` and `desktop-test/data/charms.js`.

### Charm Schema Definition

```javascript
{
  id: "unique-charm-id",        // Unique kebab-case identifier
  name: "Display Name",         // User-facing name
  category: "Lucky",            // Category name
  image: "assets/charms/...",   // Path or imported module
  maxWidth: 105,                // Max rendering width in pixels
  maxHeight: 190,               // Max rendering height in pixels
  ropeOffsetX: 0,               // Attachment offset X
  ropeOffsetY: 0,               // Attachment offset Y
  ropeLength: 65,               // Length of Verlet rope in px
  dailyRefresh: false,          // True if part of 24h cycle
  physics: {
    weight: 1.0,                // Natural weight (higher = heavier swing)
    swingMultiplier: 1.0,       // Momentum responsiveness
    dampingMultiplier: 1.0      // Velocity decay factor
  },
  sound: null                   // Audio config or null
}
```

> **IMPORTANT SOUND RULE**:
> Only **Fortune Bell** (`universfield-single-church-bell-2-352062.mp3`) and **Lucky Cat** (`dragon-studio-cartoon-cat-meow-487661.mp3`) use sound. All other charms must strictly specify `sound: null`.

---

## Release Process

1. **Website Release**:
   ```bash
   npm run build
   ```
   Deploy the resulting `dist/` directory to your web hosting provider (Vercel, Netlify, or Static CDN).

2. **Windows Desktop Release**:
   ```bash
   cd desktop-test
   npm run build:win
   ```
   Upload `desktop-test/release/CharmDrop-Setup-1.0.0.exe` to your GitHub Releases or file distribution bucket matching the URL defined in `src/config/siteConfig.js`.

---

## Troubleshooting

- **Window not visible on screen**: Use the global shortcut `Ctrl + Shift + R` or right-click the system tray icon and select **Reset Position** to bring CharmDrop to the top-right corner.
- **Audio not playing**: Check that **Sound Effects** is checked in the system tray menu. Note that only the Fortune Bell and Lucky Cat charms produce sound.
- **Charm selector shortcut**: Press `Ctrl + Shift + C` anytime to toggle the compact on-screen Charm Selector.
- **Quit Application**: Press `Ctrl + Shift + Q` or select **Quit CharmDrop** from the system tray menu.

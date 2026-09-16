# CharmDrop

CharmDrop is an interactive screen companion, digital talisman platform, and companion website. Available across three primary distributions:
1. **CharmDrop Companion Website** (React + Vite single-page web app)
2. **CharmDrop Browser Extension** (Manifest V3 for Google Chrome, Microsoft Edge, and Chromium browsers)
3. **CharmDrop Windows Desktop App** (Native Electron application for Windows 10 & 11)

---

## Features

- **Interactive Verlet Physics Engine**: 12-point particle rope simulation with organic breeze sway, realistic momentum release, and settling dynamics.
- **Cursor Proximity & Drag Interaction**: Charms naturally react and push away from moving mouse cursors, with support for fluid drag, flick, and mouse wheel impulses.
- **Authentic Transparent Assets**: 13 canonical handcrafted Lucky charms with authentic transparent backgrounds and centered aspect ratios.
- **Targeted Sound Effects Engine**: Meaningful chime audio for Fortune Bell and reactive meow audio for Maneki Neko (Lucky Cat). All other charms remain silent.
- **Daily Nimbu Mirchi Talisman**: 24-hour fresh talisman lifecycle with morning fresh hanging and fading state persistence.
- **Browser Extension (Manifest V3)**: Shadow DOM encapsulated overlay hanging directly from webpage viewport tops without damaging website layout or CSS.
- **Windows Desktop App**: System tray integration with presets (Top-Left, Top-Center, Top-Right), custom position memory, startup launch toggle, and hotkey shortcuts.

---

## 1. Website Setup

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

## 2. Browser Extension Setup (Chrome & Edge)

The browser extension is located in `/extension` using Manifest V3.

### How to Test / Load Unpacked:
1. Open Google Chrome or Microsoft Edge.
2. Navigate to extensions management:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
3. Enable **Developer mode** (toggle in upper-right or left sidebar).
4. Click **Load unpacked**.
5. Select the `extension` folder (`d:\Charmdrop\extension`).
6. The CharmDrop extension icon will appear in your browser toolbar! Click it to open the popup, choose charms, toggle sound, and adjust position presets.

---

## 3. Desktop App Setup (Windows)

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
├── extension/                 # Manifest V3 Browser Extension (NEW)
│   ├── manifest.json          # Manifest V3 configuration
│   ├── background.js          # Background service worker
│   ├── content.js             # Content script with Shadow DOM & Verlet rope
│   ├── content.css            # Extension root isolation styling
│   ├── data/charms.js         # Canonical extension charm registry
│   ├── popup/                 # Extension popup UI (HTML, CSS, JS)
│   └── assets/                # Local charm PNGs, icons, and MP3 audio
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

- **Desktop Assets**: Stored in `desktop-test/assets/charms/lucky/` as transparent PNGs.
- **Extension Assets**: Stored in `extension/assets/charms/lucky/` as transparent PNGs.
- **Website Assets**: Stored in `src/assets/charms/lucky/` as transparent PNGs.
- **Audio Assets**: Stored in `extension/assets/sounds/`, `desktop-test/assets/sounds/`, and `public/assets/sounds/`.

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

To register a new charm across all targets:

1. Place the transparent PNG artwork into `src/assets/charms/lucky/`, `extension/assets/charms/lucky/`, and `desktop-test/assets/charms/lucky/`.
2. Add the charm object to `src/data/charmsData.js`, `extension/data/charms.js`, and `desktop-test/data/charms.js`.

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

## Troubleshooting

- **Extension not showing on restricted browser pages**: Chrome and Edge prevent extension scripts from executing on special pages like `chrome://`, `edge://`, or the Web Store. Test on standard websites (e.g. `https://example.com`, `https://wikipedia.org`).
- **Desktop window not visible**: Use `Ctrl + Shift + R` or right-click the system tray icon and select **Reset Position**.
- **Audio not playing**: Check that **Sound Effects** is enabled. Note that only the Fortune Bell and Lucky Cat charms produce sound.

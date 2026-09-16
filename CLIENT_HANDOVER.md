# CharmDrop — Client Handover & Operations Manual

**Project**: CharmDrop  
**Release**: Version 1.0.0 (Client Handover Edition)  
**Platforms**: Windows Desktop Application (Windows 10 & 11, 64-bit) & Companion Web Application  
**Date**: September 2026  

---

## 1. Executive Summary: What CharmDrop Is

CharmDrop is an interactive desktop screen companion and digital talisman platform. Built natively for Windows 10 and 11, it renders authentic hanging charms from the top edge of the user's screen. Each charm features real-time Verlet rope physics, mouse cursor proximity repulsion, momentum release physics, and custom sound effects.

The accompanying web application serves as the public showcase, dynamic interactive catalog, and installer distribution hub for CharmDrop.

---

## 2. Key Features

- **Realistic Physics Cord**: 12-point Verlet particle chain simulation with organic wind swaying, downward gravity, and natural wave propagation.
- **Dynamic Mouse Reactions**: As the cursor approaches a charm (<= 150px), the talisman smoothly shifts and pushes away.
- **Drag, Flick & Scroll**: Users can grab and drag the charm anywhere along the screen top, flick it with momentum, or scroll to oscillate.
- **Curated 13 Authentic Lucky Charms**: Handcrafted transparent assets including Nimbu Mirchi, Fortune Bell, Maneki Neko, Daruma, Evil Eye, Dreamcatcher, Four Leaf Clover, and more.
- **Controlled Sound Architecture**: Realistic church bell chime for Fortune Bell and cat meow for Lucky Cat, with strict zero sound bleed to other charms.
- **Daily Nimbu Mirchi Talisman**: A 24-hour talisman cycle that fades after 24 hours, inviting the user to hang a fresh Nimbu Mirchi daily.
- **Windows Tray & Position Presets**: Full system tray integration, position presets (Top-Left, Top-Center, Top-Right), persistent custom coordinates, and auto-start preferences.

---

## 3. Website Functionality

The companion website is a React single-page application built with Vite and Framer Motion.

- **Home (`/`)**: Hero demonstration, interactive physics showcases, 24-hour Nimbu preview, feature breakdown, social proof, and direct download links.
- **Charms Catalog (`/charms`)**: Full interactive gallery of all 13 approved Lucky charms with category filtering, real-time search, sorting, and modal previews with audio triggers.
- **How It Works (`/how-it-works`)**: Four-step walkthrough covering download, installation, charm selection, and desktop interaction.
- **Download Hub (`/download`)**: Official Windows release installer link, installation steps, and cross-device handoff tools.
- **About (`/about`) & Contact (`/contact`)**: Brand story, developer documentation links, support contact details, and platform specs.
- **Privacy Policy (`/privacy`) & Terms (`/terms`)**: Standard platform privacy and terms agreements.

---

## 4. Desktop Functionality

The desktop app is built with Electron and packaged using NSIS for Windows.

- **Transparent Always-on-Top Stage**: The charm hangs unobtrusively above open windows.
- **Mouse Pass-Through**: When the cursor is outside the interaction zone, clicks pass right through to background windows without interference.
- **Single Instance Enforcement**: Prevents accidental duplicate windows or tray instances.
- **Low Resource Usage**: Uses native `requestAnimationFrame` and efficient Verlet integration for minimal CPU footprint (&lt;0.5% idle).

---

## 5. How Users Install CharmDrop

1. Download `CharmDrop-Setup-1.0.0.exe` from the official download page.
2. Run the installer. The NSIS installer will set up CharmDrop and create desktop and Start Menu shortcuts.
3. CharmDrop will immediately launch and dock to the top-right of the primary display.

---

## 6. How Users Change Charms

Users have two ways to switch charms:

1. **Charm Selector Panel (`Ctrl + Shift + C`)**:
   - Press `Ctrl + Shift + C` or click the CharmDrop System Tray icon.
   - Click any charm from the list. The active charm smoothly cross-fades into place.
   - Press `Esc` or click `✕` to close.
2. **System Tray Menu**:
   - Right-click the CharmDrop icon in the Windows taskbar system tray.
   - Hover over **Change Charm** &gt; **Lucky** and select the desired charm.

---

## 7. System Tray Controls & Shortcuts

| Action | System Tray Option | Keyboard Shortcut |
| :--- | :--- | :--- |
| **Toggle Charm Selector** | Single/Double Click Icon | `Ctrl + Shift + C` |
| **Show / Hide Charm** | Checkbox: *Show Charm* | `Ctrl + Shift + H` |
| **Move to Preset** | *Position* &gt; Top Left / Center / Right | — |
| **Reset Position** | *Reset Position* | `Ctrl + Shift + R` |
| **Toggle Sound Effects** | Checkbox: *Sound Effects* | — |
| **Launch at Startup** | Checkbox: *Launch at Startup* | — |
| **Daily Nimbu Action** | *Hang New Nimbu Mirchi* | — |
| **About Window** | *About CharmDrop* | — |
| **Quit CharmDrop** | *Quit CharmDrop* | `Ctrl + Shift + Q` |

---

## 8. Sound Behavior & Strict Rules

To maintain a serene desktop atmosphere, sound effects are strictly governed:

1. **Fortune Bell**: Plays `universfield-single-church-bell-2-352062.mp3` once upon receiving its first meaningful impulse. It automatically disarms during subsequent decay oscillations to prevent acoustic clutter.
2. **Lucky Cat (Maneki Neko)**: Plays `dragon-studio-cartoon-cat-meow-487661.mp3` once when the cursor enters the 150px interaction zone. Disarms until the cursor completely exits (&gt;220px) and re-enters.
3. **All Other 11 Charms**: Completely silent (`sound: null`).
4. **Sound Effects OFF**: When disabled in the system tray, all sounds are muted globally.

---

## 9. Daily Nimbu Mirchi Lifecycle

The Nimbu Mirchi talisman features a daily refresh ritual:

- **Fresh State**: Lemon and 7 chillies appear vibrant and saturated.
- **Faded State**: After 24 hours (or at midnight calendar rollover), the talisman smoothly fades to a desaturated look.
- **Refresh Action**: The user can click **Hang New Nimbu Mirchi** in the selector panel or system tray to hang a fresh talisman with a gentle drop animation.
- **Persistence**: Daily state and timestamps are saved locally in Electron's `userData/charmdrop-config.json`.

---

## 10. How Admins/Developers Add a Future Charm

1. Prepare a transparent 32-bit PNG (recommended dimensions: ~300x600px).
2. Save the image in:
   - `src/assets/charms/lucky/your-charm.png` (Website)
   - `desktop-test/assets/charms/lucky/your-charm.png` (Desktop)
3. Register the charm in `src/data/charmsData.js`:
   ```javascript
   import yourCharmImage from "../assets/charms/lucky/your-charm.png";
   
   // Add to charmsData array:
   {
     id: "your-charm",
     name: "Your Charm Name",
     category: "Lucky",
     image: yourCharmImage,
     iconKey: "your-charm",
     description: "Description of your talisman.",
     color: "#10B981",
     accentColor: "#34D399",
     isNew: true,
     isDaily: false,
     isPopular: false,
     tag: "Special Tag",
     swingSpeed: 3.2,
     physics: { weight: 1.0, swingMultiplier: 1.0, dampingMultiplier: 1.0 },
     sound: null
   }
   ```
4. Register the charm in `desktop-test/data/charms.js`:
   ```javascript
   {
     id: "your-charm",
     name: "Your Charm Name",
     category: "Lucky",
     image: "assets/charms/lucky/your-charm.png",
     scale: 1,
     maxWidth: 105,
     maxHeight: 190,
     ropeOffsetX: 0,
     ropeOffsetY: 0,
     ropeLength: 65,
     dailyRefresh: false,
     physics: { weight: 1.0, swingMultiplier: 1.0, dampingMultiplier: 1.0 },
     sound: null,
     description: "Description of your talisman."
   }
   ```
5. Rebuild website and desktop installer.

---

## 11. How to Replace an Image

To update the artwork of an existing charm (e.g., `lucky-lotus.png`):
1. Overwrite the file in both `src/assets/charms/lucky/` and `desktop-test/assets/charms/lucky/` with the new transparent PNG.
2. Maintain identical filenames to avoid updating imports.
3. Run `npm run build` in root and `npm run build:win` in `desktop-test/`.

---

## 12. How to Update the Desktop Installer

When code or assets are modified:
```bash
cd desktop-test
npm run build:win
```
The output will be created at `desktop-test/release/CharmDrop-Setup-1.0.0.exe`.  
*Note*: If releasing a public update, increment `"version": "1.0.1"` in `desktop-test/package.json` and `src/config/siteConfig.js`.

---

## 13. How to Deploy the Website

1. Build the production web bundle:
   ```bash
   npm run build
   ```
2. The static output files are in `/dist`.
3. Deploy `/dist` to your static hosting provider (e.g., Vercel, Netlify, Cloudflare Pages, AWS S3/CloudFront).

---

## 14. Repository Information Placeholders

- **Primary Repository**: `https://github.com/charmdrop/charmdrop`
- **Releases URL**: `https://github.com/charmdrop/charmdrop/releases`
- **Default Branch**: `main`

---

## 15. Hosting & Domain Placeholders

- **Production Domain**: `https://charmdrop.app`
- **Support Contact**: `support@charmdrop.app`
- **General Inquiries**: `hello@charmdrop.app`
- **Instagram**: `https://instagram.com/charmdrop.app`

---

## 16. Known System Behavior & Considerations

1. **Windows SmartScreen Notice**: Because the installer binary is self-built and not signed with a paid Extended Validation (EV) code signing certificate, Windows SmartScreen may display a standard prompt during initial install (*"Windows protected your PC"* &gt; click *"More info"* &gt; *"Run anyway"*). Purchasing an EV code signing certificate will remove this prompt.
2. **Display Resolution Shifts**: CharmDrop dynamically re-validates screen work areas when monitors are attached or disconnected to ensure the charm remains visible.
3. **Multi-Monitor Windows**: When dragged across monitor boundaries, CharmDrop anchors to the work area top of the active display nearest to the window center.

---

## 17. Support & Maintenance Notes

- All core physics algorithms are modularized in `desktop-test/js/charmEngine.js`.
- Audio scheduling and hysteresis boundaries are isolated in `desktop-test/js/charmSoundManager.js`.
- State persistence utilizes standard JSON files in `%APPDATA%/CharmDrop/charmdrop-config.json`.
- The codebase contains zero external telemetry, tracking, or background analytics.

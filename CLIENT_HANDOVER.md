# CharmDrop — Client Handover & Operations Manual

**Project**: CharmDrop  
**Release**: Version 1.0.0 (Client Handover Edition)  
**Deliverables**:
1. **CharmDrop Website** (React + Vite Web Platform)
2. **CharmDrop Browser Extension** (Manifest V3 for Google Chrome & Microsoft Edge)
3. **CharmDrop Windows Desktop App** (Electron Native App for Windows 10 & 11)  
**Date**: September 2026  

---

## 1. Executive Summary: What CharmDrop Is

CharmDrop is an interactive screen companion and digital talisman platform that brings personality, motion, and serene luck to user screens.

CharmDrop is delivered across three complementary channels:
- **Windows Desktop Application**: A native always-on-top desktop widget hanging from the top edge of Windows 10 & 11 screens.
- **Browser Extension**: A Manifest V3 Chromium extension hanging charms seamlessly from the viewport top of any webpage using Shadow DOM encapsulation.
- **Companion Website**: The public hub, interactive gallery, and software distribution center.

---

## 2. Key Features Across All Platforms

- **Realistic Verlet Physics Rope**: 12-point particle chain simulation with organic breeze sway, downward gravity, and natural wave propagation.
- **Dynamic Mouse Proximity Reaction**: Approaching the charm (<= 150px) naturally sways and repulses the talisman.
- **Drag, Flick & Scroll**: Users can grab and drag the charm horizontally, flick with momentum, or scroll to oscillate.
- **Curated 13 Authentic Lucky Charms**: 100% transparent handcrafted assets (Nimbu Mirchi, Fortune Bell, Maneki Neko, Daruma, Evil Eye, Dreamcatcher, Lucky Clover, Horseshoe, Lotus, etc.).
- **Strict Sound Architecture**:
  - **Fortune Bell**: Plays `universfield-single-church-bell-2-352062.mp3` once upon receiving its first meaningful impulse, disarming during decay oscillations.
  - **Lucky Cat**: Plays `dragon-studio-cartoon-cat-meow-487661.mp3` once when cursor enters proximity zone (<= 140px), re-arming only upon full exit (> 200px).
  - **All Other 11 Charms**: Strictly silent (`sound: null`).
- **Daily Nimbu Mirchi Talisman**: A 24-hour talisman cycle that fades after 24 hours, inviting the user to hang a fresh Nimbu Mirchi daily.

---

## 3. Browser Extension Architecture & Installation (Manifest V3)

The browser extension is housed in `/extension`.

### How to Install / Load Unpacked:
1. Open **Google Chrome** or **Microsoft Edge**.
2. Navigate to:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
3. Turn on **Developer mode** (toggle in upper right or left sidebar).
4. Click **Load unpacked**.
5. Select the `extension` folder (`d:\Charmdrop\extension`).
6. The CharmDrop icon will appear in the browser toolbar.

### Technical & Security Highlights:
- **Manifest V3 Compliant**: Zero `eval()`, zero remotely hosted executable code.
- **Minimum Permissions**: Only `storage` and `activeTab`. Zero invasive permissions (`history`, `cookies`, `webRequest` are not requested).
- **Shadow DOM Isolation**: All extension DOM elements and styles are mounted inside `#charmdrop-extension-root` within an isolated Shadow Root. Host page CSS cannot alter the charm, and charm CSS cannot leak into host pages.
- **Viewport Fixed**: Anchored via `position: fixed; top: 0;` so webpage scrolling leaves the charm cleanly at the top of the browser viewport.
- **Pointer Events**: Only the charm itself has `pointer-events: auto; cursor: grab;`. All surrounding areas have `pointer-events: none;`, ensuring zero interference with webpage buttons, inputs, and links.
- **Background Tab Efficiency**: Automatically pauses the physics animation loop when `document.hidden === true`.

---

## 4. Website Functionality

The companion website is a React SPA built with Vite and Framer Motion.

- **Home (`/`)**: Hero demonstration, interactive physics showcases, 24-hour Nimbu preview, feature breakdown, social proof, and direct download links.
- **Charms Catalog (`/charms`)**: Full interactive gallery of all 13 approved Lucky charms with category filtering, real-time search, sorting, and modal previews with audio triggers.
- **How It Works (`/how-it-works`)**: Four-step walkthrough covering download, installation, charm selection, and desktop/browser interaction.
- **Download Hub (`/download`)**: Official Windows release installer link, extension instructions, and system specs.
- **About (`/about`) & Contact (`/contact`)**: Brand story, developer documentation links, support contact details, and platform specs.

---

## 5. Desktop Application Functionality

The desktop app is built with Electron and packaged using NSIS for Windows.

- **Transparent Always-on-Top Stage**: The charm hangs unobtrusively above open Windows apps.
- **Mouse Pass-Through**: Clicks outside the charm pass directly to underlying windows.
- **Single Instance Enforcement**: Prevents duplicate running instances.
- **System Tray Controls**: Preset positions (Top Left, Top Center, Top Right), Reset Position, Startup Toggle, Sound Effects Toggle.

---

## 6. System Tray Controls & Shortcuts (Desktop)

| Action | System Tray Option | Keyboard Shortcut |
| :--- | :--- | :--- |
| **Toggle Charm Selector** | Single/Double Click Icon | `Ctrl + Shift + C` |
| **Show / Hide Charm** | Checkbox: *Show Charm* | `Ctrl + Shift + H` |
| **Move to Preset** | *Position* &gt; Top Left / Center / Right | — |
| **Reset Position** | *Reset Position* | `Ctrl + Shift + R` |
| **Toggle Sound Effects** | Checkbox: *Sound Effects* | — |
| **Launch at Startup** | Checkbox: *Launch at Startup* | — |
| **About Window** | *About CharmDrop* | — |
| **Quit CharmDrop** | *Quit CharmDrop* | `Ctrl + Shift + Q` |

---

## 7. Adding a Future Charm

To register a new charm across all 3 platforms:

1. Prepare a transparent 32-bit PNG.
2. Save the asset in:
   - `src/assets/charms/lucky/your-charm.png` (Website)
   - `extension/assets/charms/lucky/your-charm.png` (Extension)
   - `desktop-test/assets/charms/lucky/your-charm.png` (Desktop)
3. Register the charm in:
   - `src/data/charmsData.js`
   - `extension/data/charms.js`
   - `desktop-test/data/charms.js`
4. Rebuild website (`npm run build`) and desktop installer (`npm run build:win` in `desktop-test/`).

---

## 8. Release Workflows

1. **Website Release**:
   ```bash
   npm run build
   ```
   Deploy `/dist` directory to your static hosting provider (Vercel, Netlify, Cloudflare Pages).

2. **Browser Extension Release**:
   Zip the contents of the `/extension` directory and submit to the **Chrome Web Store Developer Dashboard** and **Microsoft Edge Add-ons Developer Portal**.

3. **Windows Desktop Release**:
   ```bash
   cd desktop-test
   npm run build:win
   ```
   Upload `desktop-test/release/CharmDrop-Setup-1.0.0.exe` to your GitHub Releases.

---

## 9. Known System Behavior & Considerations

1. **Restricted Browser Pages**: Chrome and Edge strictly block extensions on internal system pages (`chrome://`, `edge://`, and the Chrome Web Store). The extension runs on all standard HTTP and HTTPS web pages.
2. **Windows SmartScreen Notice**: Unsigned installers display standard Windows SmartScreen notifications until signed with a digital code signing certificate.
3. **Zero Telemetry**: All three CharmDrop platforms run with 100% offline-capable local assets with zero telemetry or tracking.

const { app, BrowserWindow, screen, ipcMain, globalShortcut, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

// Register custom protocol handler for 'charmdrop://'
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('charmdrop', process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient('charmdrop');
}

let mainWindow = null;
let selectorWindow = null;
let aboutWindow = null;
let tray = null;

// Settings configuration file in Electron's safe userData directory
const SETTINGS_FILE = path.join(app.getPath('userData'), 'charmdrop-config.json');

const DEFAULT_CONFIG = {
  selectedCharmId: 'nimbu-mirchi',
  selectedCharmName: 'Nimbu Mirchi',
  charmVisible: true,
  lastWindowPosition: null, // { x, y }
  lastSelectorPosition: null, // { x, y }
  positionMode: 'top-right', // 'top-left' | 'top-center' | 'top-right' | 'custom'
  launchAtStartup: false,
  soundEffectsEnabled: true
};

let appSettings = loadSettings();

// In-memory runtime state
let isNimbuDaily = true;
let isNimbuFresh = true;
let availableCharms = [
  // Lucky
  { id: 'nimbu-mirchi', name: 'Nimbu Mirchi', category: 'Lucky' },
  { id: 'guardian-face', name: 'Guardian Face', category: 'Lucky' },
  { id: 'evil-eye', name: 'Evil Eye', category: 'Lucky' },
  { id: 'lucky-cat', name: 'Maneki Neko (Lucky Cat)', category: 'Lucky' },
  { id: 'four-leaf-clover', name: 'Four Leaf Clover', category: 'Lucky' },
  { id: 'lucky-bell', name: 'Fortune Bell', category: 'Lucky' },
  { id: 'daruma', name: 'Daruma', category: 'Lucky' },
  { id: 'lucky-clover', name: 'Lucky Clover', category: 'Lucky' },
  { id: 'dreamcatcher', name: 'Dreamcatcher', category: 'Lucky' },
  { id: 'lucky-horseshoe', name: 'Lucky Horseshoe', category: 'Lucky' },
  { id: 'red-lucky-knot', name: 'Red Lucky Knot', category: 'Lucky' },
  { id: 'yin-yang', name: 'Yin Yang', category: 'Lucky' },
  { id: 'lucky-lotus', name: 'Lucky Lotus', category: 'Lucky' }
];

const APPROVED_CHARM_IDS = new Set(availableCharms.map((c) => c.id));

/**
 * Safely parses and strictly validates charmdrop:// protocol URLs.
 */
function extractCharmIdFromProtocolUrl(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return null;
  let trimmed = urlStr.trim().replace(/^["']|["']$/g, '').trim();
  if (!trimmed.toLowerCase().startsWith('charmdrop:')) return null;

  try {
    if (!trimmed.toLowerCase().startsWith('charmdrop://')) {
      trimmed = trimmed.replace(/^charmdrop:(\/\/)?/i, 'charmdrop://');
    }
    const parsed = new URL(trimmed);
    let candidate = '';
    if (parsed.hostname === 'charm') {
      candidate = parsed.pathname.replace(/^\/+|\/+$/g, '');
    } else if (parsed.hostname && APPROVED_CHARM_IDS.has(parsed.hostname.toLowerCase())) {
      candidate = parsed.hostname;
    } else {
      candidate = parsed.pathname.replace(/^\/+|\/+$/g, '').split('/')[0];
    }
    candidate = candidate.toLowerCase().trim();
    if (APPROVED_CHARM_IDS.has(candidate)) {
      return candidate;
    }
  } catch (err) {
    const match = trimmed.match(/^charmdrop:\/\/(?:charm\/)?([a-z0-9-]+)\/?$/i);
    if (match) {
      const candidate = match[1].toLowerCase().trim();
      if (APPROVED_CHARM_IDS.has(candidate)) {
        return candidate;
      }
    }
  }
  return null;
}

/**
 * Finds deep link URL argument from process.argv or second-instance commandLine
 */
function findProtocolCharmInArgv(argv) {
  if (!Array.isArray(argv)) return null;
  for (const arg of argv) {
    if (typeof arg === 'string') {
      const trimmed = arg.trim().replace(/^["']|["']$/g, '').trim();
      if (trimmed.toLowerCase().startsWith('charmdrop:')) {
        const validId = extractCharmIdFromProtocolUrl(trimmed);
        if (validId) return validId;
      }
    }
  }
  return null;
}

/**
 * Applies a validated deep link charm
 */
function applyDeepLinkedCharm(charmId) {
  if (!charmId || !APPROVED_CHARM_IDS.has(charmId)) return;

  const charmObj = availableCharms.find((c) => c.id === charmId);
  const charmName = charmObj ? charmObj.name : charmId;

  saveSettings({
    selectedCharmId: charmId,
    selectedCharmName: charmName,
    charmVisible: true
  });

  if (mainWindow && !mainWindow.isDestroyed()) {
    if (!mainWindow.isVisible()) {
      mainWindow.show();
    }
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.webContents.send('switch-charm', charmId);
  }
  if (selectorWindow && !selectorWindow.isDestroyed()) {
    selectorWindow.webContents.send('switch-charm', charmId);
  }
  buildTrayMenu();
}

/**
 * Applies a charm selected from UI / Tray
 */
function applySelectedCharm(charmId) {
  if (!charmId || !APPROVED_CHARM_IDS.has(charmId)) return;
  const charmObj = availableCharms.find((c) => c.id === charmId);
  const charmName = charmObj ? charmObj.name : charmId;

  appSettings.selectedCharmId = charmId;
  appSettings.selectedCharmName = charmName;
  saveSettings({
    selectedCharmId: charmId,
    selectedCharmName: charmName
  });

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('switch-charm', charmId);
  }
  if (selectorWindow && !selectorWindow.isDestroyed()) {
    selectorWindow.webContents.send('switch-charm', charmId);
  }
  buildTrayMenu();
}

// Window Dimensions
const WINDOW_WIDTH = 340;
const WINDOW_HEIGHT = 440;
const SELECTOR_WIDTH = 270;
const SELECTOR_HEIGHT = 440;

/**
 * Load persistent settings from disk
 */
function loadSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
      return { ...DEFAULT_CONFIG, ...data };
    }
  } catch (err) {
    console.warn('Failed to read settings file, using defaults:', err);
  }
  return { ...DEFAULT_CONFIG };
}

/**
 * Save persistent settings to disk
 */
function saveSettings(updates = {}) {
  try {
    appSettings = { ...appSettings, ...updates };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(appSettings, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

/**
 * Gets the current active display where the charm window is located
 */
function getCurrentDisplay() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    const [currX, currY] = mainWindow.getPosition();
    return screen.getDisplayNearestPoint({ x: currX + (WINDOW_WIDTH / 2), y: currY });
  }
  return screen.getPrimaryDisplay();
}

/**
 * Normalizes preset names reliably across different callers ('left'/'top-left', etc.)
 */
function normalizePreset(preset) {
  if (!preset) return 'top-right';
  const p = String(preset).toLowerCase().trim();
  if (p.includes('left')) return 'top-left';
  if (p.includes('center') || p.includes('mid')) return 'top-center';
  return 'top-right';
}

/**
 * Calculates preset position coordinates dynamically based on display workArea
 */
function calculatePresetPosition(preset, targetDisplay = null) {
  const display = targetDisplay || getCurrentDisplay();
  const wa = display.workArea;
  const y = wa.y; // Keep charm attached to top work area
  const normalized = normalizePreset(preset);
  let x;

  switch (normalized) {
    case 'top-left':
      x = Math.round(wa.x + 24);
      break;
    case 'top-center':
      x = Math.round(wa.x + (wa.width - WINDOW_WIDTH) / 2);
      break;
    case 'top-right':
    default:
      x = Math.round(wa.x + wa.width - WINDOW_WIDTH - 60);
      break;
  }

  return { x, y };
}

function getDefaultTopRightPosition() {
  return calculatePresetPosition('top-right', screen.getPrimaryDisplay());
}

/**
 * Validates saved charm position against current active displays
 */
function getValidatedPosition(savedPos) {
  if (!savedPos || typeof savedPos.x !== 'number' || typeof savedPos.y !== 'number') {
    return getDefaultTopRightPosition();
  }

  const displays = screen.getAllDisplays();
  const isInside = displays.some((d) => {
    const wa = d.workArea;
    return (
      savedPos.x >= wa.x - (WINDOW_WIDTH / 2) &&
      savedPos.x <= (wa.x + wa.width - 60) &&
      savedPos.y >= wa.y &&
      savedPos.y <= (wa.y + wa.height - 60)
    );
  });

  if (isInside) {
    return { x: Math.round(savedPos.x), y: Math.round(savedPos.y) };
  }

  return getDefaultTopRightPosition();
}

/**
 * Validates saved selector card position against current active displays
 */
function getValidatedSelectorPosition(savedPos) {
  if (!savedPos || typeof savedPos.x !== 'number' || typeof savedPos.y !== 'number') {
    const primary = screen.getPrimaryDisplay();
    const wa = primary.workArea;
    return {
      x: Math.round(wa.x + wa.width - SELECTOR_WIDTH - 30),
      y: Math.round(wa.y + 70)
    };
  }

  const displays = screen.getAllDisplays();
  const isInside = displays.some((d) => {
    const wa = d.workArea;
    return (
      savedPos.x >= wa.x - 50 &&
      savedPos.x <= wa.x + wa.width - 100 &&
      savedPos.y >= wa.y &&
      savedPos.y <= wa.y + wa.height - 100
    );
  });

  if (isInside) {
    return { x: Math.round(savedPos.x), y: Math.round(savedPos.y) };
  }

  const primary = screen.getPrimaryDisplay();
  const wa = primary.workArea;
  return {
    x: Math.round(wa.x + wa.width - SELECTOR_WIDTH - 30),
    y: Math.round(wa.y + 70)
  };
}

let presetAnimationTimer = null;

/**
 * Smoothly transitions the charm window horizontally to a preset position over ~220ms
 * Leaves the selector card window completely stationary at its user-chosen location
 */
function setPositionPreset(presetName) {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  if (!mainWindow.isVisible()) {
    mainWindow.show();
  }

  const normalizedPreset = normalizePreset(presetName);
  const targetPos = calculatePresetPosition(normalizedPreset);
  const [startX, startY] = mainWindow.getPosition();
  const targetX = targetPos.x;
  const targetY = targetPos.y;

  // Immediately persist setting to disk
  saveSettings({
    positionMode: normalizedPreset,
    lastWindowPosition: { x: targetX, y: targetY }
  });
  buildTrayMenu();

  // Broadcast to selector window immediately
  if (selectorWindow && !selectorWindow.isDestroyed()) {
    selectorWindow.webContents.send('position-preset-applied', { preset: normalizedPreset, direction: 0, x: targetX, y: targetY });
  }

  if (startX === targetX && startY === targetY) {
    sendToRenderer('position-preset-applied', { preset: normalizedPreset, direction: 0, x: targetX, y: targetY });
    return;
  }

  if (presetAnimationTimer) {
    clearInterval(presetAnimationTimer);
    presetAnimationTimer = null;
  }

  const moveDirection = targetX > startX ? 1 : -1;
  sendToRenderer('position-preset-moving', { preset: normalizedPreset, direction: moveDirection });

  const duration = 220; // 220ms smooth transition
  const startTime = Date.now();

  presetAnimationTimer = setInterval(() => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      clearInterval(presetAnimationTimer);
      presetAnimationTimer = null;
      return;
    }

    const elapsed = Date.now() - startTime;
    const progress = Math.min(1, elapsed / duration);

    // Ease-out cubic: 1 - (1 - t)^3
    const ease = 1 - Math.pow(1 - progress, 3);
    const currentX = Math.round(startX + (targetX - startX) * ease);
    const currentY = Math.round(startY + (targetY - startY) * ease);

    mainWindow.setPosition(currentX, currentY);

    if (progress >= 1) {
      clearInterval(presetAnimationTimer);
      presetAnimationTimer = null;
      mainWindow.setPosition(targetX, targetY);

      sendToRenderer('position-preset-applied', {
        preset: normalizedPreset,
        direction: moveDirection,
        x: targetX,
        y: targetY
      });
    }
  }, 16);
}

function resetWindowPosition() {
  if (!mainWindow) return;
  setPositionPreset('top-right');
}

function toggleWindowVisibility() {
  if (!mainWindow) return;
  const newVisible = !mainWindow.isVisible();
  if (newVisible) {
    mainWindow.show();
  } else {
    mainWindow.hide();
  }
  saveSettings({ charmVisible: newVisible });
  buildTrayMenu();
}

function setLaunchAtStartup(enable) {
  saveSettings({ launchAtStartup: enable });

  if (app.isPackaged) {
    app.setLoginItemSettings({
      openAtLogin: enable,
      openAsHidden: true,
      path: process.execPath,
      args: ['--hidden']
    });
  } else {
    console.log(`[Dev Mode] Launch at startup preference stored as: ${enable}`);
  }
  buildTrayMenu();
}

function setSoundEffectsEnabled(enable) {
  saveSettings({ soundEffectsEnabled: enable });
  buildTrayMenu();
  sendToRenderer('sound-effects-toggled', enable);
}

function sendToRenderer(channel, ...args) {
  if (mainWindow && mainWindow.webContents && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, ...args);
  }
}

let cursorPollingInterval = null;

function startCursorPolling() {
  if (cursorPollingInterval) return;
  cursorPollingInterval = setInterval(() => {
    if (mainWindow && !mainWindow.isDestroyed() && mainWindow.isVisible()) {
      const cursorPoint = screen.getCursorScreenPoint();
      const [winX, winY] = mainWindow.getPosition();
      const localX = cursorPoint.x - winX;
      const localY = cursorPoint.y - winY;
      mainWindow.webContents.send('cursor-position-update', {
        screenX: cursorPoint.x,
        screenY: cursorPoint.y,
        localX,
        localY
      });
    }
  }, 20); // 50 Hz smooth polling
}

function stopCursorPolling() {
  if (cursorPollingInterval) {
    clearInterval(cursorPollingInterval);
    cursorPollingInterval = null;
  }
}

/**
 * Creates the Hanging Charm Desktop Window (Window 1)
 */
function createWindow() {
  const initialPos = getValidatedPosition(appSettings.lastWindowPosition);
  const appIconPath = path.join(__dirname, 'assets', 'icons', 'charmdrop.ico');

  mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    x: initialPos.x,
    y: initialPos.y,
    icon: fs.existsSync(appIconPath) ? appIconPath : undefined,
    show: appSettings.charmVisible !== false,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  if (mainWindow.setVisibleOnAllWorkspaces) {
    mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  }

  mainWindow.loadFile('index.html');

  startCursorPolling();

  // Handle transparent click-through for hanging charm window
  ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win && !win.isDestroyed()) {
      win.setIgnoreMouseEvents(ignore, options || { forward: true });
    }
  });

  // Handle horizontal charm dragging (Moves Charm Window ONLY)
  ipcMain.on('move-window-by', (event, deltaX) => {
    if (presetAnimationTimer) {
      clearInterval(presetAnimationTimer);
      presetAnimationTimer = null;
    }
    if (mainWindow && !mainWindow.isDestroyed()) {
      const [currX, currY] = mainWindow.getPosition();
      const currentDisplay = screen.getDisplayNearestPoint({ x: currX + (WINDOW_WIDTH / 2), y: currY });
      const wa = currentDisplay.workArea;

      // Ensure charm window stays anchored to top work area while allowing free horizontal movement
      const minX = wa.x - (WINDOW_WIDTH / 2) + 50;
      const maxX = wa.x + wa.width - (WINDOW_WIDTH / 2) - 50;
      const newX = Math.round(Math.max(minX, Math.min(maxX, currX + deltaX)));

      mainWindow.setPosition(newX, wa.y);
    }
  });

  // Handle saving charm window position on drag release
  ipcMain.on('save-window-position', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      const [currX, currY] = mainWindow.getPosition();
      saveSettings({
        lastWindowPosition: { x: currX, y: currY },
        positionMode: 'custom'
      });
      buildTrayMenu();
    }
  });

  // Handle setting preset position
  ipcMain.on('set-position-preset', (event, preset) => {
    setPositionPreset(preset);
  });

  // Handle position reset request
  ipcMain.on('reset-position', () => {
    resetWindowPosition();
  });

  // Handle quit request
  ipcMain.on('quit-app', () => {
    safeQuitApp();
  });

  // Handle sound effects toggle
  ipcMain.on('set-sound-effects-enabled', (event, enable) => {
    setSoundEffectsEnabled(enable);
  });

  // Handle real-time state sync from renderer
  ipcMain.on('charm-state-updated', (event, state) => {
    if (state) {
      if (state.selectedCharmId) {
        appSettings.selectedCharmId = state.selectedCharmId;
      }
      if (state.charmName) {
        appSettings.selectedCharmName = state.charmName;
      }
      if (state.positionMode) {
        appSettings.positionMode = state.positionMode;
      }
      if (state.isFresh !== undefined) isNimbuFresh = state.isFresh;
      if (state.dailyRefresh !== undefined) isNimbuDaily = state.dailyRefresh;
      if (state.charms && Array.isArray(state.charms)) {
        availableCharms = state.charms;
      }
      saveSettings({
        selectedCharmId: appSettings.selectedCharmId,
        selectedCharmName: appSettings.selectedCharmName,
        positionMode: appSettings.positionMode
      });
      buildTrayMenu();
    }
  });

  // Handle display metrics changes
  const checkDisplays = () => {
    if (!mainWindow) return;
    const [currX, currY] = mainWindow.getPosition();
    const validated = getValidatedPosition({ x: currX, y: currY });
    if (validated.x !== currX || validated.y !== currY) {
      mainWindow.setPosition(validated.x, validated.y);
      saveSettings({ lastWindowPosition: validated });
    }
  };

  screen.on('display-added', checkDisplays);
  screen.on('display-removed', checkDisplays);
  screen.on('display-metrics-changed', checkDisplays);

  mainWindow.on('show', () => {
    saveSettings({ charmVisible: true });
    buildTrayMenu();
  });

  mainWindow.on('hide', () => {
    saveSettings({ charmVisible: false });
    buildTrayMenu();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * Creates the Select Charm Card Window (Window 2)
 */
function createSelectorWindow() {
  if (selectorWindow && !selectorWindow.isDestroyed()) return;

  const initialPos = getValidatedSelectorPosition(appSettings.lastSelectorPosition);
  const appIconPath = path.join(__dirname, 'assets', 'icons', 'charmdrop.ico');

  selectorWindow = new BrowserWindow({
    width: SELECTOR_WIDTH,
    height: SELECTOR_HEIGHT,
    x: initialPos.x,
    y: initialPos.y,
    icon: fs.existsSync(appIconPath) ? appIconPath : undefined,
    show: false,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  selectorWindow.setAlwaysOnTop(true, 'screen-saver');
  if (selectorWindow.setVisibleOnAllWorkspaces) {
    selectorWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  }

  selectorWindow.loadFile('selector.html');

  selectorWindow.on('closed', () => {
    selectorWindow = null;
  });
}

/**
 * Toggles the Select Charm Card Window on Ctrl+Shift+C or Tray click
 */
function toggleSelectorWindow() {
  if (!selectorWindow || selectorWindow.isDestroyed()) {
    createSelectorWindow();
    selectorWindow.once('ready-to-show', () => {
      selectorWindow.show();
      selectorWindow.focus();
    });
    return;
  }

  if (selectorWindow.isVisible()) {
    selectorWindow.hide();
  } else {
    selectorWindow.show();
    selectorWindow.focus();
  }
}

// Selector Card Drag & IPC Communication Handlers
ipcMain.on('move-selector-window-by', (event, { deltaX, deltaY }) => {
  if (selectorWindow && !selectorWindow.isDestroyed()) {
    const [currX, currY] = selectorWindow.getPosition();
    const currentDisplay = screen.getDisplayNearestPoint({ x: currX + (SELECTOR_WIDTH / 2), y: currY + (SELECTOR_HEIGHT / 2) });
    const wa = currentDisplay.workArea;

    // Clamp selector card within display work area boundaries
    const minX = wa.x;
    const maxX = wa.x + wa.width - SELECTOR_WIDTH;
    const minY = wa.y;
    const maxY = wa.y + wa.height - 180;

    const newX = Math.round(Math.max(minX, Math.min(maxX, currX + deltaX)));
    const newY = Math.round(Math.max(minY, Math.min(maxY, currY + deltaY)));

    selectorWindow.setPosition(newX, newY);
  }
});

ipcMain.on('save-selector-position', () => {
  if (selectorWindow && !selectorWindow.isDestroyed()) {
    const [currX, currY] = selectorWindow.getPosition();
    saveSettings({
      lastSelectorPosition: { x: currX, y: currY }
    });
  }
});

ipcMain.on('close-selector-window', () => {
  if (selectorWindow && !selectorWindow.isDestroyed()) {
    selectorWindow.hide();
  }
});

ipcMain.on('switch-charm-from-selector', (event, charmId) => {
  applySelectedCharm(charmId);
});

ipcMain.on('hang-new-nimbu-request', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('hang-new-nimbu');
  }
  if (selectorWindow && !selectorWindow.isDestroyed()) {
    selectorWindow.webContents.send('hang-new-nimbu');
  }
});

ipcMain.on('simulate-next-day-request', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('simulate-next-day');
  }
  if (selectorWindow && !selectorWindow.isDestroyed()) {
    selectorWindow.webContents.send('simulate-next-day');
  }
});

function openAboutWindow() {
  if (aboutWindow && !aboutWindow.isDestroyed()) {
    aboutWindow.show();
    aboutWindow.focus();
    return;
  }

  const appIconPath = path.join(__dirname, 'assets', 'icons', 'charmdrop.ico');

  aboutWindow = new BrowserWindow({
    width: 320,
    height: 410,
    title: 'About CharmDrop',
    icon: fs.existsSync(appIconPath) ? appIconPath : undefined,
    resizable: false,
    maximizable: false,
    minimizable: false,
    alwaysOnTop: true,
    show: false,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  aboutWindow.loadFile('about.html');

  aboutWindow.once('ready-to-show', () => {
    aboutWindow.show();
    aboutWindow.focus();
  });

  aboutWindow.on('closed', () => {
    aboutWindow = null;
  });
}

function safeQuitApp() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    const [currX, currY] = mainWindow.getPosition();
    saveSettings({
      lastWindowPosition: { x: currX, y: currY },
      charmVisible: mainWindow.isVisible()
    });
  }
  if (selectorWindow && !selectorWindow.isDestroyed()) {
    const [selX, selY] = selectorWindow.getPosition();
    saveSettings({
      lastSelectorPosition: { x: selX, y: selY }
    });
    selectorWindow.destroy();
    selectorWindow = null;
  }
  if (presetAnimationTimer) {
    clearInterval(presetAnimationTimer);
    presetAnimationTimer = null;
  }
  stopCursorPolling();
  globalShortcut.unregisterAll();
  if (tray && !tray.isDestroyed()) {
    tray.destroy();
    tray = null;
  }
  if (aboutWindow && !aboutWindow.isDestroyed()) {
    aboutWindow.destroy();
    aboutWindow = null;
  }
  app.quit();
}

function buildTrayMenu() {
  if (!tray) return;

  const isVisible = mainWindow ? mainWindow.isVisible() : (appSettings.charmVisible !== false);
  const currentName = appSettings.selectedCharmName || 'Nimbu Mirchi';
  const currentId = appSettings.selectedCharmId || 'nimbu-mirchi';
  const currentPosMode = appSettings.positionMode || 'top-right';

  const categories = ['Lucky'];
  const categorySubmenus = [];

  for (const cat of categories) {
    const charmsInCat = availableCharms.filter((c) => (c.category || 'Lucky').toLowerCase() === cat.toLowerCase());
    if (charmsInCat.length > 0) {
      categorySubmenus.push({
        label: cat,
        submenu: charmsInCat.map((charm) => ({
          label: charm.name,
          type: 'radio',
          checked: charm.id === currentId,
          click: () => {
            applySelectedCharm(charm.id);
          }
        }))
      });
    }
  }

  const menuTemplate = [
    {
      label: `CharmDrop — ${currentName}`,
      enabled: false
    },
    { type: 'separator' },
    {
      label: 'Choose Charm...',
      accelerator: 'CmdOrCtrl+Shift+C',
      click: () => {
        toggleSelectorWindow();
      }
    },
    {
      label: 'Lucky Charms',
      submenu: categorySubmenus.length > 0 && categorySubmenus[0].submenu ? categorySubmenus[0].submenu : []
    },
    { type: 'separator' },
    {
      label: isVisible ? 'Hide Charm' : 'Show Charm',
      accelerator: 'CmdOrCtrl+Shift+H',
      click: () => {
        toggleWindowVisibility();
      }
    },
    {
      label: 'Position Presets',
      submenu: [
        {
          label: 'Top Left',
          type: 'radio',
          checked: currentPosMode === 'top-left',
          click: () => {
            setPositionPreset('top-left');
          }
        },
        {
          label: 'Top Center',
          type: 'radio',
          checked: currentPosMode === 'top-center',
          click: () => {
            setPositionPreset('top-center');
          }
        },
        {
          label: 'Top Right (Default)',
          type: 'radio',
          checked: currentPosMode === 'top-right',
          click: () => {
            setPositionPreset('top-right');
          }
        },
        { type: 'separator' },
        {
          label: 'Reset to Top Right',
          accelerator: 'CmdOrCtrl+Shift+R',
          click: () => {
            resetWindowPosition();
          }
        }
      ]
    },
    { type: 'separator' },
    {
      label: 'Sound Effects',
      type: 'checkbox',
      checked: appSettings.soundEffectsEnabled !== false,
      click: (menuItem) => {
        setSoundEffectsEnabled(menuItem.checked);
      }
    },
    {
      label: 'Launch at Startup',
      type: 'checkbox',
      checked: !!appSettings.launchAtStartup,
      click: (menuItem) => {
        setLaunchAtStartup(menuItem.checked);
      }
    }
  ];

  if (!app.isPackaged || process.env.NODE_ENV === 'development') {
    menuTemplate.push({ type: 'separator' });
    menuTemplate.push({
      label: 'Developer Tools',
      submenu: [
        {
          label: 'Simulate Nimbu Next Day',
          click: () => {
            if (mainWindow && !mainWindow.isVisible()) mainWindow.show();
            sendToRenderer('simulate-next-day');
            if (selectorWindow && !selectorWindow.isDestroyed()) {
              selectorWindow.webContents.send('simulate-next-day');
            }
          }
        },
        {
          label: 'Open DevTools',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.openDevTools({ mode: 'detach' });
            }
          }
        }
      ]
    });
  }

  menuTemplate.push({ type: 'separator' });
  menuTemplate.push({
    label: 'About CharmDrop',
    click: () => {
      openAboutWindow();
    }
  });
  menuTemplate.push({
    label: 'Quit CharmDrop',
    click: () => {
      safeQuitApp();
    }
  });

  const contextMenu = Menu.buildFromTemplate(menuTemplate);
  tray.setContextMenu(contextMenu);
  tray.setToolTip('CharmDrop — Your Desktop. Your Vibe.');
}

function createTray() {
  try {
    const iconPath = path.join(__dirname, 'assets', 'tray', 'charmdrop-tray.png');
    let trayIcon = nativeImage.createFromPath(iconPath);
    trayIcon = trayIcon.resize({ width: 20, height: 20 });

    tray = new Tray(trayIcon);
    buildTrayMenu();

    // Single left click on tray icon toggles the compact Charm Selector
    tray.on('click', () => {
      toggleSelectorWindow();
    });

    // Double click also toggles selector
    tray.on('double-click', () => {
      toggleSelectorWindow();
    });
  } catch (err) {
    console.error('Tray creation error:', err);
  }
}

function registerShortcuts() {
  // Ctrl + Shift + Q -> Quit
  globalShortcut.register('CommandOrControl+Shift+Q', () => {
    safeQuitApp();
  });

  // Ctrl + Shift + H -> Toggle Hide/Show
  globalShortcut.register('CommandOrControl+Shift+H', () => {
    toggleWindowVisibility();
  });

  // Ctrl + Shift + R -> Reset position
  globalShortcut.register('CommandOrControl+Shift+R', () => {
    resetWindowPosition();
  });

  // Ctrl + Shift + C -> Toggle Charm Selector Card
  globalShortcut.register('CommandOrControl+Shift+C', () => {
    toggleSelectorWindow();
  });
}

// IPC Handlers for About Window and App Info
ipcMain.on('close-about-window', () => {
  if (aboutWindow && !aboutWindow.isDestroyed()) {
    aboutWindow.close();
  }
});

ipcMain.on('open-about-window', () => {
  openAboutWindow();
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-initial-charm-id', () => {
  return appSettings.selectedCharmId || 'nimbu-mirchi';
});

// Enforce single instance lock
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  // Warm start deep link handler: existing instance receives command line from second instance
  app.on('second-instance', (event, commandLine) => {
    const deepLinkedCharmId = findProtocolCharmInArgv(commandLine);
    if (deepLinkedCharmId) {
      applyDeepLinkedCharm(deepLinkedCharmId);
    } else {
      if (mainWindow) {
        if (!mainWindow.isVisible()) {
          mainWindow.show();
        }
        if (mainWindow.isMinimized()) {
          mainWindow.restore();
        }
        mainWindow.focus();
      }
      toggleSelectorWindow();
    }
  });

  // Cross-platform open-url handler
  app.on('open-url', (event, url) => {
    event.preventDefault();
    const validId = extractCharmIdFromProtocolUrl(url);
    if (validId) {
      applyDeepLinkedCharm(validId);
    }
  });

  app.whenReady().then(() => {
    // Cold start deep link handler: inspect process.argv on initial launch
    const coldStartCharmId = findProtocolCharmInArgv(process.argv);
    if (coldStartCharmId) {
      const charmObj = availableCharms.find((c) => c.id === coldStartCharmId);
      appSettings.selectedCharmId = coldStartCharmId;
      if (charmObj) appSettings.selectedCharmName = charmObj.name;
      saveSettings({
        selectedCharmId: coldStartCharmId,
        selectedCharmName: appSettings.selectedCharmName,
        charmVisible: true
      });
    }

    createWindow();
    createSelectorWindow();
    createTray();
    registerShortcuts();

    if (coldStartCharmId && mainWindow && mainWindow.webContents) {
      mainWindow.webContents.once('did-finish-load', () => {
        applyDeepLinkedCharm(coldStartCharmId);
      });
    }

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
        createSelectorWindow();
      }
    });
  });

  app.on('before-quit', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      const [currX, currY] = mainWindow.getPosition();
      saveSettings({
        lastWindowPosition: { x: currX, y: currY },
        charmVisible: mainWindow.isVisible()
      });
    }
    if (selectorWindow && !selectorWindow.isDestroyed()) {
      const [selX, selY] = selectorWindow.getPosition();
      saveSettings({
        lastSelectorPosition: { x: selX, y: selY }
      });
    }
    if (presetAnimationTimer) {
      clearInterval(presetAnimationTimer);
      presetAnimationTimer = null;
    }
    stopCursorPolling();
    if (tray && !tray.isDestroyed()) {
      tray.destroy();
      tray = null;
    }
  });

  app.on('will-quit', () => {
    globalShortcut.unregisterAll();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}

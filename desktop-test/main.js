const { app, BrowserWindow, screen, ipcMain, globalShortcut, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;
let tray = null;

// Settings configuration file in Electron's safe userData directory
const SETTINGS_FILE = path.join(app.getPath('userData'), 'charmdrop-config.json');

const DEFAULT_CONFIG = {
  selectedCharmId: 'nimbu-mirchi',
  selectedCharmName: 'Nimbu Mirchi',
  charmVisible: true,
  lastWindowPosition: null, // { x, y }
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

// Canvas dimensions
const WINDOW_WIDTH = 340;
const WINDOW_HEIGHT = 440;

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
 * Gets the current active display where the window is located
 */
function getCurrentDisplay() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    const [currX, currY] = mainWindow.getPosition();
    return screen.getDisplayNearestPoint({ x: currX + (WINDOW_WIDTH / 2), y: currY });
  }
  return screen.getPrimaryDisplay();
}

/**
 * Calculates preset position coordinates dynamically based on display workArea
 * @param {'top-left' | 'top-center' | 'top-right'} preset
 * @param {Electron.Display} [targetDisplay]
 */
function calculatePresetPosition(preset, targetDisplay = null) {
  const display = targetDisplay || getCurrentDisplay();
  const wa = display.workArea;
  const y = wa.y; // Keep charm attached to top work area
  let x;

  switch (preset) {
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

/**
 * Default upper-right position on the primary display
 */
function getDefaultTopRightPosition() {
  return calculatePresetPosition('top-right', screen.getPrimaryDisplay());
}

/**
 * Validates saved position against current active displays (handles monitor disconnects & resolution changes)
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

let presetAnimationTimer = null;

/**
 * Smoothly transitions the window horizontally to a preset position over ~280ms
 * @param {'top-left' | 'top-center' | 'top-right'} presetName
 */
function setPositionPreset(presetName) {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  if (!mainWindow.isVisible()) {
    mainWindow.show();
  }

  const targetPos = calculatePresetPosition(presetName);
  const [startX, startY] = mainWindow.getPosition();
  const targetX = targetPos.x;
  const targetY = targetPos.y;

  if (startX === targetX && startY === targetY) {
    saveSettings({
      positionMode: presetName,
      lastWindowPosition: { x: targetX, y: targetY }
    });
    buildTrayMenu();
    sendToRenderer('position-preset-applied', { preset: presetName, direction: 0, x: targetX, y: targetY });
    return;
  }

  if (presetAnimationTimer) {
    clearInterval(presetAnimationTimer);
    presetAnimationTimer = null;
  }

  const moveDirection = targetX > startX ? 1 : -1;
  // Notify renderer that preset move started -> suspend proximity dance
  sendToRenderer('position-preset-moving', { preset: presetName, direction: moveDirection });

  const duration = 280; // 280ms smooth transition
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

      saveSettings({
        positionMode: presetName,
        lastWindowPosition: { x: targetX, y: targetY }
      });
      buildTrayMenu();

      // Notify renderer that movement completed -> trigger settling swing and resume idle/proximity
      sendToRenderer('position-preset-applied', {
        preset: presetName,
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

  // Handle transparent click-through
  ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win && !win.isDestroyed()) {
      win.setIgnoreMouseEvents(ignore, options || { forward: true });
    }
  });

  // Handle horizontal dragging & position persistence
  ipcMain.on('move-window-by', (event, deltaX) => {
    if (presetAnimationTimer) {
      clearInterval(presetAnimationTimer);
      presetAnimationTimer = null;
    }
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win && !win.isDestroyed()) {
      const [currX, currY] = win.getPosition();
      const currentDisplay = screen.getDisplayNearestPoint({ x: currX + (WINDOW_WIDTH / 2), y: currY });
      const wa = currentDisplay.workArea;

      // Ensure charm window stays anchored to top work area while allowing free horizontal movement
      const minX = wa.x - (WINDOW_WIDTH / 2) + 50;
      const maxX = wa.x + wa.width - (WINDOW_WIDTH / 2) - 50;
      const newX = Math.round(Math.max(minX, Math.min(maxX, currX + deltaX)));

      win.setPosition(newX, wa.y);
    }
  });

  // Handle saving window position on drag release
  ipcMain.on('save-window-position', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win && !win.isDestroyed()) {
      const [currX, currY] = win.getPosition();
      saveSettings({
        lastWindowPosition: { x: currX, y: currY },
        positionMode: 'custom'
      });
      buildTrayMenu();
      sendToRenderer('position-mode-updated', 'custom');
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
    app.quit();
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

let aboutWindow = null;

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

  // Group available charms into category submenus (Only include categories with available charms)
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
            sendToRenderer('switch-charm', charm.id);
          }
        }))
      });
    }
  }

  // Fallback flat list if categories not yet populated
  const charmSubmenu = categorySubmenus.length > 0 ? categorySubmenus : availableCharms.map((charm) => ({
    label: charm.name,
    type: 'radio',
    checked: charm.id === currentId,
    click: () => {
      sendToRenderer('switch-charm', charm.id);
    }
  }));

  // Position Presets Submenu
  const positionSubmenu = [
    {
      label: 'Top Left',
      type: 'radio',
      checked: currentPosMode === 'top-left',
      click: () => setPositionPreset('top-left')
    },
    {
      label: 'Top Center',
      type: 'radio',
      checked: currentPosMode === 'top-center',
      click: () => setPositionPreset('top-center')
    },
    {
      label: 'Top Right',
      type: 'radio',
      checked: currentPosMode === 'top-right',
      click: () => setPositionPreset('top-right')
    }
  ];

  // 1. Final Tray Menu Order
  const menuTemplate = [
    { label: 'CharmDrop', enabled: false },
    { type: 'separator' },
    { label: `Current Charm: ${currentName}`, enabled: false },
    {
      label: 'Change Charm',
      submenu: charmSubmenu
    },
    {
      label: 'Position',
      submenu: positionSubmenu
    },
    { type: 'separator' },
    {
      label: 'Show Charm',
      type: 'checkbox',
      checked: isVisible,
      click: () => {
        toggleWindowVisibility();
      }
    },
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
    },
    { type: 'separator' },
    {
      label: 'Reset Position',
      click: () => {
        resetWindowPosition();
      }
    }
  ];

  // 8. Daily Nimbu contextual menu (ONLY when Nimbu Mirchi is selected)
  if (currentId === 'nimbu-mirchi') {
    menuTemplate.push({ type: 'separator' });
    menuTemplate.push({
      label: `Nimbu Status: ${isNimbuFresh ? 'Fresh' : 'Completed'}`,
      enabled: false
    });
    if (!isNimbuFresh) {
      menuTemplate.push({
        label: 'Hang New Nimbu Mirchi',
        click: () => {
          if (mainWindow && !mainWindow.isVisible()) mainWindow.show();
          sendToRenderer('hang-new-nimbu');
        }
      });
    }
  }

  // Developer Submenu (Unpackaged / Dev Mode only, isolated from normal user items)
  if (!app.isPackaged) {
    menuTemplate.push({ type: 'separator' });
    menuTemplate.push({
      label: 'Developer Tools',
      submenu: [
        {
          label: 'Simulate Nimbu Next Day',
          click: () => {
            if (mainWindow && !mainWindow.isVisible()) mainWindow.show();
            sendToRenderer('simulate-next-day');
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
      if (mainWindow) {
        if (!mainWindow.isVisible()) {
          mainWindow.show();
        }
        sendToRenderer('toggle-charm-selector');
      }
    });

    // Double click also toggles selector
    tray.on('double-click', () => {
      if (mainWindow) {
        if (!mainWindow.isVisible()) {
          mainWindow.show();
        }
        sendToRenderer('toggle-charm-selector');
      }
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

  // Ctrl + Shift + C -> Toggle Charm Selector Panel
  globalShortcut.register('CommandOrControl+Shift+C', () => {
    if (mainWindow && !mainWindow.isVisible()) {
      mainWindow.show();
    }
    sendToRenderer('toggle-charm-selector');
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

ipcMain.on('set-sound-effects-enabled', (event, enabled) => {
  setSoundEffectsEnabled(enabled);
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

// Enforce single instance lock
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (!mainWindow.isVisible()) {
        mainWindow.show();
      }
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
      sendToRenderer('toggle-charm-selector');
    }
  });

  app.whenReady().then(() => {
    createWindow();
    createTray();
    registerShortcuts();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
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

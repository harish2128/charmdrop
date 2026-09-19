const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Mouse click-through control
  setIgnoreMouseEvents: (ignore, options) => {
    ipcRenderer.send('set-ignore-mouse-events', ignore, options);
  },

  // Hanging Charm Window Drag & Position (OBJECT A)
  moveCharmWindow: (deltaX, deltaY) => {
    if (typeof deltaX === 'object') {
      ipcRenderer.send('move-charm-window', deltaX);
    } else {
      ipcRenderer.send('move-charm-window', { deltaX, deltaY: deltaY || 0 });
    }
  },
  moveWindowBy: (deltaX, deltaY) => {
    if (typeof deltaX === 'object') {
      ipcRenderer.send('move-charm-window', deltaX);
    } else {
      ipcRenderer.send('move-charm-window', { deltaX, deltaY: deltaY || 0 });
    }
  },
  saveCharmPosition: () => {
    ipcRenderer.send('save-charm-position');
  },
  saveWindowPosition: () => {
    ipcRenderer.send('save-charm-position');
  },
  resetCharmPosition: () => {
    ipcRenderer.send('reset-charm-position');
  },
  resetPosition: () => {
    ipcRenderer.send('reset-charm-position');
  },
  setCharmPositionPreset: (preset) => {
    ipcRenderer.send('set-charm-position-preset', preset);
  },
  setPositionPreset: (preset) => {
    ipcRenderer.send('set-charm-position-preset', preset);
  },

  // Select Charm Card Window Drag & Position (OBJECT B)
  moveSelectorWindow: (deltaX, deltaY) => {
    ipcRenderer.send('move-selector-window', { deltaX, deltaY });
  },
  moveSelectorWindowBy: (deltaX, deltaY) => {
    ipcRenderer.send('move-selector-window', { deltaX, deltaY });
  },
  saveSelectorPosition: () => {
    ipcRenderer.send('save-selector-position');
  },
  closeSelectorWindow: () => {
    ipcRenderer.send('close-selector-window');
  },

  // Charm Selection & State Actions
  switchCharm: (charmId) => {
    ipcRenderer.send('switch-charm-from-selector', charmId);
  },
  hangNewNimbu: () => {
    ipcRenderer.send('hang-new-nimbu-request');
  },
  simulateNextDay: () => {
    ipcRenderer.send('simulate-next-day-request');
  },
  quitApp: () => {
    ipcRenderer.send('quit-app');
  },
  sendCharmState: (state) => {
    ipcRenderer.send('charm-state-updated', state);
  },

  // IPC Event Listeners from Main Process
  onToggleCharmSelector: (callback) => {
    ipcRenderer.on('toggle-charm-selector', () => callback());
  },
  onSwitchCharm: (callback) => {
    ipcRenderer.on('switch-charm', (event, charmId) => callback(charmId));
  },
  onPositionPresetMoving: (callback) => {
    ipcRenderer.on('position-preset-moving', (event, data) => callback(data));
  },
  onPositionPresetApplied: (callback) => {
    ipcRenderer.on('position-preset-applied', (event, data) => callback(data));
  },
  onHangNewNimbu: (callback) => {
    ipcRenderer.on('hang-new-nimbu', () => callback());
  },
  onSimulateNextDay: (callback) => {
    ipcRenderer.on('simulate-next-day', () => callback());
  },
  onCursorPositionUpdate: (callback) => {
    ipcRenderer.on('cursor-position-update', (event, pos) => callback(pos));
  },
  onSoundEffectsToggled: (callback) => {
    ipcRenderer.on('sound-effects-toggled', (event, enabled) => callback(enabled));
  },
  setSoundEffectsEnabled: (enabled) => {
    ipcRenderer.send('set-sound-effects-enabled', enabled);
  },

  // About Window & Utilities
  closeAboutWindow: () => {
    ipcRenderer.send('close-about-window');
  },
  openAboutWindow: () => {
    ipcRenderer.send('open-about-window');
  },
  getAppVersion: () => {
    return ipcRenderer.invoke('get-app-version');
  },
  getInitialCharmId: () => {
    return ipcRenderer.invoke('get-initial-charm-id');
  }
});

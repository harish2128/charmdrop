const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  setIgnoreMouseEvents: (ignore, options) => {
    ipcRenderer.send('set-ignore-mouse-events', ignore, options);
  },
  moveWindowBy: (deltaX) => {
    ipcRenderer.send('move-window-by', deltaX);
  },
  saveWindowPosition: () => {
    ipcRenderer.send('save-window-position');
  },
  moveSelectorWindowBy: (deltaX, deltaY) => {
    ipcRenderer.send('move-selector-window-by', { deltaX, deltaY });
  },
  saveSelectorPosition: () => {
    ipcRenderer.send('save-selector-position');
  },
  closeSelectorWindow: () => {
    ipcRenderer.send('close-selector-window');
  },
  switchCharm: (charmId) => {
    ipcRenderer.send('switch-charm-from-selector', charmId);
  },
  hangNewNimbu: () => {
    ipcRenderer.send('hang-new-nimbu-request');
  },
  simulateNextDay: () => {
    ipcRenderer.send('simulate-next-day-request');
  },
  resetPosition: () => {
    ipcRenderer.send('reset-position');
  },
  setPositionPreset: (preset) => {
    ipcRenderer.send('set-position-preset', preset);
  },
  quitApp: () => {
    ipcRenderer.send('quit-app');
  },
  sendCharmState: (state) => {
    ipcRenderer.send('charm-state-updated', state);
  },
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

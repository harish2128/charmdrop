/**
 * Settings Manager
 * Centralized schema and helpers for persistent desktop application settings.
 */

export const SETTINGS_KEYS = {
  SELECTED_CHARM_ID: 'selectedCharmId',
  CHARM_VISIBLE: 'charmVisible',
  LAST_WINDOW_POSITION: 'lastWindowPosition',
  POSITION_MODE: 'positionMode',
  LAUNCH_AT_STARTUP: 'launchAtStartup',
  SOUND_EFFECTS_ENABLED: 'soundEffectsEnabled'
};

export const DEFAULT_SETTINGS = {
  selectedCharmId: 'nimbu-mirchi',
  charmVisible: true,
  lastWindowPosition: null, // Defaults to top-right if null
  positionMode: 'top-right', // 'top-left' | 'top-center' | 'top-right' | 'custom'
  launchAtStartup: false,
  soundEffectsEnabled: true
};

export class SettingsManager {
  static get(key, defaultValue = null) {
    try {
      const val = localStorage.getItem(key);
      if (val === null) {
        return defaultValue !== null ? defaultValue : DEFAULT_SETTINGS[key];
      }
      return JSON.parse(val);
    } catch (err) {
      return localStorage.getItem(key) || defaultValue || DEFAULT_SETTINGS[key];
    }
  }

  static set(key, value) {
    try {
      const strVal = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, strVal);
    } catch (err) {
      console.error(`Failed to set setting: ${key}`, err);
    }
  }

  static getAll() {
    return {
      selectedCharmId: this.get(SETTINGS_KEYS.SELECTED_CHARM_ID, DEFAULT_SETTINGS.selectedCharmId),
      charmVisible: this.get(SETTINGS_KEYS.CHARM_VISIBLE, DEFAULT_SETTINGS.charmVisible),
      lastWindowPosition: this.get(SETTINGS_KEYS.LAST_WINDOW_POSITION, DEFAULT_SETTINGS.lastWindowPosition),
      launchAtStartup: this.get(SETTINGS_KEYS.LAUNCH_AT_STARTUP, DEFAULT_SETTINGS.launchAtStartup)
    };
  }
}

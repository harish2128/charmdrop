/**
 * Reusable Charm Renderer & Physics Integration Manager for Desktop Main Window
 */

import { getCharmById, getAllCharms } from '../data/charms.js';
import { CharmEngine, ENGINE_STATES } from './charmEngine.js';
import { DailyCharmManager } from './dailyCharmManager.js';
import { SettingsManager, SETTINGS_KEYS } from './settingsManager.js';
import { CharmSoundManager } from './charmSoundManager.js';

export class CharmRenderer {
  constructor({
    rigElementId = 'charmRig',
    containerElementId = 'charmContainer',
    debugOverlayId = 'physicsDebugOverlay'
  } = {}) {
    this.rigElement = document.getElementById(rigElementId);
    this.containerElement = document.getElementById(containerElementId);
    this.debugOverlay = document.getElementById(debugOverlayId);

    this.currentCharm = null;
    this.engine = null;
    this.isDebugOpen = false;

    // Daily Charm Manager & Charm Sound Manager
    this.dailyManager = new DailyCharmManager({
      onStateChange: (state) => this.handleDailyStateChange(state)
    });
    this.soundManager = new CharmSoundManager();

    this.init();
  }

  init() {
    // 1. Retrieve & validate selected charm from persistent settings (defaults safely to "nimbu-mirchi")
    const storedCharmId = SettingsManager.get(SETTINGS_KEYS.SELECTED_CHARM_ID, 'nimbu-mirchi');

    // 2. Initialize the generic physics engine with sound manager observation and debug HUD
    this.engine = new CharmEngine({
      rigElement: this.rigElement,
      containerElement: this.containerElement,
      onTransformUpdate: (physicsData) => {
        if (this.soundManager) {
          this.soundManager.observePhysics(physicsData);
        }
        if (this.isDebugOpen && this.debugOverlay) {
          this.renderDebugOverlay(physicsData);
        }
      }
    });

    // 3. Load active charm with its configured weight & sound settings
    this.loadCharm(storedCharmId, false);

    // 4. Initialize debug shortcut & System Tray / Window IPC listeners
    this.setupDebugShortcut();
    this.setupTrayIPC();

    // 5. Initial sync with main process tray menu
    this.syncWithMainProcess();
  }

  /**
   * Load and render any charm by ID with smooth crossfade
   * @param {string} charmId
   * @param {boolean} animate
   * @param {boolean} isFreshEntryAction
   */
  loadCharm(charmId, animate = true, isFreshEntryAction = false) {
    const charm = getCharmById(charmId);
    this.currentCharm = charm;

    // Apply per-charm physical weight characteristics & rope configuration
    if (this.engine) {
      this.engine.setCharmConfig(
        charm.physics || {},
        charm.ropeLength || 70,
        charm.ropeColor || '#6B4423',
        charm
      );
    }

    // Set active charm in sound manager (arms 500ms delay to prevent audio on switch)
    if (this.soundManager) {
      this.soundManager.setCharm(charm);
    }

    // Persist active selection in SettingsManager
    SettingsManager.set(SETTINGS_KEYS.SELECTED_CHARM_ID, charm.id);

    const applyCharmImage = () => {
      this.containerElement.innerHTML = '';

      const img = document.createElement('img');
      img.id = 'charmImage';
      img.src = charm.image;
      img.alt = charm.name;
      img.className = 'nimbu-image';
      img.draggable = false;

      // Apply per-charm sizing & constraints (Preserves exact 108px width for Nimbu Mirchi)
      const targetWidth = charm.maxWidth || 108;
      img.style.width = `${targetWidth}px`;
      img.style.maxWidth = `${Math.round(targetWidth * 1.12)}px`;
      img.style.height = 'auto';
      img.style.objectFit = 'contain';

      // Rope offset and scale
      if (charm.ropeOffsetX || charm.ropeOffsetY) {
        img.style.transform = `translate(${charm.ropeOffsetX || 0}px, ${charm.ropeOffsetY || 0}px) scale(${charm.scale || 1})`;
      } else if (charm.scale && charm.scale !== 1) {
        img.style.transform = `scale(${charm.scale})`;
      }

      // Check Daily Refresh state for Nimbu Mirchi
      if (charm.dailyRefresh) {
        const dailyState = this.dailyManager.getNimbuState();
        if (!dailyState.isFresh) {
          img.classList.add('is-faded');
        } else if (isFreshEntryAction) {
          img.classList.add('is-fresh-entry');
          setTimeout(() => img.classList.remove('is-fresh-entry'), 320);
        }
      }

      // Initial opacity for fade-in
      if (animate && !isFreshEntryAction) {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.20s ease-out';
      }

      img.onerror = () => {
        console.warn(`Failed to load charm image: ${charm.image} (ID: ${charm.id}). Retrying fallback...`);
        img.src = 'assets/charms/lucky/nimbu-mirchi.png';
      };

      this.containerElement.appendChild(img);
      this.containerElement.title = `${charm.name} • Drag charm to move • Ctrl+Shift+C Choose Charm`;

      // Trigger fade-in
      if (animate && !isFreshEntryAction) {
        requestAnimationFrame(() => {
          img.style.opacity = '1';
        });
      }

      // Reset temporary physics to resting equilibrium without altering saved desktop coordinates
      if (this.engine) {
        this.engine.angle = 0;
        this.engine.angularVelocity = 0;
        this.engine.horizontalOffset = 0;
        this.engine.horizontalVelocity = 0;
        this.engine.posY = 0;
        this.engine.velY = 0;
        this.engine.state = ENGINE_STATES.IDLE;
      }

      this.syncWithMainProcess();
    };

    if (animate && !isFreshEntryAction) {
      const existingImg = this.containerElement.querySelector('img');
      if (existingImg) {
        existingImg.style.transition = 'opacity 0.15s ease-in';
        existingImg.style.opacity = '0';
        setTimeout(applyCharmImage, 150);
      } else {
        applyCharmImage();
      }
    } else {
      applyCharmImage();
    }
  }

  /**
   * Real-time handler when daily status changes
   * @param {{ isFresh: boolean }} state
   */
  handleDailyStateChange(state) {
    const img = this.containerElement.querySelector('img');
    if (this.currentCharm && this.currentCharm.dailyRefresh && img) {
      if (state.isFresh) {
        img.classList.remove('is-faded');
        img.classList.add('is-fresh-entry');
        setTimeout(() => img.classList.remove('is-fresh-entry'), 320);
      } else {
        img.classList.remove('is-fresh-entry');
        img.classList.add('is-faded');
      }
    }
    this.syncWithMainProcess();
  }

  /**
   * Sync active charm and daily status with Electron Main Process for Tray Menu
   */
  syncWithMainProcess() {
    if (window.electronAPI && window.electronAPI.sendCharmState && this.currentCharm) {
      const dailyState = this.dailyManager.getNimbuState();
      window.electronAPI.sendCharmState({
        selectedCharmId: this.currentCharm.id,
        charmName: this.currentCharm.name,
        positionMode: SettingsManager.get(SETTINGS_KEYS.POSITION_MODE, 'top-right'),
        dailyRefresh: !!this.currentCharm.dailyRefresh,
        isFresh: dailyState.isFresh,
        charms: getAllCharms().map((c) => ({ id: c.id, name: c.name, category: c.category }))
      });
    }
  }

  /**
   * Listen to Tray Menu & preset events from Electron Main Process
   */
  setupTrayIPC() {
    if (!window.electronAPI) return;

    if (window.electronAPI.getInitialCharmId) {
      window.electronAPI.getInitialCharmId().then((initialId) => {
        if (initialId && initialId !== this.currentCharm?.id) {
          this.loadCharm(initialId, false);
        }
      }).catch(() => {});
    }

    if (window.electronAPI.onSwitchCharm) {
      window.electronAPI.onSwitchCharm((charmId) => {
        this.loadCharm(charmId, true);
      });
    }

    if (window.electronAPI.onPositionPresetMoving) {
      window.electronAPI.onPositionPresetMoving(() => {
        if (this.engine) this.engine.suspendForPresetMove();
      });
    }

    if (window.electronAPI.onPositionPresetApplied) {
      window.electronAPI.onPositionPresetApplied((data) => {
        if (this.engine) this.engine.resumeAfterPresetMove(data.direction || 0);
        SettingsManager.set(SETTINGS_KEYS.POSITION_MODE, data.preset);
      });
    }

    if (window.electronAPI.onHangNewNimbu) {
      window.electronAPI.onHangNewNimbu(() => {
        this.dailyManager.hangNewNimbu();
      });
    }

    if (window.electronAPI.onSimulateNextDay) {
      window.electronAPI.onSimulateNextDay(() => {
        this.dailyManager.simulateNextDay();
      });
    }
  }

  /**
   * Setup development-only physics debug overlay toggle (Ctrl+Shift+D)
   */
  setupDebugShortcut() {
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        this.toggleDebug();
      }
    });
  }

  toggleDebug(forceState) {
    this.isDebugOpen = forceState !== undefined ? forceState : !this.isDebugOpen;
    if (this.debugOverlay) {
      this.debugOverlay.style.display = this.isDebugOpen ? 'block' : 'none';
    }
    if (this.engine) {
      this.engine.setDebugMode(this.isDebugOpen);
    }
  }

  /**
   * Render real-time physics & audio telemetry HUD for development tuning
   */
  renderDebugOverlay(data = {}) {
    if (!this.debugOverlay) return;
    const soundData = this.soundManager ? this.soundManager.getDebugData() : {};
    const charmName = this.currentCharm?.name || 'None';
    const weight = data.charmPhysics?.weight?.toFixed(2) || '1.00';
    const swingMult = data.charmPhysics?.swingMultiplier?.toFixed(2) || '1.00';
    const dampMult = data.charmPhysics?.dampingMultiplier?.toFixed(3) || '1.000';

    this.debugOverlay.innerHTML = `
      <div class="dbg-title">PHYSICS TELEMETRY [DEV]</div>
      <div class="dbg-row"><span>Charm:</span> <b>${charmName}</b></div>
      <div class="dbg-row"><span>Weight / Swing / Damp:</span> <b>${weight} / ${swingMult}x / ${dampMult}x</b></div>
      <div class="dbg-divider"></div>
      <div class="dbg-row"><span>State:</span> <b class="dbg-state dbg-${data.state}">${data.state || 'IDLE'}</b></div>
      <div class="dbg-row"><span>Dist to Cursor:</span> <b>${Math.round(data.dist || 0)} px</b></div>
      <div class="dbg-row"><span>Zone Status:</span> <b>${data.isInsideInteractionZone ? '🟢 INSIDE (<=150px)' : '⚪ OUTSIDE (>220px)'}</b></div>
      <div class="dbg-row"><span>Cursor Vx / Vy:</span> <b>${(data.cursorVx || 0).toFixed(2)} / ${(data.cursorVy || 0).toFixed(2)}</b></div>
      <div class="dbg-divider"></div>
      <div class="dbg-row"><span>Angle:</span> <b>${(data.angle || 0).toFixed(2)}°</b></div>
      <div class="dbg-row"><span>Angular Velocity:</span> <b>${(data.angularVelocity || 0).toFixed(3)} deg/f</b></div>
      <div class="dbg-row"><span>Horizontal Offset:</span> <b>${(data.horizontalOffset || 0).toFixed(2)} px</b></div>
      <div class="dbg-divider"></div>
      <div class="dbg-row"><span>Sound Active:</span> <b>${soundData.soundEffectsEnabled ? 'ON' : 'OFF'} (${soundData.soundType})</b></div>
      <div class="dbg-row"><span>Sound Cooldown:</span> <b>${soundData.remainingCooldown} ms</b></div>
      <div class="dbg-row"><span>Sound Armed:</span> <b>${soundData.isArmed ? 'YES' : 'NO (500ms delay)'}</b></div>
      <div class="dbg-footer">Ctrl+Shift+D to hide</div>
    `;
  }

  getCurrentCharm() {
    return this.currentCharm;
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.charmApp = new CharmRenderer();
});

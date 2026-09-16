/**
 * Reusable Charm Renderer & Interactive Selector Manager
 * Integrates CharmEngine physics with DailyCharmManager, SettingsManager, and Windows System Tray IPC.
 */

import { getCharmById, getAllCharms, CHARM_CATEGORIES } from '../data/charms.js';
import { CharmEngine, ENGINE_STATES } from './charmEngine.js';
import { DailyCharmManager } from './dailyCharmManager.js';
import { SettingsManager, SETTINGS_KEYS } from './settingsManager.js';
import { CharmSoundManager } from './charmSoundManager.js';

export class CharmRenderer {
  constructor({
    rigElementId = 'charmRig',
    containerElementId = 'charmContainer',
    panelElementId = 'charmSelectorPanel',
    listElementId = 'charmList',
    dailySectionId = 'dailyStatusSection',
    closeBtnId = 'selectorCloseBtn',
    debugOverlayId = 'physicsDebugOverlay'
  } = {}) {
    this.rigElement = document.getElementById(rigElementId);
    this.containerElement = document.getElementById(containerElementId);
    this.panelElement = document.getElementById(panelElementId);
    this.listElement = document.getElementById(listElementId);
    this.dailySection = document.getElementById(dailySectionId);
    this.closeBtn = document.getElementById(closeBtnId);
    this.debugOverlay = document.getElementById(debugOverlayId);

    this.currentCharm = null;
    this.engine = null;
    this.isSelectorOpen = false;
    this.isDebugOpen = false;
    this.activeCategoryFilter = 'All';

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

    // 4. Initialize Charm Selector UI, shortcuts, debug mode & System Tray IPC listeners
    this.setupSelectorUI();
    this.setupDebugShortcut();
    this.setupTrayIPC();

    // 5. Initial preset buttons highlight
    const initialMode = SettingsManager.get(SETTINGS_KEYS.POSITION_MODE, 'top-right');
    this.updatePositionPresetButtons(initialMode);

    // 6. Initial sync with main process tray menu
    this.syncWithMainProcess();
  }

  /**
   * Load and render any charm by ID with smooth 160-200ms crossfade
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
      this.containerElement.title = `${charm.name} • Scroll or Drag to swing • Ctrl+Shift+Q to quit`;

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

      this.updateSelectorActiveItem();
      this.renderDailyStatusSection();
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
    this.renderDailyStatusSection();
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
        this.updatePositionPresetButtons(data.preset);
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
   * Update active button visual highlight in selector panel
   * @param {'top-left' | 'top-center' | 'top-right' | 'custom'} activePreset
   */
  updatePositionPresetButtons(activePreset) {
    const positionRow = document.getElementById('selectorPositionRow');
    if (!positionRow) return;
    const presetBtns = positionRow.querySelectorAll('.preset-btn');
    presetBtns.forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.preset === activePreset);
    });
  }

  /**
   * Setup Charm Selector panel list & keyboard shortcuts
   */
  setupSelectorUI() {
    this.renderCategoryTabs();
    this.renderCharmList();

    // Position preset buttons in selector panel
    const positionRow = document.getElementById('selectorPositionRow');
    if (positionRow) {
      const presetBtns = positionRow.querySelectorAll('.preset-btn');
      presetBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const preset = btn.dataset.preset;
          if (preset && window.electronAPI && window.electronAPI.setPositionPreset) {
            window.electronAPI.setPositionPreset(preset);
          }
        });
      });
    }

    // Toggle button close handler
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.toggleSelector(false));
    }

    // Keyboard Shortcuts: Ctrl + Shift + C & Escape
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        this.toggleSelector();
      } else if (e.key === 'Escape' && this.isSelectorOpen) {
        e.preventDefault();
        this.toggleSelector(false);
      }
    });

    // IPC shortcut listener from main process
    if (window.electronAPI && window.electronAPI.onToggleCharmSelector) {
      window.electronAPI.onToggleCharmSelector(() => {
        this.toggleSelector();
      });
    }

    // Mouse capture for selector panel hover
    if (this.panelElement && window.electronAPI && window.electronAPI.setIgnoreMouseEvents) {
      this.panelElement.addEventListener('mouseenter', () => {
        window.electronAPI.setIgnoreMouseEvents(false);
      });
      this.panelElement.addEventListener('mouseleave', () => {
        if (!this.isSelectorOpen) {
          window.electronAPI.setIgnoreMouseEvents(true, { forward: true });
        }
      });
    }
  }

  /**
   * Render horizontal category filter chips in selector
   */
  renderCategoryTabs() {
    let tabsContainer = document.getElementById('selectorCategoryTabs');
    if (!tabsContainer && this.panelElement) {
      tabsContainer = document.createElement('div');
      tabsContainer.id = 'selectorCategoryTabs';
      tabsContainer.className = 'selector-category-tabs';
      this.panelElement.insertBefore(tabsContainer, this.listElement);
    }

    if (!tabsContainer) return;
    tabsContainer.innerHTML = '';

    const categories = ['All', ...CHARM_CATEGORIES];
    categories.forEach((cat) => {
      const chip = document.createElement('button');
      chip.className = `category-tab-chip ${this.activeCategoryFilter === cat ? 'is-active' : ''}`;
      chip.textContent = cat;
      chip.addEventListener('click', () => {
        this.activeCategoryFilter = cat;
        this.renderCategoryTabs();
        this.renderCharmList();
      });
      tabsContainer.appendChild(chip);
    });
  }

  /**
   * Render the list of available charms into the selector panel
   */
  renderCharmList() {
    if (!this.listElement) return;
    this.listElement.innerHTML = '';

    const allCharms = getAllCharms();
    const filteredCharms = this.activeCategoryFilter === 'All'
      ? allCharms
      : allCharms.filter((c) => c.category.toLowerCase() === this.activeCategoryFilter.toLowerCase());

    filteredCharms.forEach((charm) => {
      const item = document.createElement('div');
      item.className = `selector-charm-item ${this.currentCharm && this.currentCharm.id === charm.id ? 'is-active' : ''}`;
      item.dataset.charmId = charm.id;

      const soundBadge = charm.sound ? `<span class="selector-sound-indicator" title="Sound Effects available">🔊</span>` : '';

      item.innerHTML = `
        <div class="selector-charm-left">
          <img src="${charm.image}" alt="${charm.name}" class="selector-thumb-img" draggable="false" />
          <span class="selector-charm-title">${charm.name}${soundBadge}</span>
        </div>
        <span class="selector-charm-tag">${charm.category}</span>
      `;

      item.addEventListener('click', () => {
        this.loadCharm(charm.id, true);
        setTimeout(() => this.toggleSelector(false), 220);
      });

      this.listElement.appendChild(item);
    });
  }

  /**
   * Render Daily Status Card when active charm has dailyRefresh: true
   */
  renderDailyStatusSection() {
    if (!this.dailySection) return;

    if (!this.currentCharm || !this.currentCharm.dailyRefresh) {
      this.dailySection.style.display = 'none';
      return;
    }

    this.dailySection.style.display = 'flex';
    this.dailySection.innerHTML = '';

    const state = this.dailyManager.getNimbuState();

    // 1. Status Row
    const statusRow = document.createElement('div');
    statusRow.className = 'daily-status-row';
    statusRow.innerHTML = `
      <span class="daily-status-label">${this.currentCharm.name}</span>
      <span class="daily-status-badge ${state.isFresh ? 'is-fresh' : 'is-faded'}">
        <span class="daily-status-dot"></span>
        ${state.isFresh ? 'Fresh Today' : 'Completed Today'}
      </span>
    `;
    this.dailySection.appendChild(statusRow);

    // 2. Hang New Button (shown when charm is faded)
    if (!state.isFresh) {
      const hangBtn = document.createElement('button');
      hangBtn.className = 'btn-hang-new';
      hangBtn.innerHTML = `Hang New ${this.currentCharm.name}`;
      hangBtn.addEventListener('click', () => {
        this.dailyManager.hangNewNimbu();
      });
      this.dailySection.appendChild(hangBtn);
    }

    // 3. DEV TEST: Simulate Next Day button (Only rendered when debug mode is active)
    if (this.isDebugOpen) {
      const devBtn = document.createElement('button');
      devBtn.className = 'btn-dev-simulate';
      devBtn.innerHTML = `DEV TEST: Simulate Next Day`;
      devBtn.title = 'Test rollover to next calendar day (forces faded state locally)';
      devBtn.addEventListener('click', () => {
        this.dailyManager.simulateNextDay();
      });
      this.dailySection.appendChild(devBtn);
    }
  }

  updateSelectorActiveItem() {
    if (!this.listElement) return;
    const items = this.listElement.querySelectorAll('.selector-charm-item');
    items.forEach((item) => {
      if (this.currentCharm && item.dataset.charmId === this.currentCharm.id) {
        item.classList.add('is-active');
      } else {
        item.classList.remove('is-active');
      }
    });
  }

  /**
   * Toggle selector panel visibility
   * @param {boolean} [forceState]
   */
  toggleSelector(forceState) {
    this.isSelectorOpen = forceState !== undefined ? forceState : !this.isSelectorOpen;

    if (this.panelElement) {
      this.panelElement.style.display = this.isSelectorOpen ? 'flex' : 'none';
      if (this.isSelectorOpen) {
        this.renderCategoryTabs();
        this.renderCharmList();
        this.renderDailyStatusSection();
      }
    }

    if (window.electronAPI && window.electronAPI.setIgnoreMouseEvents) {
      if (this.isSelectorOpen) {
        window.electronAPI.setIgnoreMouseEvents(false);
      } else {
        window.electronAPI.setIgnoreMouseEvents(true, { forward: true });
      }
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

/**
 * Reusable Charm Sound Engine
 * Supports per-charm configuration, preloaded audio caching, 
 * proximity enter/exit boundary detection (150px enter / 220px exit),
 * realistic physics-observed first-impulse triggers for Bell and Cat,
 * strict audio overlap prevention, and tray ON/OFF state persistence.
 */

import { SettingsManager, SETTINGS_KEYS } from './settingsManager.js';

export class CharmSoundManager {
  constructor({ onSoundPlay } = {}) {
    this.onSoundPlay = onSoundPlay;
    this.currentCharm = null;
    this.audioCache = new Map(); // src -> Audio instance
    this.audioCtx = null;
    
    // Sound settings state
    this.soundEffectsEnabled = SettingsManager.get(SETTINGS_KEYS.SOUND_EFFECTS_ENABLED, true);

    // Interaction zone state (Enter: <= 150px, Exit: > 220px)
    this.interactionZoneRadius = 150.0;
    this.exitZoneRadius = 220.0;
    this.wasInsideInteractionZone = false;
    this.catArmed = false;
    this.bellArmed = false;

    // 500ms sound-arm delay after charm switch or app startup (prevents accidental sounds)
    this.soundArmedAt = performance.now() + 500;

    // Cooldown tracking per sound key/type
    this.lastPlayedTimes = new Map();

    // Physical motion tracking
    this.previousAngle = 0;

    this.init();
  }

  init() {
    // Preload both approved final sound assets into memory cache
    this.preloadAudio('assets/sounds/dragon-studio-cartoon-cat-meow-487661.mp3', 0.40);
    this.preloadAudio('assets/sounds/universfield-single-church-bell-2-352062.mp3', 0.40);

    // Listen for tray sound effects toggle from Electron IPC
    if (typeof window !== 'undefined' && window.electronAPI && window.electronAPI.onSoundEffectsToggled) {
      window.electronAPI.onSoundEffectsToggled((enabled) => {
        this.setSoundEffectsEnabled(enabled);
      });
    }
  }

  getAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  setSoundEffectsEnabled(enabled) {
    this.soundEffectsEnabled = !!enabled;
    SettingsManager.set(SETTINGS_KEYS.SOUND_EFFECTS_ENABLED, this.soundEffectsEnabled);
  }

  getSoundEffectsEnabled() {
    return this.soundEffectsEnabled;
  }

  setCharm(charm) {
    this.currentCharm = charm;
    this.wasInsideInteractionZone = false;
    this.catArmed = false;
    this.bellArmed = false;
    this.previousAngle = 0;

    // Arm sound only after 500ms delay to prevent audio triggers during charm selection / clicks
    this.soundArmedAt = performance.now() + 500;

    // Preload audio asset if defined in charm configuration
    if (charm && charm.sound && charm.sound.src) {
      this.preloadAudio(charm.sound.src, charm.sound.volume);
    }
  }

  preloadAudio(src, defaultVolume = 0.40) {
    if (!src || this.audioCache.has(src) || typeof Audio === 'undefined') return;
    try {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.volume = defaultVolume !== undefined ? defaultVolume : 0.40;
      this.audioCache.set(src, audio);
    } catch (err) {
      // Ignore audio creation error
    }
  }

  canPlay(soundType, cooldownMs = 3800, src = null) {
    if (!this.soundEffectsEnabled) return false;
    const now = performance.now();
    if (now < this.soundArmedAt) return false;

    const lastTime = this.lastPlayedTimes.get(soundType) || 0;
    if (now - lastTime < cooldownMs) {
      return false;
    }

    // Overlap prevention: If this audio file is still actively playing, do not cut or overlap
    if (src) {
      const audio = this.audioCache.get(src);
      if (audio && !audio.paused && !audio.ended && audio.currentTime > 0) {
        return false;
      }
    }

    return true;
  }

  playSound(src, volume = 0.40, soundType = 'default', cooldownMs = 3800) {
    if (!this.soundEffectsEnabled) return false;
    if (!this.canPlay(soundType, cooldownMs, src)) return false;

    const clampedVolume = Math.max(0, Math.min(1, volume !== undefined ? volume : 0.40));

    let audio = this.audioCache.get(src);
    if (!audio && src && typeof Audio !== 'undefined') {
      audio = new Audio(src);
      audio.preload = 'auto';
      this.audioCache.set(src, audio);
    }

    if (!audio) return false;

    // Strict overlap protection: Ensure previous playback has fully concluded
    if (!audio.paused && !audio.ended && audio.currentTime > 0) {
      return false;
    }

    audio.volume = clampedVolume;
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.lastPlayedTimes.set(soundType, performance.now());
          if (typeof this.onSoundPlay === 'function') {
            this.onSoundPlay({ src, soundType, volume: clampedVolume });
          }
        })
        .catch(() => {
          // Audio play blocked or not yet interacted
        });
      return true;
    }

    return false;
  }

  getDebugData() {
    const now = performance.now();
    const soundType = this.currentCharm?.sound?.type || 'none';
    const lastTime = this.lastPlayedTimes.get(soundType) || 0;
    const cooldown = this.currentCharm?.sound?.cooldown || 0;
    const remainingCooldown = Math.max(0, Math.round(cooldown - (now - lastTime)));
    const isArmed = now >= this.soundArmedAt;

    return {
      soundEffectsEnabled: this.soundEffectsEnabled,
      soundType,
      remainingCooldown,
      isArmed,
      wasInsideInteractionZone: this.wasInsideInteractionZone,
      catArmed: this.catArmed,
      bellArmed: this.bellArmed
    };
  }

  /**
   * Observe physics frame updates
   * Called every physics tick with current state & cursor metrics
   */
  observePhysics({ angle, angularVelocity, horizontalVelocity, dist, proximityFactor, cursorVx, isDragging, state }) {
    if (!this.soundEffectsEnabled || !this.currentCharm || !this.currentCharm.sound) {
      this.previousAngle = angle;
      return;
    }

    const soundConfig = this.currentCharm.sound;
    const soundType = soundConfig.type || 'generic';
    const volume = soundConfig.volume !== undefined ? soundConfig.volume : 0.40;
    const cooldown = soundConfig.cooldown || 3800;
    const src = soundConfig.src;

    const now = performance.now();
    const isReadyAfterSwitch = now >= this.soundArmedAt;

    // 1. Proximity Hysteresis Zone Detection
    // Enter: <= 150px | Exit: > 220px
    const isInsideEnterZone = dist <= this.interactionZoneRadius;
    const isOutsideExitZone = dist > this.exitZoneRadius;

    if (isOutsideExitZone && !isDragging && isReadyAfterSwitch) {
      // Cursor left the proximity area entirely -> re-arm Lucky Cat
      this.catArmed = true;
      this.wasInsideInteractionZone = false;
    }

    // 2. Specific Charm Sound Behaviors
    if (soundType === 'cat') {
      // LUCKY CAT:
      // When cursor enters interaction zone (<= 150px) and causes visible reaction:
      // -> play ONE realistic cat meow.
      // -> Disarm immediately so no repeated meows occur while cursor stays nearby or during drag.
      if ((isInsideEnterZone || isDragging) && this.catArmed && isReadyAfterSwitch) {
        const hasReaction = proximityFactor > 0.12 || Math.abs(cursorVx) > 0.25 || Math.abs(angularVelocity) > 0.25 || isDragging;
        if (hasReaction) {
          const played = this.playSound(src, volume, 'cat', cooldown);
          if (played) {
            this.catArmed = false; // Disarm until cursor exits beyond 220px
          }
        }
      }
    } else if (soundType === 'bell') {
      // FORTUNE BELL:
      // Trigger ONE playback when the Bell receives its FIRST meaningful interaction impulse.
      // Valid triggers:
      //   - meaningful mouse proximity push
      //   - meaningful drag release
      //   - meaningful flick
      // Do NOT trigger from subsequent swings / oscillations.

      const absAngVel = Math.abs(angularVelocity || 0);
      const absHorizVel = Math.abs(horizontalVelocity || 0);

      // Check if Bell is at resting equilibrium or cursor is outside
      const isSettled = absAngVel < 0.12 && Math.abs(angle) < 0.20 && absHorizVel < 0.3;
      const lastPlayTime = this.lastPlayedTimes.get('bell') || 0;
      const cooldownElapsed = now - lastPlayTime >= cooldown;

      // Arm Bell only when fully settled or after cooldown with cursor exiting/re-entering
      if (!this.bellArmed && isReadyAfterSwitch && (isSettled || (isOutsideExitZone && cooldownElapsed))) {
        this.bellArmed = true;
      }

      // Meaningful first-impulse detection (filters out tiny idle rope breathing)
      const isMeaningfulImpulse = (isInsideEnterZone && (absAngVel > 0.65 || absHorizVel > 1.4 || Math.abs(cursorVx) > 0.35)) ||
                                  isDragging ||
                                  state === 'RELEASE_PHYSICS';

      if (this.bellArmed && isMeaningfulImpulse && isReadyAfterSwitch) {
        const played = this.playSound(src, volume, 'bell', cooldown);
        if (played) {
          // Immediately disarm so subsequent swings in this decay cycle DO NOT trigger audio
          this.bellArmed = false;
        }
      }
    }

    this.wasInsideInteractionZone = isInsideEnterZone;
    this.previousAngle = angle;
  }
}

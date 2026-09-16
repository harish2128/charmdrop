/**
 * CharmDrop - Manifest V3 Content Script
 * Encapsulated Shadow DOM Overlay with 12-point Verlet Rope Physics & Sound Engine
 */

(function () {
  'use strict';

  // Prevent duplicate injections on SPA navigation
  if (window.__CHARMDROP_EXTENSION_INITIALIZED__) {
    return;
  }
  window.__CHARMDROP_EXTENSION_INITIALIZED__ = true;

  // Canonical 13 approved Lucky charms
  const CHARMS = [
    {
      id: "nimbu-mirchi",
      name: "Nimbu Mirchi",
      category: "Lucky",
      image: "assets/charms/lucky/nimbu-mirchi.png",
      scale: 1,
      maxWidth: 96,
      maxHeight: 220,
      ropeLength: 55,
      dailyRefresh: true,
      physics: { weight: 0.95, swingMultiplier: 1.05, dampingMultiplier: 0.998 },
      sound: null
    },
    {
      id: "guardian-face",
      name: "Guardian Face",
      category: "Lucky",
      image: "assets/charms/lucky/guardian-face.png",
      scale: 1,
      maxWidth: 98,
      maxHeight: 165,
      ropeLength: 60,
      dailyRefresh: false,
      physics: { weight: 1.25, swingMultiplier: 0.88, dampingMultiplier: 1.006 },
      sound: null
    },
    {
      id: "evil-eye",
      name: "Evil Eye",
      category: "Lucky",
      image: "assets/charms/lucky/evil-eye.png",
      scale: 1,
      maxWidth: 95,
      maxHeight: 165,
      ropeLength: 65,
      dailyRefresh: false,
      physics: { weight: 0.82, swingMultiplier: 1.15, dampingMultiplier: 0.992 },
      sound: null
    },
    {
      id: "lucky-cat",
      name: "Maneki Neko (Lucky Cat)",
      category: "Lucky",
      image: "assets/charms/lucky/lucky-cat.png",
      scale: 1,
      maxWidth: 95,
      maxHeight: 175,
      ropeLength: 58,
      dailyRefresh: false,
      physics: { weight: 1.05, swingMultiplier: 1.0, dampingMultiplier: 1.0 },
      sound: {
        type: "cat",
        src: "assets/sounds/dragon-studio-cartoon-cat-meow-487661.mp3",
        volume: 0.35,
        cooldown: 3500
      }
    },
    {
      id: "four-leaf-clover",
      name: "Four Leaf Clover",
      category: "Lucky",
      image: "assets/charms/lucky/four-leaf-clover.png",
      scale: 1,
      maxWidth: 92,
      maxHeight: 165,
      ropeLength: 58,
      dailyRefresh: false,
      physics: { weight: 0.88, swingMultiplier: 1.10, dampingMultiplier: 0.995 },
      sound: null
    },
    {
      id: "lucky-bell",
      name: "Fortune Bell",
      category: "Lucky",
      image: "assets/charms/lucky/lucky-bell.png",
      scale: 1,
      maxWidth: 88,
      maxHeight: 165,
      ropeLength: 65,
      dailyRefresh: false,
      physics: { weight: 1.18, swingMultiplier: 0.92, dampingMultiplier: 1.004 },
      sound: {
        type: "bell",
        src: "assets/sounds/universfield-single-church-bell-2-352062.mp3",
        volume: 0.35,
        cooldown: 3800
      }
    },
    {
      id: "daruma",
      name: "Daruma",
      category: "Lucky",
      image: "assets/charms/lucky/lucky-daruma.png",
      scale: 1,
      maxWidth: 95,
      maxHeight: 180,
      ropeLength: 65,
      dailyRefresh: false,
      physics: { weight: 1.22, swingMultiplier: 0.90, dampingMultiplier: 1.005 },
      sound: null
    },
    {
      id: "lucky-clover",
      name: "Lucky Clover",
      category: "Lucky",
      image: "assets/charms/lucky/lucky-clover.png",
      scale: 1,
      maxWidth: 92,
      maxHeight: 165,
      ropeLength: 58,
      dailyRefresh: false,
      physics: { weight: 0.85, swingMultiplier: 1.12, dampingMultiplier: 0.995 },
      sound: null
    },
    {
      id: "dreamcatcher",
      name: "Dreamcatcher",
      category: "Lucky",
      image: "assets/charms/lucky/dreamcatcher.png",
      scale: 1,
      maxWidth: 95,
      maxHeight: 200,
      ropeLength: 55,
      dailyRefresh: false,
      physics: { weight: 0.80, swingMultiplier: 1.15, dampingMultiplier: 0.994 },
      sound: null
    },
    {
      id: "lucky-horseshoe",
      name: "Lucky Horseshoe",
      category: "Lucky",
      image: "assets/charms/lucky/lucky-horseshoe.png",
      scale: 1,
      maxWidth: 92,
      maxHeight: 165,
      ropeLength: 58,
      dailyRefresh: false,
      physics: { weight: 1.25, swingMultiplier: 0.88, dampingMultiplier: 1.005 },
      sound: null
    },
    {
      id: "red-lucky-knot",
      name: "Red Lucky Knot",
      category: "Lucky",
      image: "assets/charms/lucky/red-lucky-knot.png",
      scale: 1,
      maxWidth: 88,
      maxHeight: 200,
      ropeLength: 55,
      dailyRefresh: false,
      physics: { weight: 0.90, swingMultiplier: 1.08, dampingMultiplier: 0.997 },
      sound: null
    },
    {
      id: "yin-yang",
      name: "Yin Yang",
      category: "Lucky",
      image: "assets/charms/lucky/yin-yang.png",
      scale: 1,
      maxWidth: 92,
      maxHeight: 165,
      ropeLength: 58,
      dailyRefresh: false,
      physics: { weight: 1.05, swingMultiplier: 1.0, dampingMultiplier: 1.0 },
      sound: null
    },
    {
      id: "lucky-lotus",
      name: "Lucky Lotus",
      category: "Lucky",
      image: "assets/charms/lucky/lucky-lotus.png",
      scale: 1,
      maxWidth: 95,
      maxHeight: 175,
      ropeLength: 58,
      dailyRefresh: false,
      physics: { weight: 0.90, swingMultiplier: 1.08, dampingMultiplier: 0.997 },
      sound: null
    }
  ];

  function getCharm(id) {
    return CHARMS.find((c) => c.id === id) || CHARMS[0];
  }

  // State
  let settings = {
    enabled: true,
    selectedCharmId: 'nimbu-mirchi',
    positionMode: 'top-right',
    customPercentX: 85,
    soundEffectsEnabled: true
  };

  const STAGE_WIDTH = 280;
  const STAGE_HEIGHT = 380;
  const ANCHOR_X = 140;
  const ANCHOR_Y = 0;
  const NUM_POINTS = 12;
  const CONSTRAINT_ITERATIONS = 4;

  class VerletPoint {
    constructor(x, y, fixed = false) {
      this.x = x;
      this.y = y;
      this.oldX = x;
      this.oldY = y;
      this.fixed = fixed;
    }
    reset(x, y) {
      this.x = x;
      this.y = y;
      this.oldX = x;
      this.oldY = y;
    }
  }

  class ExtensionCharmController {
    constructor() {
      this.rootElement = null;
      this.shadow = null;
      this.stageElement = null;
      this.canvas = null;
      this.ctx = null;
      this.rigElement = null;
      this.containerElement = null;
      this.imageElement = null;

      this.currentCharm = getCharm(settings.selectedCharmId);
      this.numPoints = NUM_POINTS;
      this.ropeLength = this.currentCharm.ropeLength || 60;
      this.segmentLength = this.ropeLength / (this.numPoints - 1);
      this.points = [];
      this.createRopePoints();

      this.angle = 0;
      this.angularVelocity = 0;
      this.previousAngle = 0;
      this.horizontalOffset = 0;
      this.horizontalVelocity = 0;

      // Cursor tracking
      this.proximityFactor = 0;
      this.cursorPushDirX = 0;
      this.currentDist = 9999;
      this.lastCursorLocalX = null;
      this.lastCursorLocalY = null;
      this.lastCursorTime = 0;
      this.cursorVx = 0;
      this.cursorVy = 0;
      this.stationaryTime = 0;

      // Drag state
      this.isDragging = false;
      this.dragStartX = 0;
      this.dragStartY = 0;
      this.dragStartStagePercent = 85;
      this.pointerTrail = [];

      // Audio state
      this.audioCache = new Map();
      this.catArmed = false;
      this.bellArmed = false;
      this.lastPlayedTimes = new Map();
      this.soundArmedAt = performance.now() + 500;

      // Animation loop control
      this.rafId = null;
      this.isPaused = false;

      this.init();
    }

    createRopePoints() {
      this.segmentLength = this.ropeLength / (this.numPoints - 1);
      this.points = [];
      for (let i = 0; i < this.numPoints; i++) {
        const isFixed = (i === 0);
        const px = ANCHOR_X;
        const py = ANCHOR_Y + i * this.segmentLength;
        this.points.push(new VerletPoint(px, py, isFixed));
      }
    }

    resetRope(targetLen) {
      this.ropeLength = targetLen || 60;
      this.segmentLength = this.ropeLength / (this.numPoints - 1);
      for (let i = 0; i < this.numPoints; i++) {
        const px = ANCHOR_X;
        const py = ANCHOR_Y + i * this.segmentLength;
        if (this.points[i]) {
          this.points[i].reset(px, py);
        } else {
          this.points.push(new VerletPoint(px, py, i === 0));
        }
      }
      this.angle = 0;
      this.angularVelocity = 0;
      this.previousAngle = 0;
      this.horizontalOffset = 0;
      this.horizontalVelocity = 0;
    }

    init() {
      // 1. Create root element with Shadow DOM
      this.rootElement = document.getElementById('charmdrop-extension-root');
      if (!this.rootElement) {
        this.rootElement = document.createElement('div');
        this.rootElement.id = 'charmdrop-extension-root';
        (document.body || document.documentElement).appendChild(this.rootElement);
      }

      this.shadow = this.rootElement.attachShadow({ mode: 'open' });

      // 2. Build Shadow DOM structure
      this.shadow.innerHTML = `
        <style>
          :host {
            all: initial;
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 0;
            pointer-events: none;
            z-index: 2147483647;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }

          .charmdrop-stage {
            position: fixed;
            top: 0;
            width: 280px;
            height: 380px;
            pointer-events: none;
            user-select: none;
            -webkit-user-select: none;
            overflow: visible;
            transform: translateX(-50%);
            transition: opacity 0.25s ease-out;
          }

          .rope-canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 280px;
            height: 380px;
            pointer-events: none;
          }

          .charm-rig {
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 0;
            transform-origin: top center;
            pointer-events: none;
            will-change: transform;
          }

          .charm-container {
            position: absolute;
            top: 0;
            left: -50px;
            width: 100px;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            pointer-events: auto;
            cursor: grab;
            touch-action: none;
          }

          .charm-container:active {
            cursor: grabbing;
          }

          .charm-img {
            max-width: 96px;
            height: auto;
            object-fit: contain;
            user-select: none;
            -webkit-user-drag: none;
            pointer-events: none;
            filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.22));
            transition: opacity 0.2s ease-out;
          }

          .charm-img.is-faded {
            filter: grayscale(80%) opacity(60%) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
          }
        </style>

        <div id="stage" class="charmdrop-stage">
          <canvas id="ropeCanvas" class="rope-canvas" width="280" height="380"></canvas>
          <div id="charmRig" class="charm-rig">
            <div id="charmContainer" class="charm-container" title="CharmDrop • Drag or push to interact">
              <img id="charmImg" class="charm-img" alt="Charm" draggable="false" />
            </div>
          </div>
        </div>
      `;

      this.stageElement = this.shadow.getElementById('stage');
      this.canvas = this.shadow.getElementById('ropeCanvas');
      this.ctx = this.canvas.getContext('2d');
      this.rigElement = this.shadow.getElementById('charmRig');
      this.containerElement = this.shadow.getElementById('charmContainer');
      this.imageElement = this.shadow.getElementById('charmImg');

      // 3. Preload approved sounds
      this.preloadAudio('assets/sounds/dragon-studio-cartoon-cat-meow-487661.mp3');
      this.preloadAudio('assets/sounds/universfield-single-church-bell-2-352062.mp3');

      // 4. Load initial charm & apply position
      this.loadCharm(settings.selectedCharmId);
      this.updatePosition();
      this.updateVisibility();

      // 5. Setup listeners
      this.setupEventListeners();
      this.startAnimationLoop();

      // 6. Handle tab visibility change
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.pause();
        } else {
          this.resume();
        }
      });
    }

    preloadAudio(relPath) {
      if (!relPath || this.audioCache.has(relPath) || typeof Audio === 'undefined') return;
      try {
        const fullUrl = chrome.runtime.getURL(relPath);
        const audio = new Audio(fullUrl);
        audio.preload = 'auto';
        this.audioCache.set(relPath, audio);
      } catch (err) {}
    }

    playSound(relPath, volume = 0.35, soundType = 'default', cooldownMs = 3800) {
      if (!settings.soundEffectsEnabled) return false;
      const now = performance.now();
      if (now < this.soundArmedAt) return false;

      const lastTime = this.lastPlayedTimes.get(soundType) || 0;
      if (now - lastTime < cooldownMs) return false;

      let audio = this.audioCache.get(relPath);
      if (!audio) {
        this.preloadAudio(relPath);
        audio = this.audioCache.get(relPath);
      }
      if (!audio) return false;

      if (!audio.paused && !audio.ended && audio.currentTime > 0) {
        return false;
      }

      try {
        audio.volume = Math.max(0, Math.min(1, volume));
        audio.currentTime = 0;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.lastPlayedTimes.set(soundType, performance.now());
            })
            .catch(() => {});
          return true;
        }
      } catch (err) {}
      return false;
    }

    loadCharm(charmId) {
      this.currentCharm = getCharm(charmId);
      this.catArmed = false;
      this.bellArmed = false;
      this.soundArmedAt = performance.now() + 500;

      const targetLen = this.currentCharm.ropeLength || 60;
      this.resetRope(targetLen);

      if (this.imageElement) {
        this.imageElement.src = chrome.runtime.getURL(this.currentCharm.image);
        this.imageElement.alt = this.currentCharm.name;
        const maxW = this.currentCharm.maxWidth || 96;
        this.imageElement.style.maxWidth = `${maxW}px`;
      }
    }

    updatePosition() {
      if (!this.stageElement) return;
      let percentX = 85;

      switch (settings.positionMode) {
        case 'top-left':
          percentX = 12;
          break;
        case 'top-center':
          percentX = 50;
          break;
        case 'top-right':
          percentX = 88;
          break;
        case 'custom':
          percentX = typeof settings.customPercentX === 'number' ? settings.customPercentX : 85;
          break;
      }

      this.stageElement.style.left = `${percentX}%`;
    }

    updateVisibility() {
      if (!this.stageElement) return;
      this.stageElement.style.display = settings.enabled ? 'block' : 'none';
      if (!settings.enabled) {
        this.pause();
      } else if (!document.hidden) {
        this.resume();
      }
    }

    setupEventListeners() {
      // Mouse move proximity tracking
      window.addEventListener('mousemove', (e) => {
        if (!settings.enabled || this.isDragging) return;

        const stageRect = this.stageElement ? this.stageElement.getBoundingClientRect() : null;
        if (!stageRect) return;

        const localX = e.clientX - stageRect.left;
        const localY = e.clientY - stageRect.top;
        const now = performance.now();

        // Calculate cursor velocity
        if (this.lastCursorLocalX !== null && this.lastCursorTime > 0) {
          const dt = Math.max(8, Math.min(80, now - this.lastCursorTime));
          const instantVx = ((localX - this.lastCursorLocalX) / dt) * 16.67;
          const instantVy = ((localY - this.lastCursorLocalY) / dt) * 16.67;
          this.cursorVx = this.cursorVx * 0.35 + instantVx * 0.65;
          this.cursorVy = this.cursorVy * 0.35 + instantVy * 0.65;

          if (Math.hypot(this.cursorVx, this.cursorVy) < 0.30) {
            this.stationaryTime += dt;
          } else {
            this.stationaryTime = 0;
          }
        }

        this.lastCursorLocalX = localX;
        this.lastCursorLocalY = localY;
        this.lastCursorTime = now;

        const lastP = this.points[this.numPoints - 1] || { x: ANCHOR_X, y: this.ropeLength };
        const dx = localX - lastP.x;
        const dy = localY - (lastP.y + 40);
        const dist = Math.hypot(dx, dy);
        this.currentDist = dist;

        const proximityRadius = 180.0;
        if (dist <= proximityRadius) {
          const u = (proximityRadius - dist) / proximityRadius;
          this.proximityFactor = u * u * (3.0 - 2.0 * u);
          this.cursorPushDirX = dist > 1.0 ? -(dx / dist) : 0;
        } else {
          this.proximityFactor = 0;
          this.cursorPushDirX = 0;
          this.stationaryTime = 0;
        }
      }, { passive: true });

      // Drag handling
      const onStart = (e) => {
        if (e.button !== 0 || !settings.enabled) return;
        e.preventDefault();
        this.isDragging = true;
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;

        const currLeftPercent = parseFloat(this.stageElement.style.left) || 85;
        this.dragStartStagePercent = currLeftPercent;

        this.pointerTrail.length = 0;
        this.pointerTrail.push({ clientX: e.clientX, clientY: e.clientY, time: performance.now() });
      };

      this.containerElement.addEventListener('mousedown', onStart);
      this.containerElement.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
          onStart({
            button: 0,
            preventDefault: () => e.preventDefault(),
            clientX: e.touches[0].clientX,
            clientY: e.touches[0].clientY
          });
        }
      }, { passive: false });

      window.addEventListener('mousemove', (e) => {
        if (!this.isDragging) return;
        const deltaX = e.clientX - this.dragStartX;
        const viewportW = Math.max(320, window.innerWidth);
        const deltaPercent = (deltaX / viewportW) * 100;
        const newPercent = Math.max(5, Math.min(95, this.dragStartStagePercent + deltaPercent));

        this.stageElement.style.left = `${newPercent.toFixed(1)}%`;
        settings.positionMode = 'custom';
        settings.customPercentX = parseFloat(newPercent.toFixed(1));

        // Pull bottom rope point slightly with cursor
        const lastP = this.points[this.numPoints - 1];
        if (lastP) {
          lastP.x = ANCHOR_X + Math.max(-40, Math.min(40, deltaX * 0.25));
        }

        this.pointerTrail.push({ clientX: e.clientX, clientY: e.clientY, time: performance.now() });
        while (this.pointerTrail.length > 5) this.pointerTrail.shift();
      }, { passive: true });

      const onEnd = () => {
        if (!this.isDragging) return;
        this.isDragging = false;

        // Persist new position
        chrome.storage.local.set({
          positionMode: 'custom',
          customPercentX: settings.customPercentX
        });

        // Release momentum
        let releaseVx = 0;
        if (this.pointerTrail.length >= 2) {
          const oldest = this.pointerTrail[0];
          const newest = this.pointerTrail[this.pointerTrail.length - 1];
          const timeDiff = Math.max(16, newest.time - oldest.time);
          releaseVx = ((newest.clientX - oldest.clientX) / timeDiff) * 16.67;
        }

        const lastP = this.points[this.numPoints - 1];
        const boost = Math.max(-10, Math.min(10, releaseVx * 0.75 * (this.currentCharm.physics?.swingMultiplier || 1.0)));
        if (lastP) {
          lastP.oldX = lastP.x - boost;
        }
      };

      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchend', onEnd);

      // Mouse wheel impulse
      this.containerElement.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (this.isDragging) return;
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        const direction = delta > 0 ? 1 : -1;
        const impulse = direction * Math.min(Math.max(Math.abs(delta) * 0.05, 1.5), 5.0) * (this.currentCharm.physics?.swingMultiplier || 1.0);
        const lastP = this.points[this.numPoints - 1];
        if (lastP) {
          lastP.oldX = lastP.x - impulse;
        }
      }, { passive: false });
    }

    observeSound() {
      if (!settings.soundEffectsEnabled || !this.currentCharm || !this.currentCharm.sound) return;

      const soundConfig = this.currentCharm.sound;
      const soundType = soundConfig.type;
      const src = soundConfig.src;
      const volume = soundConfig.volume || 0.35;
      const cooldown = soundConfig.cooldown || 3800;
      const now = performance.now();
      const isReadyAfterSwitch = now >= this.soundArmedAt;

      const isInsideEnter = this.currentDist <= 140.0;
      const isOutsideExit = this.currentDist > 200.0;

      if (isOutsideExit && !this.isDragging && isReadyAfterSwitch) {
        this.catArmed = true;
      }

      if (soundType === 'cat') {
        if ((isInsideEnter || this.isDragging) && this.catArmed && isReadyAfterSwitch) {
          const hasReaction = this.proximityFactor > 0.12 || Math.abs(this.cursorVx) > 0.25 || this.isDragging;
          if (hasReaction) {
            const played = this.playSound(src, volume, 'cat', cooldown);
            if (played) this.catArmed = false;
          }
        }
      } else if (soundType === 'bell') {
        const absAngVel = Math.abs(this.angularVelocity || 0);
        const absHorizVel = Math.abs(this.horizontalVelocity || 0);
        const isSettled = absAngVel < 0.10 && Math.abs(this.angle) < 0.15 && absHorizVel < 0.25;
        const lastPlay = this.lastPlayedTimes.get('bell') || 0;
        const cooldownElapsed = now - lastPlay >= cooldown;

        if (!this.bellArmed && isReadyAfterSwitch && (isSettled || (isOutsideExit && cooldownElapsed))) {
          this.bellArmed = true;
        }

        const isMeaningfulImpulse = (isInsideEnter && (absAngVel > 0.55 || absHorizVel > 1.2 || Math.abs(this.cursorVx) > 0.30)) || this.isDragging;
        if (this.bellArmed && isMeaningfulImpulse && isReadyAfterSwitch) {
          const played = this.playSound(src, volume, 'bell', cooldown);
          if (played) this.bellArmed = false;
        }
      }
    }

    updatePhysics(now, dt) {
      if (this.isDragging) return;

      const dtScale = Math.min(2.0, Math.max(0.5, dt / 16.67));
      const physicsConfig = this.currentCharm.physics || {};
      const baseDamping = 0.990;
      const effectiveDamping = Math.max(0.985, Math.min(0.995, baseDamping * (physicsConfig.dampingMultiplier || 1.0)));
      const gravity = 0.30 / Math.sqrt(physicsConfig.weight || 1.0);

      const t = now * 0.001;
      const idleWind = (Math.sin(t * 0.85) * 0.40 + Math.sin(t * 0.48 + 1.2) * 0.22) * 0.85;

      const stationaryRelaxation = this.stationaryTime > 0
        ? Math.max(0.48, 1.0 - Math.min(1.0, this.stationaryTime / 350.0) * 0.52)
        : 1.0;

      const basePushForce = 2.2 * (physicsConfig.swingMultiplier || 1.0);
      const wakeStrength = 0.14 * (physicsConfig.swingMultiplier || 1.0);

      // Verlet Integration
      for (let i = 1; i < this.numPoints; i++) {
        const p = this.points[i];
        const frac = i / (this.numPoints - 1);
        const inf = frac < 0.25 ? Math.pow(frac / 0.25, 2) * 0.08 : frac < 0.75 ? 0.08 + ((frac - 0.25) / 0.5) * 0.52 : 0.60 + ((frac - 0.75) / 0.25) * 0.40;

        const vx = (p.x - p.oldX) * effectiveDamping;
        const vy = (p.y - p.oldY) * effectiveDamping;

        p.oldX = p.x;
        p.oldY = p.y;

        const fIdle = idleWind * inf * 0.05 * (1.0 - this.proximityFactor);
        const fPush = this.cursorPushDirX * this.proximityFactor * basePushForce * inf * stationaryRelaxation;
        const fWake = this.cursorVx * wakeStrength * this.proximityFactor * inf;

        p.x += vx + (fIdle + fPush + fWake) * dtScale;
        p.y += vy + (gravity * dtScale);
      }

      // Constraints
      for (let iter = 0; iter < CONSTRAINT_ITERATIONS; iter++) {
        this.points[0].x = ANCHOR_X;
        this.points[0].y = ANCHOR_Y;

        for (let i = 0; i < this.numPoints - 1; i++) {
          const pA = this.points[i];
          const pB = this.points[i + 1];
          const dx = pB.x - pA.x;
          const dy = pB.y - pA.y;
          const dist = Math.hypot(dx, dy);

          if (dist > 0.0001) {
            const diff = (dist - this.segmentLength) / dist;
            const ox = dx * 0.5 * diff;
            const oy = dy * 0.5 * diff;

            if (pA.fixed) {
              pB.x -= ox * 2;
              pB.y -= oy * 2;
            } else if (pB.fixed) {
              pA.x += ox * 2;
              pA.y += oy * 2;
            } else {
              pA.x -= ox;
              pA.y -= oy;
              pB.x -= ox;
              pB.y -= oy;
            }
          }
        }

        this.points[0].x = ANCHOR_X;
        this.points[0].y = ANCHOR_Y;
      }

      this.observeSound();
    }

    renderRope() {
      if (!this.ctx || !this.canvas || !this.points || this.points.length < 2) return;
      const ctx = this.ctx;
      const points = this.points;
      const num = this.numPoints;

      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const traceSpline = () => {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < num - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.quadraticCurveTo(points[num - 2].x, points[num - 2].y, points[num - 1].x, points[num - 1].y);
      };

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // 1. Outer Deep Shadow
      traceSpline();
      ctx.lineWidth = 3.2;
      ctx.strokeStyle = '#3E2108';
      ctx.stroke();

      // 2. Warm Golden-Brown Core
      traceSpline();
      ctx.lineWidth = 2.6;
      ctx.strokeStyle = '#8E5624';
      ctx.stroke();

      // 3. Braided Gold Highlights
      traceSpline();
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1.1;
      ctx.strokeStyle = '#C79354';
      ctx.stroke();

      // 4. Silky Sheen Center Line
      ctx.setLineDash([]);
      traceSpline();
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = 'rgba(255, 238, 205, 0.40)';
      ctx.stroke();

      // 5. Top Anchor Grommet
      ctx.fillStyle = '#CA8A04';
      ctx.beginPath();
      ctx.arc(ANCHOR_X, 1.5, 2.8, 0, Math.PI * 2);
      ctx.fill();

      // 6. Bottom Bead Connector Stack
      const lastP = points[num - 1];
      const prevP = points[num - 2];
      const dx = lastP.x - prevP.x;
      const dy = lastP.y - prevP.y;
      const tangentRad = Math.atan2(dx, dy);

      ctx.save();
      ctx.translate(lastP.x, lastP.y);
      ctx.rotate(-tangentRad);

      // Gold Crimp
      ctx.fillStyle = '#CA8A04';
      ctx.fillRect(-2.5, -0.5, 5.0, 2.5);

      // Crimson Bead
      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.arc(0, 4.0, 3.2, 0, Math.PI * 2);
      ctx.fill();

      // Gold Jump Ring
      ctx.strokeStyle = '#EAB308';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 7.8, 2.0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
      ctx.restore();
    }

    renderCharm() {
      const lastP = this.points[this.numPoints - 1];
      const prevP = this.points[this.numPoints - 2];
      const dx = lastP.x - prevP.x;
      const dy = lastP.y - prevP.y;
      const tangentAngle = Math.atan2(dx, dy) * (180 / Math.PI);
      const maxRot = this.isDragging ? 14 : 9;
      const clampedAngle = Math.max(-maxRot, Math.min(maxRot, tangentAngle));

      this.angle = clampedAngle;
      this.angularVelocity = tangentAngle - this.previousAngle;
      this.previousAngle = tangentAngle;
      this.horizontalOffset = lastP.x - ANCHOR_X;
      this.horizontalVelocity = (lastP.x - lastP.oldX);

      const attachX = lastP.x;
      const attachY = lastP.y + 7.8 - 1.5;

      if (this.rigElement) {
        this.rigElement.style.transform = `translate3d(${attachX.toFixed(1)}px, ${attachY.toFixed(1)}px, 0) rotate(${clampedAngle.toFixed(1)}deg)`;
      }
    }

    startAnimationLoop() {
      let lastTime = performance.now();
      const loop = (now) => {
        if (!this.isPaused && settings.enabled) {
          const dt = Math.min(32, now - lastTime);
          lastTime = now;
          this.updatePhysics(now, dt);
          this.renderRope();
          this.renderCharm();
        }
        this.rafId = requestAnimationFrame(loop);
      };
      this.rafId = requestAnimationFrame(loop);
    }

    pause() {
      this.isPaused = true;
    }

    resume() {
      if (this.isPaused) {
        this.isPaused = false;
      }
    }
  }

  // Initialize controller when DOM is ready
  let controller = null;

  async function start() {
    try {
      const stored = await chrome.storage.local.get(null);
      settings = { ...settings, ...stored };
    } catch (err) {}

    controller = new ExtensionCharmController();

    // Listen for storage changes from popup
    chrome.storage.onChanged.addListener((changes) => {
      let positionChanged = false;
      let charmChanged = false;
      let visibilityChanged = false;

      for (const [key, change] of Object.entries(changes)) {
        settings[key] = change.newValue;
        if (key === 'positionMode' || key === 'customPercentX') positionChanged = true;
        if (key === 'selectedCharmId') charmChanged = true;
        if (key === 'enabled') visibilityChanged = true;
      }

      if (controller) {
        if (charmChanged) controller.loadCharm(settings.selectedCharmId);
        if (positionChanged) controller.updatePosition();
        if (visibilityChanged) controller.updateVisibility();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();

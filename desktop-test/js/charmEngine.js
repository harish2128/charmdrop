/**
 * Reusable Flexible Verlet Rope & Charm Physics Engine
 * 
 * Physics System:
 * - 12-point Verlet particle rope simulation with distance constraint relaxation (4 iterations)
 * - Fixed top anchor at desktop screen top (170, 0)
 * - Weighted cursor proximity repulsion & flick wake forces on lower rope points (top 25% stable, bottom 25% reactive)
 * - Natural wave propagation, slight flexible cord inertia / lag, and organic breeze
 * - Smooth quadratic Bézier spline rendering to Canvas
 * - True momentum release physics (2-4 natural oscillation cycles before settling)
 * - Bottom attachment point coordinates and tangent segment angle driving charm orientation
 * - Full manual drag priority & multi-display window movement integration
 * - Zero transform fighting or duplicate RAF loops
 */

export const ENGINE_STATES = {
  IDLE: 'IDLE',
  PROXIMITY_ACTIVE: 'PROXIMITY_ACTIVE',
  DRAGGING: 'DRAGGING',
  RELEASE_PHYSICS: 'RELEASE_PHYSICS',
  SETTLING: 'SETTLING'
};

const WINDOW_CENTER_X = 170;
const ANCHOR_Y = 0;
const CHARM_CENTER_Y = 135;
const DEFAULT_NUM_POINTS = 12;
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

export class CharmEngine {
  constructor({ rigElement, containerElement, canvasElement, onTransformUpdate, config = {} }) {
    this.rig = rigElement;
    this.container = containerElement;
    this.canvas = canvasElement || document.getElementById('ropeCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.onTransformUpdate = onTransformUpdate;

    // Physics Configuration
    this.config = {
      numPoints: config.numPoints || DEFAULT_NUM_POINTS,
      constraintIterations: config.constraintIterations || CONSTRAINT_ITERATIONS,
      ropeLengthPx: config.ropeLengthPx || 70.0,
      damping: config.damping || 0.980,
      proximityRadius: config.proximityRadius || 220.0,
      maxDragAngleDeg: config.maxDragAngleDeg || 38.0,
      maxPullYPx: config.maxPullYPx || 80.0,
      ...config
    };

    // Verlet Rope State
    this.numPoints = this.config.numPoints;
    this.ropeLength = this.config.ropeLengthPx;
    this.segmentLength = this.ropeLength / (this.numPoints - 1);
    this.points = [];
    this.ropeColor = '#6B4423';
    this.createRopePoints(this.ropeLength);

    // Shared State & Metrics
    this.state = ENGINE_STATES.IDLE;
    this.angle = 0;
    this.angularVelocity = 0;
    this.previousAngle = 0;
    this.horizontalOffset = 0;
    this.horizontalVelocity = 0;
    this.posY = 0;
    this.velY = 0;

    // Per-charm dynamic physical characteristics
    this.charmPhysics = {
      weight: 1.0,
      swingMultiplier: 1.0,
      dampingMultiplier: 1.0
    };

    // Cursor tracking state
    this.proximityFactor = 0;
    this.cursorPushDirX = 0;
    this.currentDist = 9999;
    this.isInsideInteractionZone = false;
    this.lastCursorLocalX = null;
    this.lastCursorLocalY = null;
    this.lastCursorTime = 0;
    this.cursorVx = 0;
    this.cursorVy = 0;
    this.stationaryTime = 0;

    // Drag State
    this.isDragging = false;
    this.dragStartScreenX = 0;
    this.dragStartScreenY = 0;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.lastScreenMoveX = 0;
    this.pointerTrail = [];

    // Preset movement suppression & mouse pass-through
    this.isPresetMoving = false;
    this.isIgnoringMouse = true;
    this.isDebugMode = false;

    // Selector UI Safe Zone separation
    this.isSelectorOpen = false;
    this.selectorElement = null;

    this.init();
  }

  // Backward compatibility getters
  get velAngle() {
    return this.angularVelocity;
  }
  set velAngle(val) {
    this.angularVelocity = val;
  }

  get danceX() {
    return this.horizontalOffset;
  }
  set danceX(val) {
    this.horizontalOffset = val;
  }

  createRopePoints(ropeLength) {
    this.ropeLength = ropeLength || this.config.ropeLengthPx || 70;
    this.segmentLength = this.ropeLength / (this.numPoints - 1);
    this.points = [];
    for (let i = 0; i < this.numPoints; i++) {
      const isFixed = (i === 0);
      const px = WINDOW_CENTER_X;
      const py = ANCHOR_Y + i * this.segmentLength;
      this.points.push(new VerletPoint(px, py, isFixed));
    }
  }

  resetRope(targetRopeLength) {
    const len = targetRopeLength || this.ropeLength || 70;
    this.ropeLength = len;
    this.segmentLength = len / (this.numPoints - 1);
    for (let i = 0; i < this.numPoints; i++) {
      const px = WINDOW_CENTER_X;
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
    this.posY = 0;
    this.state = ENGINE_STATES.IDLE;
  }

  setCharmConfig(physicsConfig = {}, ropeLength = null, ropeColor = '#6B4423', charm = null) {
    this.currentCharm = charm;
    this.charmPhysics = {
      weight: typeof physicsConfig.weight === 'number' ? physicsConfig.weight : 1.0,
      swingMultiplier: typeof physicsConfig.swingMultiplier === 'number' ? physicsConfig.swingMultiplier : 1.0,
      dampingMultiplier: typeof physicsConfig.dampingMultiplier === 'number' ? physicsConfig.dampingMultiplier : 1.0
    };
    this.ropeColor = ropeColor || '#6B4423';
    const targetLen = ropeLength || this.config.ropeLengthPx || 70;
    if (Math.abs(this.ropeLength - targetLen) > 1) {
      this.resetRope(targetLen);
    }
  }

  setDebugMode(enabled) {
    this.isDebugMode = !!enabled;
  }

  init() {
    this.setupCursorTracking();
    this.setupEventListeners();
    this.startAnimationLoop();
  }

  setupCursorTracking() {
    const handleCursorPosition = (localX, localY, now = performance.now()) => {
      if (this.isDragging || this.isPresetMoving) {
        this.proximityFactor = 0;
        this.cursorPushDirX = 0;
        this.currentDist = 9999;
        return;
      }

      // Calculate low-latency cursor velocity
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

      // Distance relative to charm bottom attachment point
      const lastP = this.points[this.numPoints - 1] || { x: WINDOW_CENTER_X, y: this.ropeLength };
      const dx = localX - lastP.x;
      const dy = localY - (lastP.y + 45);
      const dist = Math.hypot(dx, dy);
      this.currentDist = dist;

      // Hysteresis boundary (Enter: <= 150px, Exit: > 220px)
      if (dist <= 150.0) {
        this.isInsideInteractionZone = true;
      } else if (dist > this.config.proximityRadius) {
        this.isInsideInteractionZone = false;
      }

      if (dist <= this.config.proximityRadius) {
        // Smooth inverse proximity falloff
        const u = (this.config.proximityRadius - dist) / this.config.proximityRadius;
        this.proximityFactor = u * u * (3.0 - 2.0 * u);

        // Direction to push charm AWAY from cursor (+1 right, -1 left)
        this.cursorPushDirX = dist > 1.0 ? -(dx / dist) : 0;

        // Enable click interaction when near charm
        if (this.isIgnoringMouse && window.electronAPI && window.electronAPI.setIgnoreMouseEvents) {
          window.electronAPI.setIgnoreMouseEvents(false);
          this.isIgnoringMouse = false;
        }
      } else {
        this.proximityFactor = 0;
        this.cursorPushDirX = 0;
        this.stationaryTime = 0;

        if (!this.isIgnoringMouse && !this.isDragging && window.electronAPI && window.electronAPI.setIgnoreMouseEvents) {
          window.electronAPI.setIgnoreMouseEvents(true, { forward: true });
          this.isIgnoringMouse = true;
        }
      }
    };

    if (window.electronAPI && window.electronAPI.onCursorPositionUpdate) {
      window.electronAPI.onCursorPositionUpdate(({ localX, localY }) => {
        handleCursorPosition(localX, localY);
      });
    }

    window.addEventListener('mousemove', (e) => {
      handleCursorPosition(e.clientX, e.clientY);
    });

    window.addEventListener('mouseleave', () => {
      this.proximityFactor = 0;
      this.cursorPushDirX = 0;
      this.currentDist = 9999;
      this.lastCursorLocalX = null;
      this.lastCursorLocalY = null;
      this.cursorVx = 0;
      this.cursorVy = 0;
      this.stationaryTime = 0;
      if (!this.isSelectorOpen && !this.isIgnoringMouse && !this.isDragging && window.electronAPI && window.electronAPI.setIgnoreMouseEvents) {
        window.electronAPI.setIgnoreMouseEvents(true, { forward: true });
        this.isIgnoringMouse = true;
      }
    });
  }

  setupEventListeners() {
    // Mouse wheel impulse
    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (this.isDragging) return;

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const direction = delta > 0 ? 1 : -1;
      const impulse = direction * Math.min(Math.max(Math.abs(delta) * 0.06, 2.0), 6.5) * this.charmPhysics.swingMultiplier;

      const lastP = this.points[this.numPoints - 1];
      if (lastP) {
        lastP.oldX = lastP.x - impulse;
      }
      this.state = ENGINE_STATES.SETTLING;
    }, { passive: false });

    // Drag start
    const onStart = (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      if (e.pointerId !== undefined) {
        try {
          this.container.setPointerCapture(e.pointerId);
        } catch (err) {}
      }
      this.handleDragStart(e);
    };

    this.container.addEventListener('pointerdown', onStart);
    this.container.addEventListener('mousedown', onStart);

    // Drag move
    window.addEventListener('pointermove', (e) => {
      if (this.isDragging) this.handleDragMove(e);
    });
    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) this.handleDragMove(e);
    });

    // Drag end
    const onEnd = (e) => {
      if (this.isDragging) this.handleDragEnd(e);
    };
    window.addEventListener('pointerup', onEnd);
    window.addEventListener('pointercancel', onEnd);
    window.addEventListener('mouseup', onEnd);
  }

  handleDragStart(e) {
    this.isDragging = true;
    this.state = ENGINE_STATES.DRAGGING;
    this.container.classList.add('is-grabbing');

    const clientX = e.clientX;
    const clientY = e.clientY;

    this.dragStartX = clientX;
    this.dragStartY = clientY;

    this.pointerTrail.length = 0;
    this.pointerTrail.push({ clientX, clientY, time: performance.now() });

    if (this.isIgnoringMouse && window.electronAPI && window.electronAPI.setIgnoreMouseEvents) {
      window.electronAPI.setIgnoreMouseEvents(false);
      this.isIgnoringMouse = false;
    }
  }

  handleDragMove(e) {
    if (!this.isDragging) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    // Follow cursor within transparent charm canvas (Top anchor at 170, 0 stays fixed)
    const targetDragX = Math.max(25, Math.min(WINDOW_WIDTH - 25, clientX));
    const targetDragY = Math.max(ANCHOR_Y + 40, Math.min(WINDOW_HEIGHT - 50, clientY - 15));

    const lastP = this.points[this.numPoints - 1];
    lastP.x = targetDragX;
    lastP.y = targetDragY;

    this.applyConstraints();

    this.pointerTrail.push({ clientX, clientY, time: performance.now() });
    while (this.pointerTrail.length > 6) {
      this.pointerTrail.shift();
    }
  }

  handleDragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.container.classList.remove('is-grabbing');

    let releaseVx = 0;
    let releaseVy = 0;
    if (this.pointerTrail.length >= 2) {
      const oldest = this.pointerTrail[0];
      const newest = this.pointerTrail[this.pointerTrail.length - 1];
      const timeDiff = Math.max(16, newest.time - oldest.time);
      const frames = timeDiff / 16.67;
      releaseVx = (newest.clientX - oldest.clientX) / frames;
      releaseVy = (newest.clientY - oldest.clientY) / frames;
    }

    // Inject gentle, natural release momentum into lower rope points (no violent flick)
    const lastP = this.points[this.numPoints - 1];
    const boost = Math.max(-5.0, Math.min(5.0, releaseVx * 0.35 * this.charmPhysics.swingMultiplier));
    lastP.oldX = lastP.x - boost;
    lastP.oldY = lastP.y - Math.max(-2.5, Math.min(2.5, releaseVy * 0.25));

    // Propagate momentum wave to neighboring lower points for natural settlement
    const lowerStart = Math.floor(this.numPoints * 0.55);
    for (let i = this.numPoints - 2; i >= lowerStart; i--) {
      const factor = (i - lowerStart) / (this.numPoints - 1 - lowerStart);
      this.points[i].oldX = this.points[i].x - boost * factor * 0.60;
    }

    this.state = ENGINE_STATES.SETTLING;
  }

  startAnimationLoop() {
    let lastTime = performance.now();
    const loop = (now) => {
      const dt = Math.min(32, now - lastTime);
      lastTime = now;
      this.updatePhysics(now, dt);
      this.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  getOrganicIdleForce(now) {
    // Slower, calmer natural time scale for gentle organic sway
    const t = now * 0.0006;
    const h1 = Math.sin(t * 0.65) * 0.32;
    const h2 = Math.sin(t * 0.35 + 1.2) * 0.18;
    const h3 = Math.sin(t * 0.90 + 2.7) * 0.08;
    const breath = 0.90 + 0.10 * Math.sin(t * 0.12);
    return (h1 + h2 + h3) * breath;
  }

  updatePhysics(now, dt) {
    if (this.isDragging || this.isPresetMoving) {
      return;
    }

    const dtScale = Math.min(2.0, Math.max(0.5, dt / 16.67));

    // Damping: Smooth settling damping (~0.975 - 0.985)
    const baseDamping = this.config.damping || 0.980;
    const effectiveDamping = Math.max(0.975, Math.min(0.985, baseDamping * (this.charmPhysics.dampingMultiplier || 1.0)));

    // Subtle downward gravity (pulls points downward so rope hangs naturally)
    const gravity = 0.32 / Math.sqrt(this.charmPhysics.weight || 1.0);

    // Organic idle wind sway (gentle, calming breeze)
    const idleWind = this.getOrganicIdleForce(now);

    // Stationary cursor stabilization
    const stationaryRelaxation = this.stationaryTime > 0
      ? Math.max(0.48, 1.0 - Math.min(1.0, this.stationaryTime / 350.0) * 0.52)
      : 1.0;

    // Smooth proximity push and gentle wake
    const basePushForce = 0.75 * (this.charmPhysics.swingMultiplier || 1.0);
    const wakeStrength = 0.045 * (this.charmPhysics.swingMultiplier || 1.0);

    // Verlet Integration for points 1..11
    for (let i = 1; i < this.numPoints; i++) {
      const p = this.points[i];
      const t = i / (this.numPoints - 1);

      // Force weighting profile along rope
      let inf = 0;
      if (t < 0.25) {
        inf = Math.pow(t / 0.25, 2) * 0.08;
      } else if (t < 0.75) {
        inf = 0.08 + ((t - 0.25) / 0.5) * 0.52;
      } else {
        inf = 0.60 + ((t - 0.75) / 0.25) * 0.40;
      }

      const vx = (p.x - p.oldX) * effectiveDamping;
      const vy = (p.y - p.oldY) * effectiveDamping;

      p.oldX = p.x;
      p.oldY = p.y;

      const fIdle = idleWind * inf * 0.028 * (1.0 - this.proximityFactor);
      const fPush = this.cursorPushDirX * this.proximityFactor * basePushForce * inf * stationaryRelaxation;
      const fWake = this.cursorVx * wakeStrength * this.proximityFactor * inf;
      const combinedForceX = Math.max(-1.8, Math.min(1.8, fIdle + fPush + fWake));

      p.x += vx + combinedForceX * dtScale;
      p.y += vy + (gravity * dtScale);
    }

    // Apply distance constraints
    this.applyConstraints();

    // Determine state
    if (this.proximityFactor > 0.02) {
      this.state = ENGINE_STATES.PROXIMITY_ACTIVE;
    } else {
      const lastP = this.points[this.numPoints - 1];
      const speed = Math.hypot(lastP.x - lastP.oldX, lastP.y - lastP.oldY);
      if (speed > 0.05 || Math.abs(lastP.x - WINDOW_CENTER_X) > 0.5) {
        this.state = ENGINE_STATES.SETTLING;
      } else {
        this.state = ENGINE_STATES.IDLE;
      }
    }
  }

  applyConstraints() {
    const iterations = this.config.constraintIterations || CONSTRAINT_ITERATIONS;
    for (let iter = 0; iter < iterations; iter++) {
      this.points[0].x = WINDOW_CENTER_X;
      this.points[0].y = ANCHOR_Y;

      for (let i = 0; i < this.numPoints - 1; i++) {
        const pA = this.points[i];
        const pB = this.points[i + 1];

        const dx = pB.x - pA.x;
        const dy = pB.y - pA.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 0.0001) {
          const diff = (dist - this.segmentLength) / dist;
          const offsetX = dx * 0.5 * diff;
          const offsetY = dy * 0.5 * diff;

          if (pA.fixed) {
            pB.x -= offsetX * 2;
            pB.y -= offsetY * 2;
          } else if (pB.fixed) {
            pA.x += offsetX * 2;
            pA.y += offsetY * 2;
          } else {
            pA.x += offsetX;
            pA.y += offsetY;
            pB.x -= offsetX;
            pB.y -= offsetY;
          }
        }
      }

      this.points[0].x = WINDOW_CENTER_X;
      this.points[0].y = ANCHOR_Y;
    }
  }

  suspendForPresetMove() {
    this.isPresetMoving = true;
    this.proximityFactor = 0;
    this.cursorPushDirX = 0;
    this.currentDist = 9999;
    this.cursorVx = 0;
  }

  resumeAfterPresetMove(direction = 0) {
    this.isPresetMoving = false;
    if (direction !== 0) {
      const impulse = -direction * 4.5;
      const lastP = this.points[this.numPoints - 1];
      if (lastP) {
        lastP.oldX = lastP.x - impulse;
      }
      this.state = ENGINE_STATES.SETTLING;
    } else {
      this.state = ENGINE_STATES.IDLE;
    }
  }

  renderRope() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.points || this.points.length < 2) return;

    const ctx = this.ctx;
    const numPoints = this.numPoints;
    const points = this.points;

    // Helper: trace smooth Bézier spline through all Verlet points
    const traceSpline = () => {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < numPoints - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      ctx.quadraticCurveTo(
        points[numPoints - 2].x,
        points[numPoints - 2].y,
        points[numPoints - 1].x,
        points[numPoints - 1].y
      );
    };

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 1. Outer Deep Shadow / Braid Edge
    traceSpline();
    ctx.lineWidth = 3.4;
    ctx.strokeStyle = '#3E2108';
    ctx.stroke();

    // 2. Warm Golden-Brown Braided Core
    traceSpline();
    ctx.lineWidth = 2.8;
    ctx.strokeStyle = '#8E5624';
    ctx.stroke();

    // 3. Braided Weave Highlights (diagonal alternating gold thread strands)
    traceSpline();
    ctx.setLineDash([3.5, 3.5]);
    ctx.lineDashOffset = 0;
    ctx.lineWidth = 1.3;
    ctx.strokeStyle = '#C79354';
    ctx.stroke();

    // 4. Braided Crease Shadow (interleaved weave shadow)
    traceSpline();
    ctx.setLineDash([3.5, 3.5]);
    ctx.lineDashOffset = 3.5;
    ctx.lineWidth = 0.9;
    ctx.strokeStyle = '#4A280B';
    ctx.stroke();

    // 5. Silky Sheen Center Line
    ctx.setLineDash([]);
    traceSpline();
    ctx.lineWidth = 0.7;
    ctx.strokeStyle = 'rgba(255, 238, 205, 0.40)';
    ctx.stroke();

    // 6. Top Anchor Grommet / Bead
    const topGrommetGrad = ctx.createRadialGradient(
      WINDOW_CENTER_X - 0.5, 1.0, 0.3,
      WINDOW_CENTER_X, 1.5, 3.0
    );
    topGrommetGrad.addColorStop(0, '#FDE047');
    topGrommetGrad.addColorStop(0.5, '#CA8A04');
    topGrommetGrad.addColorStop(1, '#451A03');

    ctx.fillStyle = topGrommetGrad;
    ctx.beginPath();
    ctx.arc(WINDOW_CENTER_X, 1.5, 3.0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#291404';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // 7. Bottom Bead Connector Stack (Gold crimp -> Red lacquer bead -> Gold ring)
    const lastP = points[numPoints - 1];
    const prevP = points[numPoints - 2];
    const dx = lastP.x - prevP.x;
    const dy = lastP.y - prevP.y;
    const tangentRad = Math.atan2(dx, dy);

    ctx.save();
    ctx.translate(lastP.x, lastP.y);
    ctx.rotate(-tangentRad);

    // 7a. Top Gold Crimp / Rondelle
    const goldGrad = ctx.createLinearGradient(-3, 0, 3, 0);
    goldGrad.addColorStop(0, '#CA8A04');
    goldGrad.addColorStop(0.4, '#FDE047');
    goldGrad.addColorStop(1, '#A16207');

    ctx.fillStyle = goldGrad;
    ctx.beginPath();
    ctx.roundRect(-2.8, -0.5, 5.6, 2.8, 1);
    ctx.fill();
    ctx.strokeStyle = '#78350F';
    ctx.lineWidth = 0.6;
    ctx.stroke();

    // 7b. Polished Crimson Red Bead
    const redBeadGrad = ctx.createRadialGradient(-0.8, 3.2, 0.5, 0, 4.4, 3.6);
    redBeadGrad.addColorStop(0, '#F87171');
    redBeadGrad.addColorStop(0.35, '#DC2626');
    redBeadGrad.addColorStop(0.85, '#991B1B');
    redBeadGrad.addColorStop(1, '#450A0A');

    ctx.fillStyle = redBeadGrad;
    ctx.beginPath();
    ctx.arc(0, 4.4, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Specular Highlight on Red Bead
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.beginPath();
    ctx.arc(-1.1, 3.2, 0.85, 0, Math.PI * 2);
    ctx.fill();

    // 7c. Bottom Gold Jump Ring Connector
    ctx.strokeStyle = '#EAB308';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(0, 8.6, 2.2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
    ctx.restore();

    if (this.isDebugMode) {
      this.renderDebugVisuals();
    }
  }

  renderDebugVisuals() {
    if (!this.ctx) return;

    // Draw Verlet points
    for (let i = 0; i < this.numPoints; i++) {
      const p = this.points[i];
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, i === 0 ? 4 : (i === this.numPoints - 1 ? 4.5 : 2.5), 0, Math.PI * 2);
      this.ctx.fillStyle = i === 0 ? '#10B981' : (i === this.numPoints - 1 ? '#EF4444' : '#3B82F6');
      this.ctx.fill();
    }

    // Attachment verification:
    // RED DOT = final rope point (lastP)
    // GREEN DOT = charm attachment point
    const lastP = this.points[this.numPoints - 1];
    if (lastP) {
      this.ctx.beginPath();
      this.ctx.arc(lastP.x, lastP.y, 4, 0, Math.PI * 2);
      this.ctx.fillStyle = '#EF4444';
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.arc(lastP.x, lastP.y, 2.5, 0, Math.PI * 2);
      this.ctx.fillStyle = '#10B981';
      this.ctx.fill();
    }

    // Draw anchor crosshair
    this.ctx.strokeStyle = '#10B981';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(WINDOW_CENTER_X - 10, ANCHOR_Y);
    this.ctx.lineTo(WINDOW_CENTER_X + 10, ANCHOR_Y);
    this.ctx.stroke();
  }

  renderCharm() {
    const lastP = this.points[this.numPoints - 1];
    const prevP = this.points[this.numPoints - 2];

    // Compute tangent angle from bottom rope segment
    const dx = lastP.x - prevP.x;
    const dy = lastP.y - prevP.y;
    const tangentAngle = Math.atan2(dx, dy) * (180 / Math.PI);

    // Clamp angle safely: ±5-7° normal, up to ±10° on flick
    const maxRot = this.isDragging ? 14 : 10;
    const clampedAngle = Math.max(-maxRot, Math.min(maxRot, tangentAngle));

    this.angle = clampedAngle;
    this.angularVelocity = tangentAngle - this.previousAngle;
    this.previousAngle = tangentAngle;

    this.horizontalOffset = lastP.x - WINDOW_CENTER_X;
    this.horizontalVelocity = (lastP.x - lastP.oldX);
    this.posY = Math.max(0, lastP.y - this.ropeLength);

    // Position charm directly at the bottom connector ring with 2.0px intentional visual overlap
    const beadStackHeight = 8.6;
    const overlap = 2.0;
    const attachX = lastP.x;
    const attachY = lastP.y + beadStackHeight - overlap;

    const transformStr = `translate3d(${attachX.toFixed(2)}px, ${attachY.toFixed(2)}px, 0) rotate(${clampedAngle.toFixed(2)}deg)`;
    if (this.rig) {
      this.rig.style.transform = transformStr;
    }

    if (typeof this.onTransformUpdate === 'function') {
      this.onTransformUpdate({
        angle: this.angle,
        angularVelocity: this.angularVelocity,
        posY: this.posY,
        velY: this.velY,
        danceX: this.horizontalOffset,
        horizontalOffset: this.horizontalOffset,
        horizontalVelocity: this.horizontalVelocity,
        dist: this.currentDist !== undefined ? this.currentDist : 9999,
        proximityFactor: this.proximityFactor,
        isInsideInteractionZone: this.isInsideInteractionZone,
        cursorVx: this.cursorVx,
        cursorVy: this.cursorVy,
        isDragging: this.isDragging,
        state: this.state,
        charmPhysics: this.charmPhysics,
        lastPoint: lastP,
        points: this.points,
        transformStr
      });
    }
  }

  render() {
    this.renderRope();
    this.renderCharm();
  }
}

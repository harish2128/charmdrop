/**
 * Interactive Audio Synthesis for CharmDrop Desktop
 * Web Audio API synthesizer for bell and cat interactions
 */

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

const lastPlayedTimes = {};

function canPlaySound(soundKey, cooldownMs = 600) {
  const now = Date.now();
  if (lastPlayedTimes[soundKey] && now - lastPlayedTimes[soundKey] < cooldownMs) {
    return false;
  }
  lastPlayedTimes[soundKey] = now;
  return true;
}

export function playBellChime() {
  if (!canPlaySound("bell", 750)) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const playSingleChime = (startTime, fundamentalFreq, volume = 0.22) => {
    const harmonics = [
      { freqRatio: 1.0, gain: 1.0, decay: 1.4 },
      { freqRatio: 2.0, gain: 0.55, decay: 0.9 },
      { freqRatio: 2.76, gain: 0.35, decay: 0.7 },
      { freqRatio: 4.1, gain: 0.22, decay: 0.5 },
      { freqRatio: 5.4, gain: 0.12, decay: 0.35 }
    ];

    harmonics.forEach(({ freqRatio, gain: hGain, decay }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(fundamentalFreq * freqRatio, startTime);

      gainNode.gain.setValueAtTime(0.0001, startTime);
      gainNode.gain.exponentialRampToValueAtTime(volume * hGain, startTime + 0.015);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + decay);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + decay + 0.05);
    });
  };

  const now = ctx.currentTime;
  playSingleChime(now, 1046.5, 0.24);
  playSingleChime(now + 0.24, 1318.5, 0.20);
}

export function playCatMeow() {
  if (!canPlaySound("cat", 850)) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const playSingleMeow = (startTime, duration = 0.32, volume = 0.18, pitchScale = 1.0) => {
    const osc = ctx.createOscillator();
    const bandpass = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    osc.type = "triangle";

    osc.frequency.setValueAtTime(380 * pitchScale, startTime);
    osc.frequency.exponentialRampToValueAtTime(740 * pitchScale, startTime + duration * 0.45);
    osc.frequency.exponentialRampToValueAtTime(460 * pitchScale, startTime + duration);

    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(950 * pitchScale, startTime);
    bandpass.frequency.linearRampToValueAtTime(1400 * pitchScale, startTime + duration * 0.45);
    bandpass.frequency.linearRampToValueAtTime(800 * pitchScale, startTime + duration);
    bandpass.Q.setValueAtTime(3.5, startTime);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.06);
    gainNode.gain.setValueAtTime(volume * 0.9, startTime + duration * 0.6);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(bandpass);
    bandpass.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  };

  const now = ctx.currentTime;
  playSingleMeow(now, 0.34, 0.20, 1.0);
  playSingleMeow(now + 0.38, 0.28, 0.16, 1.12);
}

export function playCharmSound(charmOrKey) {
  const key = typeof charmOrKey === "string" ? charmOrKey : charmOrKey?.id || charmOrKey?.iconKey;
  if (!key) return;

  if (key === "lucky-bell" || key.includes("bell")) {
    playBellChime();
  } else if (key === "lucky-cat" || key.includes("cat")) {
    playCatMeow();
  }
}

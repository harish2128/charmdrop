/**
 * Canonical Website Sound Effects Engine for CharmDrop
 * Uses the exact approved MP3 assets matching the Windows desktop application.
 *
 * ONLY Fortune Bell and Lucky Cat produce audio. All other charms are silent.
 * Includes audio preloading, overlap prevention, cooldown tracking, and graceful
 * autoplay restriction handling.
 */

const APPROVED_BELL_AUDIO_PATH = "/assets/sounds/universfield-single-church-bell-2-352062.mp3";
const APPROVED_CAT_AUDIO_PATH = "/assets/sounds/dragon-studio-cartoon-cat-meow-487661.mp3";

// Preloaded Audio instances cache
const audioCache = new Map();
const lastPlayedTimes = new Map();

/**
 * Safely initializes or retrieves a preloaded Audio element
 * @param {string} src
 * @param {number} defaultVolume
 * @returns {HTMLAudioElement|null}
 */
function getPreloadedAudio(src, defaultVolume = 0.40) {
  if (typeof window === "undefined" || typeof Audio === "undefined") return null;

  if (!audioCache.has(src)) {
    try {
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.volume = defaultVolume;
      audioCache.set(src, audio);
    } catch (e) {
      return null;
    }
  }

  const audio = audioCache.get(src);
  if (audio) {
    audio.volume = defaultVolume;
  }
  return audio;
}

// Initialize preloading on client side
if (typeof window !== "undefined") {
  try {
    getPreloadedAudio(APPROVED_BELL_AUDIO_PATH, 0.40);
    getPreloadedAudio(APPROVED_CAT_AUDIO_PATH, 0.40);
  } catch (e) {
    // Ignore early instantiation if browser restricts
  }
}

/**
 * Checks cooldown and overlap status
 * @param {string} soundKey
 * @param {number} cooldownMs
 * @param {HTMLAudioElement} audio
 * @returns {boolean}
 */
function canPlay(soundKey, cooldownMs, audio) {
  const now = Date.now();
  const lastTime = lastPlayedTimes.get(soundKey) || 0;
  if (now - lastTime < cooldownMs) {
    return false;
  }

  if (audio && !audio.paused && !audio.ended && audio.currentTime > 0) {
    return false;
  }

  return true;
}

/**
 * Plays the approved Fortune Bell temple chime sound
 */
export function playBellChime() {
  const audio = getPreloadedAudio(APPROVED_BELL_AUDIO_PATH, 0.40);
  if (!audio || !canPlay("bell", 1200, audio)) return;

  audio.currentTime = 0;
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        lastPlayedTimes.set("bell", Date.now());
      })
      .catch(() => {
        // Autoplay policy: Ignore silently without console spam
      });
  }
}

/**
 * Plays the approved Lucky Cat vocalization sound
 */
export function playCatMeow() {
  const audio = getPreloadedAudio(APPROVED_CAT_AUDIO_PATH, 0.40);
  if (!audio || !canPlay("cat", 1400, audio)) return;

  audio.currentTime = 0;
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        lastPlayedTimes.set("cat", Date.now());
      })
      .catch(() => {
        // Autoplay policy: Ignore silently without console spam
      });
  }
}

/**
 * Central sound dispatcher based on charm object or ID.
 * Strict Rule: Only 'lucky-bell' and 'lucky-cat' produce audio.
 * All other charms are strictly SILENT.
 * @param {object|string} charmOrKey
 */
export function playCharmSound(charmOrKey) {
  if (!charmOrKey) return;
  const key = typeof charmOrKey === "string" ? charmOrKey : charmOrKey?.id || charmOrKey?.iconKey;
  if (!key) return;

  const normalized = key.toLowerCase();
  if (normalized === "lucky-bell" || normalized === "fortune-bell") {
    playBellChime();
  } else if (normalized === "lucky-cat" || normalized === "maneki-neko") {
    playCatMeow();
  }
  // All other charms produce NO sound.
}

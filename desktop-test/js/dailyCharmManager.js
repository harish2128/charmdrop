/**
 * Daily Charm Manager
 * Handles calendar date tracking, midnight detection, and daily refresh logic for Nimbu Mirchi.
 * Keeps date logic completely separated from physics and generic charm rendering.
 */

const STORAGE_KEY_NIMBU_DATE = 'nimbuLastRefreshedDate';

/**
 * Returns YYYY-MM-DD in local time (prevents UTC timezone mismatch near midnight)
 * @param {Date} [date]
 * @returns {string}
 */
export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export class DailyCharmManager {
  constructor({ onStateChange } = {}) {
    this.onStateChange = onStateChange;
    this.currentDate = getLocalDateString();
    this.intervalId = null;

    this.init();
  }

  init() {
    // Initial startup check: if first launch, record today as fresh initial date
    const savedDate = localStorage.getItem(STORAGE_KEY_NIMBU_DATE);
    if (!savedDate) {
      localStorage.setItem(STORAGE_KEY_NIMBU_DATE, this.currentDate);
    }

    // Start 60-second periodic midnight calendar day watcher
    this.startMidnightWatcher();
  }

  /**
   * Evaluates the current daily status of Nimbu Mirchi
   * @returns {{ isFresh: boolean, lastRefreshedDate: string, today: string }}
   */
  getNimbuState() {
    const today = getLocalDateString();
    const savedDate = localStorage.getItem(STORAGE_KEY_NIMBU_DATE);

    if (!savedDate) {
      localStorage.setItem(STORAGE_KEY_NIMBU_DATE, today);
      return { isFresh: true, lastRefreshedDate: today, today };
    }

    const isFresh = (today === savedDate);
    return { isFresh, lastRefreshedDate: savedDate, today };
  }

  /**
   * Action: User manually hangs a fresh new Nimbu Mirchi
   * @returns {{ isFresh: boolean, lastRefreshedDate: string, today: string }}
   */
  hangNewNimbu() {
    const today = getLocalDateString();
    localStorage.setItem(STORAGE_KEY_NIMBU_DATE, today);

    const state = { isFresh: true, lastRefreshedDate: today, today };
    if (typeof this.onStateChange === 'function') {
      this.onStateChange(state);
    }
    return state;
  }

  /**
   * DEV TEST ONLY: Simulates calendar rolling over to the next day without changing system clock
   * Forces lastRefreshedDate to yesterday so that today !== lastRefreshedDate (FADED state)
   * @returns {{ isFresh: boolean, lastRefreshedDate: string, today: string }}
   */
  simulateNextDay() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterday);

    localStorage.setItem(STORAGE_KEY_NIMBU_DATE, yesterdayStr);

    const state = { isFresh: false, lastRefreshedDate: yesterdayStr, today: getLocalDateString() };
    if (typeof this.onStateChange === 'function') {
      this.onStateChange(state);
    }
    return state;
  }

  /**
   * Checks every 60 seconds if the local calendar date has rolled over past midnight
   */
  startMidnightWatcher() {
    if (this.intervalId) clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      const nowDay = getLocalDateString();
      if (nowDay !== this.currentDate) {
        this.currentDate = nowDay;
        const state = this.getNimbuState();
        if (typeof this.onStateChange === 'function') {
          this.onStateChange(state);
        }
      }
    }, 60000);
  }

  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

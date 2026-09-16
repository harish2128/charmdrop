import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  RefreshCw, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Sun, 
  Moon, 
  Flame, 
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import confetti from "canvas-confetti";
import { SectionTitle } from "../common/SectionTitle";
import { HangingCharm } from "../common/HangingCharm";

export function DailyNimbuMirchiSection() {
  // FUTURE DATE LOGIC ARCHITECTURE:
  // currentDate === lastRefreshedDate => Fresh
  // currentDate > lastRefreshedDate => Faded
  const getTodayFormatted = () => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  };

  const [lastRefreshedDate, setLastRefreshedDate] = useState(getTodayFormatted());
  const [currentDate, setCurrentDate] = useState(getTodayFormatted());
  const [refreshCount, setRefreshCount] = useState(1);
  const [isJustHung, setIsJustHung] = useState(false);

  // Derived state: 'fresh' | 'faded'
  const isFresh = currentDate === lastRefreshedDate;
  const isFaded = !isFresh;

  // DEV-ONLY: Simulate advancing to the next day
  const handleTestNextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    const nextDayStr = d.toISOString().split("T")[0];
    setCurrentDate(nextDayStr);
    setIsJustHung(false);
  };

  // User Action: Hang fresh charm, resetting lastRefreshedDate to currentDate
  const handleHangNewNimbuMirchi = () => {
    setLastRefreshedDate(currentDate);
    setIsJustHung(true);
    setRefreshCount((prev) => prev + 1);

    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#FACC15", "#84CC16", "#22C55E", "#EAB308", "#10B981"]
      });
    } catch (e) {
      // safe fallback
    }

    setTimeout(() => {
      setIsJustHung(false);
    }, 2200);
  };

  return (
    <section className="daily-nimbu-section">
      <div className="section-container">
        <SectionTitle
          badge="Signature Daily Ritual"
          badgeIcon={Sparkles}
          title="A fresh Nimbu Mirchi"
          highlightText="every single day."
          subtitle="Unlike permanent charms, Nimbu Mirchi is designed with a living 24-hour cycle. It protects your screen, naturally dulls, and awaits your morning refresh ritual."
          align="center"
        />

        <div className="nimbu-showcase-grid">
          {/* Left: Interactive Lifecycle Simulator */}
          <div className="nimbu-simulator-card">
            <div className="simulator-header">
              <div className="sim-day-pill">
                {isFresh && !isJustHung && (
                  <span className="pill-fresh">
                    <Sun size={14} /> Fresh Today
                  </span>
                )}
                {isFaded && (
                  <span className="pill-faded">
                    <Moon size={14} /> Expired & Faded
                  </span>
                )}
                {isJustHung && (
                  <span className="pill-renewed">
                    <Sparkles size={14} /> Fresh Nimbu Mirchi Hung!
                  </span>
                )}
              </div>

              {/* Development-Only Demo Controls */}
              <div className="sim-mode-toggle">
                <button
                  onClick={() => {
                    setCurrentDate(lastRefreshedDate);
                    setIsJustHung(false);
                  }}
                  className={`toggle-sub-btn ${isFresh ? "active" : ""}`}
                  title="Simulate today's fresh state"
                >
                  Fresh Today
                </button>
                <button
                  onClick={handleTestNextDay}
                  className={`toggle-sub-btn ${isFaded ? "active" : ""}`}
                  title="Simulate tomorrow (Faded state)"
                >
                  Test Next Day
                </button>
              </div>
            </div>

            {/* The Hanging Nimbu Mirchi Stage */}
            <div className="nimbu-hanging-stage">
              <HangingCharm
                iconKey="nimbu-mirchi"
                size={135}
                stringLength={0}
                interactive={true}
                isFaded={isFaded}
                caption={isFaded ? "Tired and faded after 24h" : "Lush lemon & 7 green chillies"}
              />

              <AnimatePresence>
                {isJustHung && (
                  <motion.div
                    className="sparkle-burst-ring"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1.4, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Sparkles size={48} className="text-amber-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dynamic Interactive Action Area */}
            <div className="nimbu-action-box">
              {isFresh && !isJustHung && (
                <div className="nimbu-status-text">
                  <div className="status-indicator fresh" />
                  <p>
                    <strong>Fresh & Active:</strong> Ward off bugs and bad code vibes.
                  </p>
                  <button
                    onClick={handleTestNextDay}
                    className="btn-sim-advance"
                    aria-label="Test Next Day state"
                  >
                    <span>Test Next Day</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {isFaded && (
                <motion.div 
                  className="nimbu-expired-banner"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="expired-callout">
                    <Clock size={18} className="text-amber-600" />
                    <div>
                      <strong>Your Nimbu Mirchi has completed the day.</strong>
                      <p>Time to hang a fresh one for today's good luck.</p>
                    </div>
                  </div>

                  <button
                    onClick={handleHangNewNimbuMirchi}
                    className="btn-hang-new-nimbu"
                  >
                    <RefreshCw size={18} />
                    <span>Hang New Nimbu Mirchi</span>
                  </button>
                </motion.div>
              )}

              {isJustHung && (
                <motion.div
                  className="nimbu-renewed-banner"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <CheckCircle2 size={20} className="text-emerald-500" />
                  <span>Fresh Nimbu Mirchi active for the new day! (Refreshed #{refreshCount})</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Right: Step-by-Step Lifecycle Explanation */}
          <div className="nimbu-steps-container">
            <h3 className="nimbu-steps-title">The Daily Ritual Cycle</h3>
            
            <div className="nimbu-timeline-list">
              {/* Step 1 */}
              <div className="timeline-item">
                <div className="timeline-badge fresh">
                  <span>01</span>
                </div>
                <div className="timeline-content">
                  <h4>Day 1: Fresh & Vibrant</h4>
                  <p>
                    A freshly picked yellow lemon and seven crisp green chillies hang at the top of your screen with rich glossy reflections.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="timeline-item">
                <div className="timeline-badge dull">
                  <span>02</span>
                </div>
                <div className="timeline-content">
                  <h4>Next Day: Naturally Dulls</h4>
                  <p>
                    After 24 hours, the charm lowers its saturation and contracts its glow. CharmDrop intentionally does <em>not</em> auto-replace it.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="timeline-item">
                <div className="timeline-badge action">
                  <span>03</span>
                </div>
                <div className="timeline-content">
                  <h4>One-Click Morning Hang</h4>
                  <p>
                    Click your Windows tray icon or the charm notification to hang a fresh one. It takes 1 second and starts your morning on a positive note.
                  </p>
                </div>
              </div>
            </div>

            <div className="nimbu-philosophy-quote">
              <p>
                “Unlike static widgets you forget about, Nimbu Mirchi turns desktop aesthetics into an intentional, enjoyable daily micro-ritual.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

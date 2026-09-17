import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Move, 
  RotateCcw, 
  Layers, 
  MousePointerClick, 
  Sparkles,
  Maximize2,
  Minimize2,
  Volume2,
  Pin
} from "lucide-react";
import { SectionTitle } from "../common/SectionTitle";
import { HangingCharm } from "../common/HangingCharm";
import { siteConfig } from "../../config/siteConfig";

export function FloatingDemoSection() {
  const [activeTab, setActiveTab] = useState("browser"); // "browser" or "ide" or "gaming"
  const [selectedCharm, setSelectedCharm] = useState("nimbu-mirchi");

  const demoEnvironments = {
    browser: {
      title: "Google Chrome & Web Browsing",
      url: "github.com/charmdrop/community",
      bgClass: "env-browser-bg",
      appTitle: "Chrome — 3 Active Tabs"
    },
    ide: {
      title: "Visual Studio Code / Terminal",
      url: "charmdrop/src/App.jsx",
      bgClass: "env-ide-bg",
      appTitle: "VS Code — main.jsx"
    },
    gaming: {
      title: "Steam & Discord Battlestation",
      url: "discord.gg/charmdrop",
      bgClass: "env-gaming-bg",
      appTitle: "Discord • #general-chat"
    }
  };

  const featurePills = [
    { icon: Move, title: "Drag Anywhere", desc: "Position at center, corner, or custom offset" },
    { icon: RotateCcw, title: "Realistic Swing", desc: "Physics calculated on cursor velocity" },
    { icon: Pin, title: "Always On Top", desc: "Stays visible over games, IDEs and browsers" },
    { icon: MousePointerClick, title: "Direct Interact", desc: "Poke, flick, or let it gently sway" }
  ];

  return (
    <section className="floating-demo-section">
      <div className="section-container">
        <SectionTitle
          badge="Live Desktop Simulator"
          badgeIcon={Sparkles}
          title="Not just wallpaper."
          highlightText="A living companion."
          subtitle="CharmDrop brings interactive desktop charms that move, swing and stay with you while you work, game or browse."
          align="center"
        />

        {/* Feature Pills */}
        <div className="demo-feature-pills-row">
          {featurePills.map((pill, idx) => {
            const Icon = pill.icon;
            return (
              <motion.div 
                key={pill.title} 
                className="demo-feature-pill"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="pill-icon-box">
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="pill-title">{pill.title}</h4>
                  <p className="pill-desc">{pill.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Desktop Mockup Window */}
        <motion.div 
          className="desktop-mockup-frame"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Windows Window Header */}
          <div className="mockup-window-header">
            <div className="window-dots">
              <span className="dot dot-close" />
              <span className="dot dot-min" />
              <span className="dot dot-max" />
            </div>

            {/* Environment Switcher Tabs */}
            <div className="mockup-env-tabs">
              <button
                onClick={() => setActiveTab("browser")}
                className={`mockup-tab ${activeTab === "browser" ? "active" : ""}`}
              >
                🌐 Web Browser
              </button>
              <button
                onClick={() => setActiveTab("ide")}
                className={`mockup-tab ${activeTab === "ide" ? "active" : ""}`}
              >
                💻 VS Code / IDE
              </button>
              <button
                onClick={() => setActiveTab("gaming")}
                className={`mockup-tab ${activeTab === "gaming" ? "active" : ""}`}
              >
                🎮 Gaming / Discord
              </button>
            </div>

            <div className="window-header-badge">
              <span>Always-On-Top: ON</span>
            </div>
          </div>

          {/* Desktop Content Canvas */}
          <div className={`mockup-screen-canvas ${demoEnvironments[activeTab].bgClass}`}>
            {/* The Hanging Charm hanging from the top edge of the simulated screen */}
            <div className="mockup-charm-anchor">
              <HangingCharm
                iconKey={selectedCharm}
                size={95}
                stringLength={115}
                interactive={true}
                caption="Try dragging over the window!"
              />
            </div>

            {/* Background Simulated App Layout */}
            {activeTab === "browser" && (
              <div className="sim-app-browser">
                <div className="sim-browser-bar">
                  <div className="sim-address-box">https://tetroinyx.netlify.app/charmdrop</div>
                </div>
                <div className="sim-content-cards">
                  <div className="sim-skeleton-card card-lg" />
                  <div className="sim-grid-two">
                    <div className="sim-skeleton-card" />
                    <div className="sim-skeleton-card" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "ide" && (
              <div className="sim-app-ide">
                <div className="sim-code-line"><span className="c-kw">import</span> {"{ HangingCharm }"} <span className="c-kw">from</span> <span className="c-str">'charmdrop'</span>;</div>
                <div className="sim-code-line"><span className="c-com">// Your hanging talisman stays anchored above all code</span></div>
                <div className="sim-code-line"><span className="c-fn">export default function</span> <span className="c-name">App</span>() {"{"}</div>
                <div className="sim-code-line pl-4"><span className="c-kw">return</span> &lt;<span className="c-tag">CharmDropWindow</span> <span className="c-attr">vibe</span>=<span className="c-str">"nimbu-mirchi"</span> /&gt;;</div>
                <div className="sim-code-line">{"}"}</div>
              </div>
            )}

            {activeTab === "gaming" && (
              <div className="sim-app-gaming">
                <div className="sim-game-hud">
                  <div className="hud-metric">FPS: 144.2</div>
                  <div className="hud-metric">PING: 18ms</div>
                  <div className="hud-metric">GPU: 48°C</div>
                </div>
                <div className="sim-game-crosshair" />
              </div>
            )}

            {/* Quick Charm Swapper Inside Simulation */}
            <div className="mockup-charm-swapper">
              <span className="swapper-title">Swap charm:</span>
              <button 
                onClick={() => setSelectedCharm("lucky-bell")} 
                className={`swapper-btn ${selectedCharm === "lucky-bell" ? "active" : ""}`}
              >
                🔔 Bell
              </button>
              <button 
                onClick={() => setSelectedCharm("lucky-cat")} 
                className={`swapper-btn ${selectedCharm === "lucky-cat" ? "active" : ""}`}
              >
                🐱 Lucky Cat
              </button>
              <button 
                onClick={() => setSelectedCharm("evil-eye")} 
                className={`swapper-btn ${selectedCharm === "evil-eye" ? "active" : ""}`}
              >
                🧿 Evil Eye
              </button>
              <button 
                onClick={() => setSelectedCharm("nimbu-mirchi")} 
                className={`swapper-btn ${selectedCharm === "nimbu-mirchi" ? "active" : ""}`}
              >
                Nimbu Mirchi
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

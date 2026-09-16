import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Eye, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Send,
  ExternalLink,
  Flame
} from "lucide-react";
import { Instagram } from "../common/InstagramIcon";
import { SectionTitle } from "../common/SectionTitle";
import { CharmVector } from "../common/CharmVector";
import { instagramReelsData, getCharmById } from "../../data/charmsData";
import { siteConfig } from "../../config/siteConfig";

export function InstagramGrowthSection() {
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [simulatedComment, setSimulatedComment] = useState("");
  const [showDmReply, setShowDmReply] = useState(false);

  const handleSimulateComment = (e) => {
    e.preventDefault();
    if (simulatedComment.trim()) {
      setShowDmReply(true);
    }
  };

  return (
    <section className="instagram-growth-section" id="social-drops">
      <div className="section-container">
        <SectionTitle
          badge="Instagram Exclusive Drops"
          badgeIcon={Instagram}
          title="Discover new drops"
          highlightText="on Instagram Reels."
          subtitle="Every week, we reveal unreleased charms, motorsport animations, and aesthetic desktop routines through Instagram reels."
          align="center"
          dark={false}
        />

        {/* Funnel Steps Flow Visualizer */}
        <div className="insta-funnel-strip">
          <div className="funnel-step">
            <span className="funnel-num">1</span>
            <span>Watch Reel</span>
          </div>
          <span className="funnel-arrow">→</span>
          <div className="funnel-step">
            <span className="funnel-num">2</span>
            <span>Follow @charmdrop</span>
          </div>
          <span className="funnel-arrow">→</span>
          <div className="funnel-step highlight">
            <span className="funnel-num">3</span>
            <span>Comment "CHARM"</span>
          </div>
          <span className="funnel-arrow">→</span>
          <div className="funnel-step">
            <span className="funnel-num">4</span>
            <span>Auto DM Download Link</span>
          </div>
          <span className="funnel-arrow">→</span>
          <div className="funnel-step">
            <span className="funnel-num">5</span>
            <span>Hang on Windows</span>
          </div>
        </div>

        {/* Reels Showcase Grid */}
        <div className="reels-preview-grid">
          {instagramReelsData.map((reel, idx) => {
            const charmObj = getCharmById(reel.charmId);
            return (
              <motion.div
                key={reel.id}
                className="reel-card-item"
                style={{ background: reel.bgGradient }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                {/* Reel Header */}
                <div className="reel-header-badge">
                  <span className="reel-cat-pill">{reel.category}</span>
                  <span className="reel-views-pill">
                    <Eye size={12} />
                    {reel.views}
                  </span>
                </div>

                {/* Animated Hanging Charm Centerpiece in Reel */}
                <div className="reel-visual-center">
                  <div className="reel-hanging-cord" />
                  <motion.div
                    className="reel-charm-motion"
                    animate={{ rotate: [-6, 6, -6] }}
                    transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
                  >
                    <CharmVector 
                      iconKey={reel.charmId} 
                      image={charmObj?.image} 
                      size={80} 
                    />
                  </motion.div>
                  <span className="reel-charm-title">{reel.charmName}</span>
                </div>

              {/* Reel Footer Engagement Bar */}
              <div className="reel-engagement-footer">
                <h4 className="reel-headline">{reel.title}</h4>
                <p className="reel-action-prompt">{reel.tagline}</p>

                <div className="reel-metrics-row">
                  <div className="metric-pill">
                    <Heart size={14} className="text-rose-400" />
                    <span>{reel.likes}</span>
                  </div>
                  <div className="metric-pill">
                    <MessageCircle size={14} className="text-cyan-400" />
                    <span>{reel.comments}</span>
                  </div>
                  <div className="metric-pill">
                    <Flame size={14} className="text-amber-400" />
                    <span>Trending</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        </div>

        {/* Live Funnel Interactive Simulator */}
        <div className="insta-simulator-box">
          <div className="sim-funnel-left">
            <div className="sim-badge-lead">
              <Sparkles size={15} />
              <span>Try the Instagram Automation</span>
            </div>
            <h3>See a charm you want?</h3>
            <p>
              Comment <strong>CHARM</strong> on any reel or test the interactive DM simulation right here:
            </p>

            <form onSubmit={handleSimulateComment} className="sim-comment-form">
              <input
                type="text"
                placeholder="Type 'CHARM' to simulate bot..."
                value={simulatedComment}
                onChange={(e) => setSimulatedComment(e.target.value)}
                className="sim-comment-input"
              />
              <button type="submit" className="btn-send-sim-comment">
                <Send size={15} />
                <span>Comment</span>
              </button>
            </form>
          </div>

          <div className="sim-funnel-right">
            {showDmReply ? (
              <motion.div
                className="sim-dm-bubble"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="dm-avatar">
                  <CharmVector iconKey="evil-eye" size={24} glow={false} />
                </div>
                <div className="dm-bubble-content">
                  <div className="dm-sender">CharmDrop Bot (Verified)</div>
                  <p>
                    Hey! 🎉 Here is your direct link for the <strong>CharmDrop Windows Installer</strong>.
                  </p>
                  <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className="dm-link-btn">
                    <span>Open Windows Download Hub</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="sim-empty-dm-placeholder">
                <MessageCircle size={32} className="text-slate-400" />
                <span>Simulate typing "CHARM" on the left to see the instant DM funnel</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Follow CTA */}
        <div className="insta-main-cta-wrapper">
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-instagram-lead"
          >
            <Instagram size={20} />
            <span>Follow CharmDrop on Instagram ({siteConfig.instagramHandle})</span>
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Search, SlidersHorizontal, Grid } from "lucide-react";
import { SectionTitle } from "../common/SectionTitle";
import { CharmCard } from "../cards/CharmCard";
import { CHARM_CATEGORIES, charmsData } from "../../data/charmsData";

export function CharmCollectionSection({ onPreviewClick, maxItems = null }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCharms = charmsData.filter((charm) => {
    const matchesCat = activeCategory === "All" || charm.category === activeCategory;
    const matchesSearch = charm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          charm.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          charm.tag?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const displayedCharms = maxItems ? filteredCharms.slice(0, maxItems) : filteredCharms;

  return (
    <section className="charm-collection-section" id="collection">
      <div className="section-container">
        <SectionTitle
          badge="Endless Screen Personality"
          badgeIcon={Grid}
          title="Choose your vibe."
          highlightText={`${charmsData.length} Handcrafted Charms.`}
          subtitle="One desktop. Endless personality. Handcrafted talismans with authentic physics and sound effects."
          align="center"
        />

        {/* Category Filter Pills & Search */}
        <div className="collection-controls-bar">
          <div className="category-pills-row" role="tablist">
            {CHARM_CATEGORIES.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                className={`cat-pill-btn ${activeCategory === cat ? "active" : ""}`}
              >
                {cat === "All" && "✨ "}
                {cat === "Lucky" && "🧿 "}
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Search Input */}
          <div className="collection-search-wrap">
            <Search size={16} className="search-icon-subtle" />
            <input
              type="text"
              placeholder="Search by name, vibe or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="collection-search-input"
            />
          </div>
        </div>

        {/* Charms Grid */}
        <motion.div 
          className="charms-cards-grid"
          layout
        >
          <AnimatePresence>
            {displayedCharms.map((charm) => (
              <CharmCard
                key={charm.id}
                charm={charm}
                onPreviewClick={onPreviewClick}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* If no results */}
        {displayedCharms.length === 0 && (
          <div className="charms-empty-state">
            <p>No charms found matching "{searchQuery}" in {activeCategory}.</p>
            <button 
              onClick={() => { setActiveCategory("All"); setSearchQuery(""); }} 
              className="btn-reset-filters"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Explore All Link CTA */}
        {maxItems && filteredCharms.length > maxItems && (
          <div className="collection-view-more">
            <Link to="/charms" className="btn-view-all-charms">
              <span>Explore Complete Charm Catalog ({charmsData.length} Charms)</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

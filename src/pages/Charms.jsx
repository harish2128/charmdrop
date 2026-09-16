import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Sparkles, Grid, Flame, Clock, Filter } from "lucide-react";
import { CharmCard } from "../components/cards/CharmCard";
import { SectionTitle } from "../components/common/SectionTitle";
import { CHARM_CATEGORIES, charmsData } from "../data/charmsData";

export function Charms({ onPreviewCharm }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("cat") || "All";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default"); // "default", "popular", "newest", "name"

  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat && CHARM_CATEGORIES.includes(cat)) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    if (cat === "All") {
      searchParams.delete("cat");
    } else {
      searchParams.set("cat", cat);
    }
    setSearchParams(searchParams);
  };

  const filteredCharms = charmsData.filter((charm) => {
    const matchesCat = activeCategory === "All" || charm.category === activeCategory;
    const matchesSearch =
      charm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      charm.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      charm.tag?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const sortedCharms = [...filteredCharms].sort((a, b) => {
    if (sortBy === "popular") return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    if (sortBy === "newest") return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="charms-page-container">
      {/* Page Header */}
      <div className="page-hero-banner">
        <div className="section-container">
          <SectionTitle
            badge="Full Charm Catalog"
            badgeIcon={Grid}
            title="Every charm."
            highlightText="Zero restrictions."
            subtitle="Browse our growing library of handcrafted desktop charms for Windows 10 & 11. Click any card to test the interactive swing."
            align="center"
          />

          {/* Search and Filter Controls */}
          <div className="charms-filter-hub">
            {/* Search Input */}
            <div className="filter-search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search by charm name, vibe, motorsport, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="filter-search-input"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="btn-clear-search">
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="filter-sort-box">
              <span className="sort-label">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-dropdown-select"
              >
                <option value="default">Featured</option>
                <option value="popular">🔥 Trending Drops</option>
                <option value="newest">✨ Newest First</option>
                <option value="name">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="category-tabs-scroll">
            {CHARM_CATEGORIES.map((cat) => {
              const count = cat === "All" 
                ? charmsData.length 
                : charmsData.filter((c) => c.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`cat-tab-btn ${activeCategory === cat ? "active" : ""}`}
                >
                  <span>{cat}</span>
                  <span className="cat-count-badge">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Results Grid */}
      <div className="section-container charms-results-area">
        <div className="results-header-bar">
          <span className="results-count-text">
            Showing <strong>{sortedCharms.length}</strong> {activeCategory} charms
          </span>
          {activeCategory !== "All" && (
            <button
              onClick={() => handleCategoryChange("All")}
              className="btn-clear-category-pill"
            >
              Clear Category Filter
            </button>
          )}
        </div>

        {sortedCharms.length > 0 ? (
          <motion.div className="charms-cards-grid" layout>
            <AnimatePresence>
              {sortedCharms.map((charm) => (
                <CharmCard
                  key={charm.id}
                  charm={charm}
                  onPreviewClick={onPreviewCharm}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="charms-no-results-card">
            <Sparkles size={36} className="text-indigo-400" />
            <h3>No charms found</h3>
            <p>Try searching with another keyword or resetting the category filter.</p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
              }}
              className="btn-primary-reset"
            >
              View All Charms
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

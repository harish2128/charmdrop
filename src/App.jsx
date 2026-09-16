import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";
import { DownloadModal } from "./components/modals/DownloadModal";
import { CharmPreviewModal } from "./components/modals/CharmPreviewModal";

// Pages
import { Home } from "./pages/Home";
import { Charms } from "./pages/Charms";
import { HowItWorks } from "./pages/HowItWorks";
import { DownloadPage } from "./pages/Download";
import { About } from "./pages/About";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";
import { Contact } from "./pages/Contact";

// Styles
import "./styles/global.css";
import "./styles/components.css";

// Helper component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [previewCharm, setPreviewCharm] = useState(null);

  const handleOpenDownloadModal = () => {
    setDownloadModalOpen(true);
  };

  const handleCloseDownloadModal = () => {
    setDownloadModalOpen(false);
  };

  const handlePreviewCharm = (charm) => {
    setPreviewCharm(charm);
  };

  const handleClosePreviewModal = () => {
    setPreviewCharm(null);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app-layout-wrapper">
        {/* Sticky Global Navbar */}
        <Navbar onOpenDownloadModal={handleOpenDownloadModal} />

        {/* Dynamic Page Router */}
        <main className="main-content-area">
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  onOpenDownloadModal={handleOpenDownloadModal} 
                  onPreviewCharm={handlePreviewCharm} 
                />
              } 
            />
            <Route 
              path="/charms" 
              element={
                <Charms 
                  onPreviewCharm={handlePreviewCharm} 
                />
              } 
            />
            <Route 
              path="/how-it-works" 
              element={
                <HowItWorks 
                  onOpenDownloadModal={handleOpenDownloadModal} 
                />
              } 
            />
            <Route 
              path="/download" 
              element={
                <DownloadPage 
                  onOpenDownloadModal={handleOpenDownloadModal} 
                />
              } 
            />
            <Route 
              path="/about" 
              element={
                <About 
                  onOpenDownloadModal={handleOpenDownloadModal} 
                />
              } 
            />
            <Route 
              path="/privacy" 
              element={<Privacy />} 
            />
            <Route 
              path="/terms" 
              element={<Terms />} 
            />
            <Route 
              path="/contact" 
              element={<Contact />} 
            />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Global Download / Early Access Modal */}
        <DownloadModal 
          isOpen={downloadModalOpen} 
          onClose={handleCloseDownloadModal} 
        />

        {/* Global Charm Preview Modal */}
        <CharmPreviewModal
          charm={previewCharm}
          isOpen={!!previewCharm}
          onClose={handleClosePreviewModal}
          onDownloadClick={handleOpenDownloadModal}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;

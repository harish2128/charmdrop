import React from "react";
import { HeroSection } from "../components/sections/HeroSection";
import { FloatingDemoSection } from "../components/sections/FloatingDemoSection";
import { CharmCollectionSection } from "../components/sections/CharmCollectionSection";
import { DailyNimbuMirchiSection } from "../components/sections/DailyNimbuMirchiSection";
import { HowItWorksSection } from "../components/sections/HowItWorksSection";
import { FeaturesSection } from "../components/sections/FeaturesSection";
import { WindowsPreviewSection } from "../components/sections/WindowsPreviewSection";
import { NewCharmUpdateSection } from "../components/sections/NewCharmUpdateSection";
import { InstagramGrowthSection } from "../components/sections/InstagramGrowthSection";
import { SocialProofSection } from "../components/sections/SocialProofSection";
import { FreeSection } from "../components/sections/FreeSection";
import { FinalDownloadSection } from "../components/sections/FinalDownloadSection";

export function Home({ onOpenDownloadModal, onPreviewCharm }) {
  return (
    <div className="charmdrop-home-page">
      {/* 1. Hero Section */}
      <HeroSection onOpenDownloadModal={onOpenDownloadModal} />

      {/* 2. Floating Charm Demo ("Not just wallpaper") */}
      <FloatingDemoSection />

      {/* 3. Daily Nimbu Mirchi Lifecycle Showcase */}
      <DailyNimbuMirchiSection />

      {/* 4. Charm Highlights Collection */}
      <CharmCollectionSection onPreviewClick={onPreviewCharm} />

      {/* 5. How It Works (4 Steps) */}
      <HowItWorksSection onOpenDownloadModal={onOpenDownloadModal} />

      {/* 6. Features Grid */}
      <FeaturesSection />

      {/* 7. Windows App Tray Preview */}
      <WindowsPreviewSection />

      {/* 8. New Charm Updates Flow */}
      <NewCharmUpdateSection onOpenDownloadModal={onOpenDownloadModal} />

      {/* 9. Instagram Reels & Social Funnel */}
      <InstagramGrowthSection />

      {/* 10. Community Setups / Social Proof */}
      <SocialProofSection />

      {/* 11. Free Pricing Tier */}
      <FreeSection onOpenDownloadModal={onOpenDownloadModal} />

      {/* 12. Final Download Call to Action */}
      <FinalDownloadSection onOpenDownloadModal={onOpenDownloadModal} />
    </div>
  );
}

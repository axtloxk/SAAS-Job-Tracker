import React from "react";
import StaticCardsSection from "@/components/Job/StaticCardsSection";
import AboutFooter from "@/components/Job/AboutFooter";

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <StaticCardsSection />
      <AboutFooter />
    </div>
  );
}

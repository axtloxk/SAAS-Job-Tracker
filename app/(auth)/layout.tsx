"use client";
import { Briefcase } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: {
            duration: 0.35,
            ease: "easeOut",
          },
        }}
        className="fixed left-6 top-3.5 z-50"
      >
        <Link
          href="/"
          className="flex w-fit items-center gap-2 text-lg font-bold tracking-tight text-foreground hover:opacity-90 transition-opacity"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Briefcase className="h-5 w-5" />
          </div>
          <span>JobTracker</span>
        </Link>
      </motion.div>
      {children}
    </div>
  );
};

export default layout;

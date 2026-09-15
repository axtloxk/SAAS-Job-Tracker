"use client";
import Link from "next/link";
import { easeOut, motion } from "motion/react";
import { Briefcase, Mail, Info } from "lucide-react";

// 1. Parent Variant: Coordinates timing for children
const footerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

// 2. Child Variant: Left-to-right slide in with fade
const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      ease: easeOut,
    },
  },
};

const AboutFooter = () => {
  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="w-full border-t border-t-gray-300/90 border-border/60 bg-card/50 py-12 mt-auto"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* About Section */}
          <motion.div
            id="about"
            variants={itemVariants}
            className="scroll-mt-20 flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 font-bold text-foreground">
              <Info className="h-5 w-5 text-primary" />
              <h3 className="text-lg">About JobTracker</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              JobTracker helps candidates streamline their interview pipeline,
              manage application statuses, and track response rates in one
              centralized place.
            </p>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            id="contact"
            variants={itemVariants}
            className="scroll-mt-20 flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 font-bold text-foreground">
              <Mail className="h-5 w-5 text-primary" />
              <h3 className="text-lg">Contact Us</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Questions or feature requests? Get in touch at{" "}
              <a
                href="mailto:husseinabojazia@gmail.com"
                className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
              >
                husseinabojazia@gmail.com
              </a>
              .
            </p>
          </motion.div>
        </div>

        {/* Bottom copyright bar */}
        <motion.div
          variants={itemVariants}
          className="mt-10 border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4"
        >
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            <span>
              &copy; {new Date().getFullYear()} JobTracker. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/#about"
              className="hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/#contact"
              className="hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default AboutFooter;

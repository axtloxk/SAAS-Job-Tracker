"use client";
import { motion, Variants } from "motion/react";
import { Briefcase, CalendarCheck, BarChart3 } from "lucide-react";

const FEATURES = [
  {
    icon: Briefcase,
    title: "Centralized Tracking",
    description:
      "Keep every job application, interview stage, and contact person neatly organized in one dynamic dashboard.",
  },
  {
    icon: CalendarCheck,
    title: "Deadline & Reminder Alerts",
    description:
      "Never miss an upcoming technical assessment or follow-up email with structured deadline tracking.",
  },
  {
    icon: BarChart3,
    title: "Search Insights",
    description:
      "Visualize your progress with response rate analytics and identify which stages need improvement.",
  },
];

// Parent variant: Delays execution so the Navbar finishes first
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.6, // Waits 0.6s for Navbar sequence to complete
      staggerChildren: 0.2, // Slower stagger delay between cards
    },
  },
};

// Child variant: Moves cards from left to right with a longer duration
const cardVariants: Variants = {
  hidden: { opacity: 0, x: -40 }, // Slides in from further left
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6, // Slower animation speed
      ease: "easeOut",
    },
  },
};

const StaticCardsSection = () => {
  return (
    <section className="w-full py-12 mb-30">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Everything You Need to Land Your Next Role
        </h2>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          Take control of your interview pipeline with a streamlined workflow.
        </p>
      </motion.div>

      {/* Animated 3 Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-8 md:grid-cols-3"
      >
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              variants={cardVariants}
              className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default StaticCardsSection;

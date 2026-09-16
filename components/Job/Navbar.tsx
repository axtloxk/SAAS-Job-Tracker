"use client";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, easeOut, motion } from "motion/react";
import {
  Briefcase,
  LayoutDashboard,
  Info,
  Mail,
  Menu,
  X,
  Plus,
  Moon,
  Sun,
} from "lucide-react";
import { toast } from "sonner";

const NAV_LINKS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "About", href: "/#about", icon: Info },
  { name: "Contact", href: "/#contact", icon: Mail },
];

const navVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      ease: easeOut,
    },
  },
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login state via server endpoint
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        setIsLoggedIn(res.ok);
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsLoggedIn(false);
      toast.success("Logged out successfully!");
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);

      toast.error(err instanceof Error ? err.message : "Failed to log out");
    }
  };
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // if (!mounted) return null;
  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
    );
  }
  const isDark = theme === "dark";
  return (
    <motion.header
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <motion.div variants={itemVariants}>
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground hover:opacity-90 transition-opacity"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Briefcase className="h-5 w-5" />
            </div>
            <span>JobTracker</span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;

            const href =
              link.name === "Contact"
                ? "mailto:husseinabozaia@gmail.com"
                : link.href;

            const isActive = pathname === href;

            return (
              <motion.div key={link.name} variants={itemVariants}>
                <Link
                  href={href}
                  className={`flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 dark:bg-bg-cold border border-slate-200 dark:border-slate-700/60 hover:bg-slate-200/70 dark:hover:bg-slate-900/30 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (
                <motion.div
                  key="moon"
                  initial={{ rotate: -90, scale: 0, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300 fill-slate-700/20 dark:fill-slate-300/20" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ rotate: 90, scale: 0, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: -90, scale: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <Sun className="w-5 h-5 text-amber-600 dark:text-amber-500 fill-amber-500/20" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          <motion.div variants={itemVariants}>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Application</span>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-red-500 hover:bg-accent transition-colors shadow-sm"
              >
                <span>Logout</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors shadow-sm"
              >
                <span>Login</span>
              </Link>
            )}
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          variants={itemVariants}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </motion.button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;

              const href =
                link.name === "Contact"
                  ? "mailto:husseinabozaia@gmail.com"
                  : link.href;

              const isActive = pathname === href;

              return (
                <Link
                  key={link.name}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 pt-4 flex flex-col gap-3 border-t border-border">
            <Link
              href="/dashboard/new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Application</span>
            </Link>

            {isLoggedIn ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-red-500 shadow-md hover:bg-accent transition-colors"
              >
                <span>Logout</span>
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium shadow-md hover:bg-primary/90 transition-colors"
              >
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </motion.header>
  );
}

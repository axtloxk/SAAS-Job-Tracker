"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

const MotionLink = motion.create(Link);

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  // const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          username: form.username,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }
      toast.success("Account created successfully!");
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.45,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 shadow-lg"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your details below to set up your job tracker
          </p>
        </div>

        {/* {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-center text-sm text-destructive">
            {error}
          </div>
        )} */}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium">Username</label>
            <input
              type="text"
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="johndoe"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="••••••••"
              />

              {/* Password Eye Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {showPassword ? (
                    <motion.div
                      key="eye-off"
                      initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
                      transition={{ duration: 0.15 }}
                    >
                      <EyeOff className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="eye-open"
                      initial={{ opacity: 0, scale: 0.5, rotate: 20 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5, rotate: -20 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Eye className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Submit button animation */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="pt-2"
          >
            <button
              type="submit"
              disabled={loading}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground transition-all hover:gap-4 hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign Up
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </motion.div>
        </form>

        {/* Link hover animation */}
        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <MotionLink
            href="/login"
            whileHover={{ x: 2, opacity: 0.8 }}
            className="inline-block font-medium text-primary underline underline-offset-4"
          >
            Log in
          </MotionLink>
        </p>
      </motion.div>
    </div>
  );
}

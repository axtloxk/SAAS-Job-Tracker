"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "motion/react";
import { Plus, LogOut, X, ExternalLink, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Application {
  id: string;
  jobTitle: string;
  companyName: string;
  status: string;
  appliedAt: string;
  applyLink: string | null;
}

// Parent variant: cards appear from left to right
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1,
    },
  },
};

// Child variant: each card slides in from the left
const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export default function page() {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for fetched data
  const [username, setUsername] = useState("User");
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for the New Application form
  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    status: "APPLIED",
    date: "",
    applyLink: "",
  });

  // Fetch user data and applications on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/applications");

        if (res.ok) {
          const data = await res.json();

          setUsername(data.username);
          setApplications(data.applications);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/applications", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setApplications((prev) => prev.filter((app) => app.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete application:", error);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      toast.success("Logged out successfully!");

      await fetch("/api/auth/logout", { method: "POST" });

      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error(err instanceof Error ? err.message : "Failed to log out");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newApp = await res.json();

        // Add the new application to the top of the list
        setApplications((prev) => [newApp, ...prev]);

        // Close modal and reset form
        setIsModalOpen(false);

        setFormData({
          jobTitle: "",
          companyName: "",
          status: "APPLIED",
          date: "",
          applyLink: "",
        });
      }
    } catch (error) {
      console.error("Failed to submit application:", error);
    }
  };
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-background text-foreground"
    >
      {/* 1. Navbar */}
      <motion.nav
        variants={cardVariants}
        className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur"
      >
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="text-lg font-semibold tracking-tight">
            <span className="mr-3 font-light text-gray-600/70">
              Welcome dear,
            </span>{" "}
            {isLoading ? (
              <span className="animate-pulse rounded bg-muted text-transparent">
                Loading
              </span>
            ) : (
              <span className="text-primary">{username}</span>
            )}
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Application</span>
              <span className="sm:hidden">Add</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* 2. Dashboard */}
      <motion.main
        variants={cardVariants}
        className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="mb-8 flex flex-col gap-2 w-fit">
          <motion.div whileHover={{ x: 10, opacity: 0.7 }} className="w-fit">
            <Link
              href={"/"}
              className="text-3xl w-fit font-bold tracking-tight flex items-center "
            >
              Dashboard Overview
            </Link>
          </motion.div>

          <p className="text-muted-foreground">
            Track your progress and manage your job hunt in one place.
          </p>
        </div>

        {/* Dynamic Cards Grid */}
        {isLoading ? (
          <div className="text-muted-foreground">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
            No applications yet. Click "New Application" to get started!
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            {applications.map((app) => (
              <motion.div
                key={app.id}
                variants={cardVariants}
                className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm"
              >
                <div>
                  <h3 className="truncate font-semibold text-card-foreground">
                    {app.jobTitle}
                  </h3>

                  <p className="truncate text-sm text-muted-foreground">
                    {app.companyName}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                    {app.status}
                  </span>

                  <div className="flex items-center gap-3">
                    {app.applyLink && (
                      <a
                        href={app.applyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground transition-colors hover:text-primary"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}

                    <button
                      onClick={() => handleDelete(app.id)}
                      className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-red-400/40 cursor-pointer active:bg-red-100 hover:text-accent-foreground"
                      aria-label={`Delete ${app.jobTitle} application`}
                    >
                      <span className="hidden sm:inline">Delete</span>
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.main>

      {/* 3. New Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-card-foreground">
                Add New Application
              </h2>

              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="jobTitle" className="text-sm font-medium">
                  Job Title
                </label>

                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  required
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="e.g. Frontend Developer"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="companyName" className="text-sm font-medium">
                  Company Name
                </label>

                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  required
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="e.g. Vercel"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="status" className="text-sm font-medium">
                  Application Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="APPLIED">Applied</option>
                  <option value="INTERVIEWING">Interviewing</option>
                  <option value="OFFER">Offer</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="date" className="text-sm font-medium">
                  Date Applied
                </label>

                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="applyLink" className="text-sm font-medium">
                  Application Link (Optional)
                </label>

                <input
                  type="url"
                  id="applyLink"
                  name="applyLink"
                  value={formData.applyLink}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="https://company.com/careers/job"
                />
              </div>

              <div className="mt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}

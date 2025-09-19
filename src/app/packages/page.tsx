import { getAllPackages, getCategories } from "@/lib/data-service";
import { HomeClient } from "@/components/HomeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Packages - WebInstall UI",
  description:
    "Browse and install 170+ development tools with a single command. Find packages like Node.js, Docker, Git, Python, Go, Rust, and more. Cross-platform support for Linux, macOS, and Windows.",
  keywords: [
    "developer tools",
    "package discovery",
    "install packages",
    "webinstall",
    "command line",
    "development environment",
    "cross-platform tools",
  ],
  openGraph: {
    title: "Browse Packages - WebInstall UI",
    description:
      "Browse and install 170+ development tools with a single command. Cross-platform support for Linux, macOS, and Windows.",
    type: "website",
    url: "/packages",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Packages - WebInstall UI",
    description:
      "Browse and install 170+ development tools with a single command.",
  },
  alternates: {
    canonical: "/packages",
  },
};

export default async function PackagesPage() {
  try {
    // Fetch data on the server side with force refresh to get new descriptions
    const [packages, categories] = await Promise.all([
      getAllPackages(true), // Force refresh to bypass cache
      getCategories(),
    ]);
    
    // Debug: Log a few packages to see their descriptions
    console.log("Sample packages with descriptions:", packages.slice(0, 3).map(p => ({
      name: p.name,
      tagline: p.tagline,
      description: p.description
    })));
    
    return (
      <HomeClient initialPackages={packages} initialCategories={categories} />
    );
  } catch (error) {
    console.error("Failed to load data:", error);

    // Return error state
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">
            Failed to Load Packages
          </h1>
          <p className="text-muted-foreground">
            There was an error loading the package data. Please try refreshing
            the page.
          </p>
        </div>
      </div>
    );
  }
}

// Enable ISR with 10 minute revalidation
export const revalidate = 600;
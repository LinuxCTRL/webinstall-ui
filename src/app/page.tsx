import { getAllPackages, getCategories } from "@/lib/data-service";
import { HomeClient } from "@/components/HomeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WebInstall UI - Discover & Install Developer Tools",
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
    title: "WebInstall UI - Discover & Install Developer Tools",
    description:
      "Browse and install 170+ development tools with a single command. Cross-platform support for Linux, macOS, and Windows.",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "WebInstall UI - Discover & Install Developer Tools",
    description:
      "Browse and install 170+ development tools with a single command.",
  },
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  try {
    // Fetch data on the server side
    const [packages, categories] = await Promise.all([
      getAllPackages(),
      getCategories(),
    ]);
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

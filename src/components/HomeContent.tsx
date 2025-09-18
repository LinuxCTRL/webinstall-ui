"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Package, SearchFilters } from "@/types";
import { SearchBar } from "@/components/SearchBar";
import { PackageGrid } from "@/components/PackageGrid";
import { PackageComparison } from "@/components/PackageComparison";

interface HomeContentProps {
  initialPackages: Package[];
  initialCategories: string[];
}

export function HomeContent({
  initialPackages,
  initialCategories,
}: HomeContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [packages] = useState<Package[]>(initialPackages);
  const [filteredPackages, setFilteredPackages] =
    useState<Package[]>(initialPackages);
  const [categories] = useState<string[]>(initialCategories);
  const [viewMode, setViewMode] = useState<"all" | "popular" | "recent">("all");
  const [compareList, setCompareList] = useState<Package[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  // Sync viewMode with URL query param
  useEffect(() => {
    const view = searchParams.get("view");
    if (view === "popular" || view === "recent" || view === "all") {
      setViewMode(view);
    } else {
      setViewMode("all");
    }
  }, [searchParams]);

  // Helper to update viewMode and URL
  const handleViewModeChange = (mode: "all" | "popular" | "recent") => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (mode === "all") {
      params.delete("view");
    } else {
      params.set("view", mode);
    }
    router.replace("?" + params.toString(), { scroll: false });
    setViewMode(mode);
  };

  // Helper function to get popular packages
  const getPopularPackages = (packages: Package[]): Package[] => {
    const popularNames = [
      "node",
      "git",
      "docker",
      "python",
      "go",
      "rust",
      "npm",
      "yarn",
      "kubectl",
      "terraform",
      "ansible",
      "vim",
      "nvim",
      "code",
      "jq",
      "curl",
      "wget",
      "ssh",
      "gh",
      "make",
      "cmake",
      "nginx",
      "postgres",
    ];

    return packages
      .filter((pkg) => popularNames.includes(pkg.name.toLowerCase()))
      .sort((a, b) => {
        const aIndex = popularNames.indexOf(a.name.toLowerCase());
        const bIndex = popularNames.indexOf(b.name.toLowerCase());
        return aIndex - bIndex;
      });
  };

  // Helper function to get recently updated packages
  const getRecentPackages = (packages: Package[]): Package[] => {
    return [...packages]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .slice(0, 24); // Show top 24 recent packages
  };

  // Helper function to toggle package in compare list
  const toggleCompare = (pkg: Package) => {
    setCompareList((current) => {
      const exists = current.find((p) => p.name === pkg.name);
      if (exists) {
        return current.filter((p) => p.name !== pkg.name);
      } else if (current.length < 3) {
        // Limit to 3 packages for comparison
        return [...current, pkg];
      }
      return current;
    });
  };

  const handleSearch = (filters: SearchFilters) => {
    let basePackages = [...packages];

    // Apply view mode filter first
    switch (viewMode) {
      case "popular":
        basePackages = getPopularPackages(packages);
        break;
      case "recent":
        basePackages = getRecentPackages(packages);
        break;
      default:
        basePackages = [...packages];
    }

    let filtered = basePackages;

    // Apply text search
    if (filters.query.trim()) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(query) ||
          pkg.title.toLowerCase().includes(query) ||
          pkg.tagline.toLowerCase().includes(query) ||
          pkg.description.toLowerCase().includes(query) ||
          pkg.category.toLowerCase().includes(query),
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter((pkg) => pkg.category === filters.category);
    }

    // Apply platform filters
    const selectedPlatforms = Object.entries(filters.platforms)
      .filter(([_, selected]) => selected)
      .map(([platform]) => platform);

    if (selectedPlatforms.length > 0) {
      filtered = filtered.filter((pkg) =>
        selectedPlatforms.some(
          (platform) => pkg.platforms[platform as keyof typeof pkg.platforms],
        ),
      );
    }

    setFilteredPackages(filtered);
  };

  // Re-run search when viewMode changes
  useEffect(() => {
    if (packages.length > 0) {
      handleSearch({
        query: "",
        platforms: { linux: false, macos: false, windows: false },
      });
    }
  }, [viewMode, packages]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background elements */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] animate-pulse pointer-events-none"
        style={{ animationDuration: "8s" }}
      >
        {/* SVG pattern code */}
      </div>

      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent_70%)] mix-blend-multiply dark:mix-blend-screen"></div>
      </div>

      <div className="relative z-10">
        <main className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
          {/* Hero section */}
          <div className="text-center space-y-4 py-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Modern Package Discovery
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover and install development tools with a single command. A
              modern interface for the webinstall.dev ecosystem.
            </p>
            <div className="inline-block px-2 py-1 bg-muted text-lg font-semibold rounded-full text-muted-foreground align-middle ml-2">
              {packages.length} Packages
            </div>
          </div>

          {/* View mode tabs */}
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-lg bg-muted p-1">
                <button
                  type="button"
                  onClick={() => handleViewModeChange("all")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    viewMode === "all"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All Packages ({packages.length})
                </button>
                <button
                  type="button"
                  onClick={() => handleViewModeChange("popular")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    viewMode === "popular"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Popular ({getPopularPackages(packages).length})
                </button>
                <button
                  type="button"
                  onClick={() => handleViewModeChange("recent")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    viewMode === "recent"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Recently Updated
                </button>
              </div>
            </div>
          </div>

          {/* Comparison bar */}
          {compareList.length > 0 && (
            <div className="max-w-4xl mx-auto mb-6">
              <div className="bg-card border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">
                      Compare Packages ({compareList.length}/3)
                    </h3>
                    <div className="flex gap-2">
                      {compareList.map((pkg) => (
                        <span
                          key={pkg.name}
                          className="px-2 py-1 bg-muted rounded text-sm"
                        >
                          {pkg.name}
                          <button
                            type="button"
                            onClick={() => toggleCompare(pkg)}
                            className="ml-1 text-muted-foreground hover:text-foreground"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowComparison(true)}
                      className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90"
                      disabled={compareList.length < 2}
                    >
                      Compare
                    </button>
                    <button
                      type="button"
                      onClick={() => setCompareList([])}
                      className="px-3 py-1 bg-muted text-muted-foreground rounded text-sm hover:bg-muted/80"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search and filters */}
          <div className="max-w-4xl mx-auto">
            <SearchBar
              onSearch={handleSearch}
              categories={categories}
              isLoading={false}
              placeholder="Search packages like node, git, docker..."
            />
          </div>

          {/* Package grid */}
          <PackageGrid
            packages={filteredPackages}
            isLoading={false}
            compareList={compareList}
            onToggleCompare={toggleCompare}
          />
        </main>
      </div>

      {/* Package Comparison Modal */}
      <PackageComparison
        packages={compareList}
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
      />
    </div>
  );
}

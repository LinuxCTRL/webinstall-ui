"use client";

import { useState } from "react";
import type { Package } from "@/types";
import { PackageCard } from "./PackageCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Grid, List, Package2 } from "lucide-react";

interface PackageGridProps {
  packages: Package[];
  isLoading?: boolean;
  error?: string;
  compareList?: Package[];
  onToggleCompare?: (pkg: Package) => void;
}

type ViewMode = "grid" | "list";
type SortOption = "name" | "category" | "updated";

export function PackageGrid({
  packages,
  isLoading = false,
  error,
  compareList = [],
  onToggleCompare,
}: PackageGridProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [displayCount, setDisplayCount] = useState(24);

  // Sort packages based on selected option
  const sortedPackages = [...packages].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "category":
        return (
          a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
        );
      case "updated":
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      default:
        return 0;
    }
  });

  const displayedPackages = sortedPackages.slice(0, displayCount);
  const hasMore = displayCount < packages.length;

  const loadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 24, packages.length));
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <Package2 className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Failed to load packages</h3>
        <p className="text-muted-foreground text-center max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {isLoading
              ? "Loading..."
              : `${packages.length} package${packages.length !== 1 ? "s" : ""}`}
          </span>

          {!isLoading && packages.length > 0 && (
            <Select
              value={sortBy}
              onValueChange={(value: SortOption) => setSortBy(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="updated">Recently Updated</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {!isLoading && packages.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Grid</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">List</span>
            </Button>
          </div>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <>
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Loading packages from GitHub API...</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              This may take a moment on first load while we fetch the latest
              packages.
            </p>
          </div>
          <div
            className={`grid gap-4 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <PackageCardSkeleton
                key={`skeleton-${sortBy}-${viewMode}-${i}`}
                variant={viewMode}
              />
            ))}
          </div>
        </>
      )}

      {/* Empty state */}
      {!isLoading && packages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <Package2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No packages found</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Try adjusting your search terms or filters to find what you're
            looking for.
          </p>
        </div>
      )}

      {/* Package grid/list */}
      {!isLoading && packages.length > 0 && (
        <>
          <div
            className={`grid gap-4 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {displayedPackages.map((pkg) => (
              <PackageCard 
                key={pkg.name} 
                package={pkg} 
                variant={viewMode}
                isInCompareList={compareList.some(p => p.name === pkg.name)}
                onToggleCompare={onToggleCompare}
                canAddToCompare={compareList.length < 3}
              />
            ))}
          </div>

          {/* Load more button */}
          {hasMore && (
            <div className="flex justify-center pt-6">
              <Button onClick={loadMore} variant="outline">
                Load More ({packages.length - displayCount} remaining)
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PackageCardSkeleton({ variant }: { variant: ViewMode }) {
  if (variant === "list") {
    return (
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-full max-w-md" />
            <div className="flex gap-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-1">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-6 w-14" />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  );
}

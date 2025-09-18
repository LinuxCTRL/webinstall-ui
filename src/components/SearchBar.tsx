"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { SearchFilters } from "@/types";
import { debounce } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  categories: string[];
  isLoading?: boolean;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  categories,
  isLoading = false,
  placeholder = "Search packages...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: undefined,
    platforms: {
      linux: false,
      macos: false,
      windows: false,
    },
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchFilters: SearchFilters) => {
      onSearch(searchFilters)
    }, 300),
    [onSearch]
  )

  // Update search when query or filters change
  useEffect(() => {
    const searchFilters = { 
      query, 
      category: filters.category, 
      platforms: filters.platforms 
    }
    debouncedSearch(searchFilters)
  }, [query, filters.category, filters.platforms.linux, filters.platforms.macos, filters.platforms.windows, debouncedSearch])

  const handleQueryChange = (value: string) => {
    setQuery(value);
  };

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === category ? undefined : category,
    }));
  };

  const handlePlatformChange = (platform: keyof typeof filters.platforms) => {
    setFilters((prev) => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: !prev.platforms[platform],
      },
    }));
  };

  const clearFilters = () => {
    setQuery("");
    setFilters({
      query: "",
      category: undefined,
      platforms: {
        linux: false,
        macos: false,
        windows: false,
      },
    });
  };

  const hasActiveFilters =
    query || filters.category || Object.values(filters.platforms).some(Boolean);

  const activeFilterCount =
    (query ? 1 : 0) +
    (filters.category ? 1 : 0) +
    Object.values(filters.platforms).filter(Boolean).length;

  return (
    <div className="w-full space-y-3">
      {/* Main search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          className="pl-9 pr-20"
          disabled={isLoading}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {/* Filter button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 relative"
              >
                <Filter className="h-4 w-4" />
                {activeFilterCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-3">
                    Filter by Category
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <div
                        key={category}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`category-${category}`}
                          checked={filters.category === category}
                          onCheckedChange={() => handleCategoryChange(category)}
                        />
                        <Label
                          htmlFor={`category-${category}`}
                          className="text-xs cursor-pointer"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-sm mb-3">
                    Filter by Platform
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(filters.platforms).map(
                      ([platform, checked]) => (
                        <div
                          key={platform}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`platform-${platform}`}
                            checked={checked}
                            onCheckedChange={() =>
                              handlePlatformChange(
                                platform as keyof typeof filters.platforms,
                              )
                            }
                          />
                          <Label
                            htmlFor={`platform-${platform}`}
                            className="text-sm cursor-pointer capitalize"
                          >
                            {platform === "macos" ? "macOS" : platform}
                          </Label>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {hasActiveFilters && (
                  <>
                    <Separator />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="w-full"
                    >
                      Clear All Filters
                    </Button>
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Clear search button */}
          {query && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>

          {query && (
            <Badge variant="secondary" className="text-xs">
              Search: "{query}"
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                onClick={() => setQuery("")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.category && (
            <Badge variant="secondary" className="text-xs">
              Category: {filters.category}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                onClick={() => handleCategoryChange(filters.category!)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {Object.entries(filters.platforms)
            .filter(([_, checked]) => checked)
            .map(([platform]) => (
              <Badge key={platform} variant="secondary" className="text-xs">
                {platform === "macos" ? "macOS" : platform}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  onClick={() =>
                    handlePlatformChange(
                      platform as keyof typeof filters.platforms,
                    )
                  }
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}

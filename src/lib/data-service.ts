import type { Package, GitHubFileContent } from "@/types";
import {
  githubApi,
  extractPackageDirectories,
  findPackageFiles,
  decodeBase64Content,
} from "./github-api";
import { parsePackage, isValidPackage } from "./package-parser";

export class WebiDataService {
  private static instance: WebiDataService;
  private packagesCache: Package[] | null = null;
  private lastFetchTime: number = 0;
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
  private fetchPromise: Promise<Package[]> | null = null;

  static getInstance(): WebiDataService {
    if (!WebiDataService.instance) {
      WebiDataService.instance = new WebiDataService();
    }
    return WebiDataService.instance;
  }

  /**
   * Fetch all packages from the webi-installers repository
   */
  async getAllPackages(forceRefresh = false): Promise<Package[]> {
    const now = Date.now();

    // Return cached data if available and not expired
    if (
      !forceRefresh &&
      this.packagesCache &&
      now - this.lastFetchTime < this.CACHE_DURATION
    ) {
      return this.packagesCache;
    }

    // If a fetch is already in progress, return that promise
    if (this.fetchPromise) {
      return this.fetchPromise;
    }

    console.log("Fetching packages from GitHub API...");

    // Create and store the fetch promise
    this.fetchPromise = this.performFetch();

    try {
      const result = await this.fetchPromise;
      return result;
    } catch (error) {
      throw error;
    } finally {
      this.fetchPromise = null;
    }
  }

  /**
   * Perform the actual fetch operation
   */
  private async performFetch(): Promise<Package[]> {
    try {
      // Get repository tree
      const tree = await githubApi.getRepositoryTree();
      const packageDirectories = extractPackageDirectories(tree);

      console.log(`Found ${packageDirectories.length} potential packages`);

      // Process packages in batches to avoid overwhelming the API
      const batchSize = 10;
      const packages: Package[] = [];

      for (let i = 0; i < packageDirectories.length; i += batchSize) {
        const batch = packageDirectories.slice(i, i + batchSize);
        const batchPromises = batch.map((packageName) =>
          this.fetchSinglePackage(tree, packageName),
        );

        const batchResults = await Promise.allSettled(batchPromises);

        for (const result of batchResults) {
          if (result.status === "fulfilled" && result.value) {
            packages.push(result.value);
          } else if (result.status === "rejected") {
            console.warn("Failed to fetch package:", result.reason);
          }
        }

        // Add small delay between batches to be respectful to GitHub API
        if (i + batchSize < packageDirectories.length) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      // Filter out invalid packages
      const validPackages = packages.filter(isValidPackage);

      console.log(
        `Successfully fetched ${validPackages.length} valid packages`,
      );

      // Update cache
      this.packagesCache = validPackages;
      this.lastFetchTime = Date.now();

      return validPackages;
    } catch (error) {
      console.error("Failed to fetch packages:", error);

      // Return cached data if available, even if expired
      if (this.packagesCache) {
        console.log("Returning cached data due to fetch error");
        return this.packagesCache;
      }

      throw error;
    }
  }

  /**
   * Fetch a single package's data
   */
  private async fetchSinglePackage(
    tree: any,
    packageName: string,
  ): Promise<Package | null> {
    try {
      const packageFiles = findPackageFiles(tree, packageName);

      // Skip packages without README
      if (!packageFiles.readme) {
        console.warn(`Package ${packageName} has no README.md, skipping`);
        return null;
      }

      // Fetch README content
      const readmeFile = await githubApi.getFileContent(packageFiles.readme);
      const readmeContent = decodeBase64Content(readmeFile.content);

      // Parse package data
      const packageData = parsePackage(
        packageName,
        readmeContent,
        !!packageFiles.installSh,
        !!packageFiles.installPs1,
        new Date().toISOString(), // We could get actual last modified date from Git API if needed
      );

      return packageData;
    } catch (error) {
      console.warn(`Failed to fetch package ${packageName}:`, error);
      return null;
    }
  }

  /**
   * Get a specific package by name
   */
  async getPackage(packageName: string): Promise<Package | null> {
    const packages = await this.getAllPackages();
    return packages.find((pkg) => pkg.name === packageName) || null;
  }

  /**
   * Search packages by query string
   */
  async searchPackages(query: string): Promise<Package[]> {
    const packages = await this.getAllPackages();

    if (!query.trim()) {
      return packages;
    }

    const searchTerm = query.toLowerCase();

    return packages.filter(
      (pkg) =>
        pkg.name.toLowerCase().includes(searchTerm) ||
        pkg.title.toLowerCase().includes(searchTerm) ||
        pkg.tagline.toLowerCase().includes(searchTerm) ||
        pkg.description.toLowerCase().includes(searchTerm) ||
        pkg.category.toLowerCase().includes(searchTerm),
    );
  }

  /**
   * Filter packages by category
   */
  async getPackagesByCategory(category: string): Promise<Package[]> {
    const packages = await this.getAllPackages();
    return packages.filter((pkg) => pkg.category === category);
  }

  /**
   * Filter packages by platform
   */
  async getPackagesByPlatform(
    platform: "linux" | "macos" | "windows",
  ): Promise<Package[]> {
    const packages = await this.getAllPackages();
    return packages.filter((pkg) => pkg.platforms[platform]);
  }

  /**
   * Get all available categories
   */
  async getCategories(): Promise<string[]> {
    const packages = await this.getAllPackages();
    const categories = new Set(packages.map((pkg) => pkg.category));
    return Array.from(categories).sort();
  }

  /**
   * Get package statistics
   */
  async getStats(): Promise<{
    totalPackages: number;
    categoriesCount: number;
    platformCounts: {
      linux: number;
      macos: number;
      windows: number;
    };
  }> {
    const packages = await this.getAllPackages();
    const categories = await this.getCategories();

    return {
      totalPackages: packages.length,
      categoriesCount: categories.length,
      platformCounts: {
        linux: packages.filter((pkg) => pkg.platforms.linux).length,
        macos: packages.filter((pkg) => pkg.platforms.macos).length,
        windows: packages.filter((pkg) => pkg.platforms.windows).length,
      },
    };
  }

  /**
   * Clear cache (useful for development or forced refresh)
   */
  clearCache(): void {
    this.packagesCache = null;
    this.lastFetchTime = 0;
  }
}

// Export singleton instance
export const webiDataService = WebiDataService.getInstance();

// Convenience functions for common operations
export const getAllPackages = () => webiDataService.getAllPackages();
export const getPackage = (name: string) => webiDataService.getPackage(name);
export const searchPackages = (query: string) =>
  webiDataService.searchPackages(query);
export const getPackagesByCategory = (category: string) =>
  webiDataService.getPackagesByCategory(category);
export const getPackagesByPlatform = (
  platform: "linux" | "macos" | "windows",
) => webiDataService.getPackagesByPlatform(platform);
export const getCategories = () => webiDataService.getCategories();
export const getStats = () => webiDataService.getStats();

import type { Package } from "@/types";

export interface PackageRating {
  packageName: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  reviews: never[]; // No reviews, just for compatibility
}

// Popular packages that should have higher ratings
const POPULAR_PACKAGES = [
  'node', 'git', 'docker', 'python', 'go', 'rust', 'npm', 'yarn', 
  'kubectl', 'terraform', 'ansible', 'vim', 'nvim', 'code', 'jq',
  'curl', 'wget', 'ssh', 'gh', 'make', 'cmake', 'nginx', 'postgres'
];

class RatingsService {
  private static instance: RatingsService;
  private ratingsCache = new Map<string, PackageRating>();

  static getInstance(): RatingsService {
    if (!RatingsService.instance) {
      RatingsService.instance = new RatingsService();
    }
    return RatingsService.instance;
  }

  /**
   * Generate simple rating data for a package
   */
  private generatePackageRating(pkg: Package): PackageRating {
    const isPopular = POPULAR_PACKAGES.includes(pkg.name.toLowerCase());
    const baseRating = isPopular ? 4.2 + Math.random() * 0.6 : 3.5 + Math.random() * 1.0;
    
    // Simple empty distribution since we don't need reviews
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    return {
      packageName: pkg.name,
      averageRating: Math.round(baseRating * 10) / 10, // Round to 1 decimal
      totalReviews: 0, // No reviews
      ratingDistribution: distribution,
      reviews: [] // Empty reviews array
    };
  }

  /**
   * Get rating data for a package
   */
  getPackageRating(pkg: Package): PackageRating {
    if (!this.ratingsCache.has(pkg.name)) {
      this.ratingsCache.set(pkg.name, this.generatePackageRating(pkg));
    }
    return this.ratingsCache.get(pkg.name)!;
  }

  /**
   * Get ratings for multiple packages
   */
  getPackageRatings(packages: Package[]): Map<string, PackageRating> {
    const ratings = new Map<string, PackageRating>();
    
    packages.forEach(pkg => {
      ratings.set(pkg.name, this.getPackageRating(pkg));
    });
    
    return ratings;
  }

  /**
   * Get top-rated packages
   */
  getTopRatedPackages(packages: Package[], limit = 10): { package: Package; rating: PackageRating }[] {
    const packageRatings = packages.map(pkg => ({
      package: pkg,
      rating: this.getPackageRating(pkg)
    }));

    return packageRatings
      .sort((a, b) => b.rating.averageRating - a.rating.averageRating)
      .slice(0, limit);
  }

  /**
   * Clear cache (useful for development)
   */
  clearCache(): void {
    this.ratingsCache.clear();
  }
}

// Export singleton instance
export const ratingsService = RatingsService.getInstance();

// Convenience functions
export const getPackageRating = (pkg: Package) => ratingsService.getPackageRating(pkg);
export const getPackageRatings = (packages: Package[]) => ratingsService.getPackageRatings(packages);
export const getTopRatedPackages = (packages: Package[], limit?: number) => ratingsService.getTopRatedPackages(packages, limit);
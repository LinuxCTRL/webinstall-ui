"use client";

import { Star, StarHalf } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PackageRatingProps {
  rating: number;
  totalReviews: number;
  showReviewCount?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PackageRating({ 
  rating, 
  totalReviews, 
  showReviewCount = true, 
  size = "md",
  className = ""
}: PackageRatingProps) {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const starSize = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4";

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className={`${starSize} fill-yellow-400 text-yellow-400`}
        />
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className={`${starSize} fill-yellow-400 text-yellow-400`}
        />
      );
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className={`${starSize} text-muted-foreground/30`}
        />
      );
    }

    return stars;
  };

  const textSize = size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-0.5">
        {renderStars()}
      </div>
      <span className={`font-medium ${textSize}`}>
        {rating.toFixed(1)}
      </span>
      {showReviewCount && (
        <span className={`text-muted-foreground ${textSize}`}>
          ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
}

interface RatingDistributionProps {
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  totalReviews: number;
  className?: string;
}

export function RatingDistribution({ distribution, totalReviews, className = "" }: RatingDistributionProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {[5, 4, 3, 2, 1].map((star) => {
        const count = distribution[star as keyof typeof distribution];
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
        
        return (
          <div key={star} className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1 w-8">
              <span className="text-muted-foreground">{star}</span>
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-yellow-400 transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-muted-foreground w-8 text-right">{count}</span>
          </div>
        );
      })}
    </div>
  );
}

interface QuickRatingProps {
  rating: number;
  size?: "sm" | "md";
  className?: string;
}

export function QuickRating({ rating, size = "sm", className = "" }: QuickRatingProps) {
  const starSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  
  return (
    <Badge variant="secondary" className={`flex items-center gap-1 ${className}`}>
      <Star className={`${starSize} fill-yellow-400 text-yellow-400`} />
      <span className={`font-medium ${textSize}`}>{rating.toFixed(1)}</span>
    </Badge>
  );
}
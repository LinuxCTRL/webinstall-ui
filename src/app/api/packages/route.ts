import { type NextRequest, NextResponse } from "next/server";
import { webiDataService } from "@/lib/data-service";
import type { Package } from "@/types";

// Cache the response for 30 minutes
export const revalidate = 1800;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const category = searchParams.get("category");
    const platform = searchParams.get("platform");
    const forceRefresh = searchParams.get("refresh") === "true";

    // Get packages based on query parameters
    let packages: Package[] | null = null;

    if (query) {
      packages = await webiDataService.searchPackages(query);
    } else if (category) {
      packages = await webiDataService.getPackagesByCategory(category);
    } else if (platform && ["linux", "macos", "windows"].includes(platform)) {
      packages = await webiDataService.getPackagesByPlatform(
        platform as "linux" | "macos" | "windows",
      );
    } else {
      packages = await webiDataService.getAllPackages(forceRefresh);
    }

    // Apply additional filters if multiple params are provided
    if (packages && platform && !searchParams.get("platform")) {
      packages = packages.filter(
        (pkg) => pkg.platforms[platform as keyof typeof pkg.platforms],
      );
    }

    return NextResponse.json({
      success: true,
      data: packages,
      count: packages.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch packages",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

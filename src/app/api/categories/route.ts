import { NextResponse } from "next/server";
import { webiDataService } from "@/lib/data-service";

export async function GET() {
  try {
    const categories = await webiDataService.getCategories();

    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Categories API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

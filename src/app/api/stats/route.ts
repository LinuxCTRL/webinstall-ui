import { NextResponse } from "next/server";
import { webiDataService } from "@/lib/data-service";

export async function GET() {
  try {
    const stats = await webiDataService.getStats();

    return NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Stats API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch statistics",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

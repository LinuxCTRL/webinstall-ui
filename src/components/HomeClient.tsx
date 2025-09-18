"use client";

// biome-ignore assist/source/organizeImports: some
import { Suspense } from "react";
import type { Package } from "@/types";
import { HomeContent } from "@/components/HomeContent";

interface HomeClientProps {
  initialPackages: Package[];
  initialCategories: string[];
}

export function HomeClient({
  initialPackages,
  initialCategories,
}: HomeClientProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent
        initialPackages={initialPackages}
        initialCategories={initialCategories}
      />
    </Suspense>
  );
}

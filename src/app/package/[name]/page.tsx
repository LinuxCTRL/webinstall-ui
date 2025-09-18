import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPackage, getAllPackages } from "@/lib/data-service";
import { PackageDetailView } from "@/components/PackageDetailView";

interface PackagePageProps {
  params: { name: string };
}

// Generate static params for all packages (ISR)
export async function generateStaticParams() {
  try {
    const packages = await getAllPackages();
    return packages.map((pkg) => ({
      name: pkg.name,
    }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PackagePageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const pkg = await getPackage(resolvedParams.name);

    if (!pkg) {
      return {
        title: "Package Not Found - WebInstall UI",
        description: "The requested package could not be found.",
      };
    }

    const platforms = Object.entries(pkg.platforms)
      .filter(([_, supported]) => supported)
      .map(([platform]) => platform);

    return {
      title: `${pkg.title} - Install with One Command`,
      description:
        pkg.description ||
        pkg.tagline ||
        `Install ${pkg.title} instantly on ${platforms.join(', ')}. Cross-platform developer tool available through webinstall.dev with simple one-command installation.`,
      keywords: [
        pkg.name,
        pkg.title,
        pkg.category.toLowerCase(),
        "install " + pkg.name,
        "download " + pkg.name,
        ...platforms,
        "webinstall",
        "package manager",
        "developer tools",
        "CLI tools",
        "cross-platform",
        "one command install",
      ],
      authors: [{ name: "WebInstall UI" }],
      openGraph: {
        title: `${pkg.title} - Install with One Command`,
        description: pkg.description || pkg.tagline || `Install ${pkg.title} instantly with webinstall.dev`,
        type: "website",
        url: `/package/${pkg.name}`,
        siteName: "WebInstall UI",
        images: [
          {
            url: "/og-image.png",
            width: 1200,
            height: 630,
            alt: `Install ${pkg.title} - WebInstall UI`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${pkg.title} - Install with One Command`,
        description: pkg.description || pkg.tagline || `Install ${pkg.title} instantly`,
        images: ["/og-image.png"],
      },
      alternates: {
        canonical: `/package/${pkg.name}`,
      },
      other: {
        'article:published_time': pkg.updatedAt,
        'article:modified_time': pkg.updatedAt,
        'article:section': pkg.category,
        'article:tag': [pkg.name, pkg.category, ...platforms].join(','),
      },
    };
  } catch (error) {
    return {
      title: "Error - WebInstall UI",
      description: "An error occurred while loading the package.",
    };
  }
}

export default async function PackagePage({ params }: PackagePageProps) {
  try {
    const resolvedParams = await params;
    const pkg = await getPackage(resolvedParams.name);

    if (!pkg) {
      notFound();
    }

    return <PackageDetailView package={pkg} />;
  } catch (error) {
    console.error("Failed to load package:", error);
    notFound();
  }
}

// Enable ISR with 30 minute revalidation
export const revalidate = 1800;

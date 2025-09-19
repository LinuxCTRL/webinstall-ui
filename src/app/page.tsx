import { VideoHero } from "@/components/VideoHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WebInstall UI - Modern Package Discovery",
  description:
    "Discover and install development tools with a single command. A modern interface for the webinstall.dev ecosystem with 170+ packages. Cross-platform support for Linux, macOS, and Windows.",
  keywords: [
    "developer tools",
    "package discovery",
    "install packages",
    "webinstall",
    "command line",
    "development environment",
    "cross-platform tools",
  ],
  openGraph: {
    title: "WebInstall UI - Modern Package Discovery",
    description:
      "Discover and install development tools with a single command. A modern interface for the webinstall.dev ecosystem.",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "WebInstall UI - Modern Package Discovery",
    description:
      "Discover and install development tools with a single command.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <VideoHero />;
}

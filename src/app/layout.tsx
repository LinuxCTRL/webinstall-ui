import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/footer";
import { Header } from "@/components/Header";
import { getAllPackages } from "@/lib/data-service";

const Operator = localFont({
  src: "./../../public/fonts/OperatorMonoLig-Book.otf",
});

export const metadata: Metadata = {
  title: {
    default: "WebInstall UI - Modern Package Discovery",
    template: "%s | WebInstall UI",
  },
  description:
    "Discover and install development tools with a single command. Browse 170+ packages including Node.js, Docker, Git, Python, and more. A modern interface for the webinstall.dev ecosystem.",
  keywords: [
    "webinstall",
    "package manager",
    "developer tools",
    "install packages",
    "command line tools",
    "development environment",
    "node.js",
    "docker",
    "git",
    "python",
    "go",
    "rust",
    "CLI tools",
    "cross-platform",
    "linux",
    "macos",
    "windows",
  ],
  authors: [{ name: "WebInstall UI" }],
  creator: "WebInstall UI",
  publisher: "WebInstall UI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://webinstall-ui.vercel.app",
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "WebInstall UI - Modern Package Discovery",
    description:
      "Discover and install development tools with a single command. Browse 170+ packages including Node.js, Docker, Git, Python, and more.",
    siteName: "WebInstall UI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WebInstall UI - Modern Package Discovery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WebInstall UI - Modern Package Discovery",
    description:
      "Discover and install development tools with a single command. Browse 170+ packages.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const packages = await getAllPackages();
  const packagesLength = packages.length;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${Operator.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header packageCount={packagesLength} />
          {children}
          <Footer />
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}

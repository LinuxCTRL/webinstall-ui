"use client";

import { useState } from "react";
import Link from "next/link";
import type { Package } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImWindows } from "react-icons/im";
import { FaLinux } from "react-icons/fa";
import { RiAppleLine } from "react-icons/ri";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Copy,
  CheckCircle2,
  Monitor,
  Apple,
  Zap,
  Calendar,
  Tag,
  Terminal,
  Info,
  Share,
} from "lucide-react";
import { copyToClipboard, formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface PackageDetailViewProps {
  package: Package;
}

export function PackageDetailView({ package: pkg }: PackageDetailViewProps) {
  const [copied, setCopied] = useState<string | null>(null);

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: pkg.title,
    applicationCategory: "DeveloperApplication",
    operatingSystem: Object.entries(pkg.platforms)
      .filter(([_, supported]) => supported)
      .map(([platform]) =>
        platform === "macos"
          ? "macOS"
          : platform === "linux"
            ? "Linux"
            : "Windows",
      )
      .join(", "),
    description: pkg.description || pkg.tagline,
    url: pkg.homepage,
    downloadUrl: `https://webinstall.dev/${pkg.name}`,
    applicationSubCategory: pkg.category,
    dateModified: pkg.updatedAt,
    softwareVersion: "latest",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "WebInstall.dev",
    },
    installUrl: `https://webinstall.dev/${pkg.name}`,
    screenshot: `/og-image.png`,
    keywords: [
      pkg.name,
      pkg.title,
      pkg.category,
      "developer tools",
      "CLI",
      "command line",
    ].join(", "),
  };

  const handleCopyCommand = async (command: string, type: string) => {
    try {
      await copyToClipboard(command);
      setCopied(type);
      toast.success(`${type} command copied to clipboard!`);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      toast.error("Failed to copy command");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: pkg.title,
          text: pkg.description || pkg.tagline,
          url: url,
        });
      } else {
        await copyToClipboard(url);
        toast.success("Page URL copied to clipboard!");
      }
    } catch (error) {
      console.error("Failed to share:", error);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "linux":
        return <FaLinux className="h-4 w-4" />;
      case "macos":
        return <RiAppleLine className="h-4 w-4" />;
      case "windows":
        return <ImWindows className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const supportedPlatforms = Object.entries(pkg.platforms)
    .filter(([_, supported]) => supported)
    .map(([platform]) => platform);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Background texture (same as main page) */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] animate-pulse"
        style={{ animationDuration: "8s" }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <title>Background scratches pattern</title>
          <defs>
            <pattern
              id="scratches"
              patternUnits="userSpaceOnUse"
              width="400"
              height="400"
            >
              <path
                d="M0,50 Q100,30 200,60 T400,40"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
                opacity="0.3"
              />
              <path
                d="M50,0 Q70,100 90,200 T130,400"
                stroke="currentColor"
                strokeWidth="0.3"
                fill="none"
                opacity="0.2"
              />
              <path
                d="M150,20 Q250,40 350,10 T450,30"
                stroke="currentColor"
                strokeWidth="0.4"
                fill="none"
                opacity="0.25"
              />
              <path
                d="M20,150 Q40,250 80,350 T140,450"
                stroke="currentColor"
                strokeWidth="0.2"
                fill="none"
                opacity="0.15"
              />
              <path
                d="M300,5 Q320,105 340,205 T380,405"
                stroke="currentColor"
                strokeWidth="0.3"
                fill="none"
                opacity="0.2"
              />
              <path
                d="M10,300 Q110,320 210,340 T410,380"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#scratches)" />
        </svg>
      </div>

      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent_70%)] mix-blend-multiply dark:mix-blend-screen"></div>
      </div>

      <div className="relative z-10">
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              Packages
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{pkg.name}</span>
          </div>

          {/* Hero Section */}
          <div className="mb-8">
            <div className="flex items-start justify-between gap-6 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Button variant="ghost" size="sm" asChild className="mb-1">
                    <Link href="/">
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Link>
                  </Button>
                </div>

                <h1 className="text-4xl font-bold tracking-tight mb-3">
                  {pkg.title}
                </h1>

                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <Badge variant="secondary" className="text-sm">
                    <Tag className="h-3 w-3 mr-1" />
                    {pkg.category}
                  </Badge>

                  {supportedPlatforms.map((platform) => (
                    <TooltipProvider key={platform}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="text-sm">
                            {getPlatformIcon(platform)}
                            <span className="ml-1 capitalize">
                              {platform === "macos" ? "macOS" : platform}
                            </span>
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Available on{" "}
                            {platform === "macos" ? "macOS" : platform}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>

                {(pkg.tagline || pkg.description) && (
                  <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                    {pkg.tagline || pkg.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 shrink-0">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Install
                    </Button>
                  </DialogTrigger>
                  <InstallDialog
                    package={pkg}
                    onCopyCommand={handleCopyCommand}
                    copied={copied}
                  />
                </Dialog>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleShare}
                  className="shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <Share className="h-5 w-5" />
                </Button>

                {pkg.homepage && (
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    <a
                      href={pkg.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="installation"
                className="flex items-center gap-2"
              >
                <Terminal className="h-4 w-4" />
                <span className="hidden sm:inline">Installation</span>
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Details</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Package Info */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Package Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Package Name
                      </span>
                      <p className="font-mono text-lg">{pkg.name}</p>
                    </div>

                    <Separator />

                    <div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Category
                      </span>
                      <p>{pkg.category}</p>
                    </div>

                    {pkg.version && (
                      <>
                        <Separator />
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">
                            Version
                          </span>
                          <p className="font-mono">{pkg.version}</p>
                        </div>
                      </>
                    )}

                    <Separator />

                    <div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Last Updated
                      </span>
                      <p>{formatDate(pkg.updatedAt)}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Platform Support */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5" />
                      Platform Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(pkg.platforms).map(
                      ([platform, supported]) => (
                        <div
                          key={platform}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            {getPlatformIcon(platform)}
                            <span className="capitalize">
                              {platform === "macos" ? "macOS" : platform}
                            </span>
                          </div>
                          {supported ? (
                            <Badge
                              variant="default"
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Supported
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Not Available</Badge>
                          )}
                        </div>
                      ),
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Description */}
              {pkg.description && pkg.description !== pkg.tagline && (
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {pkg.description}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="installation" className="space-y-6">
              <InstallationCommands
                package={pkg}
                onCopyCommand={handleCopyCommand}
                copied={copied}
              />
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Package Details</CardTitle>
                  <CardDescription>
                    Technical information and metadata for {pkg.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Package ID
                      </span>
                      <p className="font-mono bg-muted px-2 py-1 rounded text-sm">
                        {pkg.name}
                      </p>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Display Name
                      </span>
                      <p>{pkg.title}</p>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Category
                      </span>
                      <p>{pkg.category}</p>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Last Modified
                      </span>
                      <p>{formatDate(pkg.updatedAt)}</p>
                    </div>
                  </div>

                  {pkg.homepage && (
                    <>
                      <Separator />
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">
                          Homepage
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <a
                            href={pkg.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-mono text-sm"
                          >
                            {pkg.homepage}
                          </a>
                          <Button variant="ghost" size="sm" asChild>
                            <a
                              href={pkg.homepage}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

// Installation Commands Component
function InstallationCommands({
  package: pkg,
  onCopyCommand,
  copied,
}: {
  package: Package;
  onCopyCommand: (command: string, type: string) => void;
  copied: string | null;
}) {
  return (
    <div className="space-y-6">
      {/* Quick Install */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Quick Install
          </CardTitle>
          <CardDescription>
            Copy and paste these commands to install {pkg.title}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(pkg.platforms.linux || pkg.platforms.macos) && (
            <div className="space-y-3">
              <h4 className="font-medium">Linux / macOS</h4>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <code className="flex-1 text-sm bg-muted p-3 rounded font-mono">
                    {pkg.installCommand.curl}
                  </code>
                  <Button
                    variant="outline"
                    onClick={() =>
                      onCopyCommand(pkg.installCommand.curl, "curl")
                    }
                    className="shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    {copied === "curl" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  <code className="flex-1 text-sm bg-muted p-3 rounded font-mono">
                    {pkg.installCommand.wget}
                  </code>
                  <Button
                    variant="outline"
                    onClick={() =>
                      onCopyCommand(pkg.installCommand.wget, "wget")
                    }
                    className="shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    {copied === "wget" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {pkg.platforms.windows && (
            <div className="space-y-3">
              <h4 className="font-medium">Windows (PowerShell)</h4>
              <div className="flex items-center gap-3">
                <code className="flex-1 text-sm bg-muted p-3 rounded font-mono">
                  {pkg.installCommand.powershell}
                </code>
                <Button
                  variant="outline"
                  onClick={() =>
                    onCopyCommand(pkg.installCommand.powershell, "powershell")
                  }
                  className="shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  {copied === "powershell" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Installation Notes */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Installation Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            • These commands will download and install {pkg.title} using the
            webinstall.dev service.
          </p>
          <p>
            • The installer will automatically detect your operating system and
            architecture.
          </p>
          <p>
            • Installation typically takes less than a minute and requires an
            internet connection.
          </p>
          <p>
            • Make sure you trust the source before running installation
            commands.
          </p>
          <p>
            • Some packages may require administrator/sudo privileges for
            installation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Install Dialog Component (reused from PackageCard)
function InstallDialog({
  package: pkg,
  onCopyCommand,
  copied,
}: {
  package: Package;
  onCopyCommand: (command: string, type: string) => void;
  copied: string | null;
}) {
  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Install {pkg.title}</DialogTitle>
        <DialogDescription>
          Choose your preferred installation method for {pkg.name}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {(pkg.platforms.linux || pkg.platforms.macos) && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Linux / macOS</h4>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm bg-muted p-2 rounded font-mono break-all">
                  {pkg.installCommand.curl}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCopyCommand(pkg.installCommand.curl, "curl")}
                >
                  {copied === "curl" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm bg-muted p-2 rounded font-mono break-all">
                  {pkg.installCommand.wget}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCopyCommand(pkg.installCommand.wget, "wget")}
                >
                  {copied === "wget" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {pkg.platforms.windows && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Windows (PowerShell)</h4>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm bg-muted p-2 rounded font-mono break-all">
                {pkg.installCommand.powershell}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onCopyCommand(pkg.installCommand.powershell, "powershell")
                }
              >
                {copied === "powershell" ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
          <p className="font-medium mb-1">Note:</p>
          <p>
            These commands will download and install {pkg.name} using the
            webinstall.dev service. Make sure you trust the source before
            running installation commands.
          </p>
        </div>
      </div>
    </DialogContent>
  );
}

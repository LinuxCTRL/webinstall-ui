"use client";

import { useState } from "react";
import Link from "next/link";
import type { Package } from "@/types";
import { getPackageRating } from "@/lib/ratings-service";
import { QuickRating } from "@/components/PackageRating";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImWindows } from "react-icons/im";
import { FaLinux } from "react-icons/fa";
import { RiAppleLine } from "react-icons/ri";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Copy,
  Download,
  ExternalLink,
  // Icons for UI elements
  CheckCircle2,
  GitCompare,
} from "lucide-react";
import { copyToClipboard } from "@/lib/utils";
import { toast } from "sonner";

interface PackageCardProps {
  package: Package;
  variant?: "grid" | "list";
  isInCompareList?: boolean;
  onToggleCompare?: (pkg: Package) => void;
  canAddToCompare?: boolean;
}

export function PackageCard({
  package: pkg,
  variant = "grid",
  isInCompareList = false,
  onToggleCompare,
  canAddToCompare = true,
}: PackageCardProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const packageRating = getPackageRating(pkg);

  const handleCopyCommand = async (command: string, type: string) => {
    try {
      await copyToClipboard(command);
      setCopied(type);
      toast.success(`${type} command copied to clipboard!`);
      setTimeout(() => setCopied(null), 2000);
    } catch (_error: unknown) {
      toast.error("Failed to copy command");
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

  // Get category-based accent color
  const getCategoryColor = (category: string) => {
    const colors = {
      "JavaScript Runtime":
        "from-yellow-500/20 to-orange-500/20 border-yellow-500/30",
      Python: "from-blue-500/20 to-green-500/20 border-blue-500/30",
      Go: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
      Rust: "from-orange-500/20 to-red-500/20 border-orange-500/30",
      "Java/JVM": "from-red-500/20 to-orange-500/20 border-red-500/30",
      "Version Control":
        "from-purple-500/20 to-pink-500/20 border-purple-500/30",
      Containers: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
      Kubernetes: "from-indigo-500/20 to-blue-500/20 border-indigo-500/30",
      Infrastructure: "from-green-500/20 to-emerald-500/20 border-green-500/30",
      Editors: "from-violet-500/20 to-purple-500/20 border-violet-500/30",
      "CLI Utilities": "from-gray-500/20 to-slate-500/20 border-gray-500/30",
      Databases: "from-emerald-500/20 to-green-500/20 border-emerald-500/30",
      Security: "from-red-500/20 to-pink-500/20 border-red-500/30",
    };
    return (
      colors[category as keyof typeof colors] ||
      "from-primary/20 to-secondary/20 border-primary/30"
    );
  };

  const categoryColorClass = getCategoryColor(pkg.category);

  if (variant === "list") {
    return (
      <Card className="group relative hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:rotate-0.5 shadow-md bg-gradient-to-r from-background to-muted/10 border hover:border-primary/20 hover:bg-gradient-to-r hover:from-background hover:to-primary/5 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 animate-pulse" />
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3 mb-1">
                <CardTitle className="text-lg font-semibold leading-tight flex-1 min-w-0">
                  <Link
                    href={`/package/${pkg.name}`}
                    className="hover:text-primary transition-colors"
                  >
                    {pkg.title}
                  </Link>
                </CardTitle>
                <Badge
                  variant="secondary"
                  className={`text-xs shrink-0 mt-1 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-r ${categoryColorClass} hover:scale-105 relative overflow-hidden group/badge`}
                >
                  <span className="relative z-10">{pkg.category}</span>
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover/badge:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                </Badge>
              </div>
              <CardDescription className="text-sm text-muted-foreground line-clamp-1">
                {pkg.tagline || pkg.description}
              </CardDescription>
              <div className="flex items-center gap-2 mt-2">
                {supportedPlatforms.map((platform) => (
                  <TooltipProvider key={platform}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/60 px-2 py-1 rounded-full hover:bg-muted hover:text-foreground transition-all duration-200 hover:scale-105 cursor-default border border-transparent hover:border-border">
                          {getPlatformIcon(platform)}
                          <span className="capitalize font-medium">
                            {platform}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Available on {platform}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
                <QuickRating rating={packageRating.averageRating} size="sm" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 relative overflow-hidden group/install bg-gradient-to-r from-background to-muted/50 hover:from-primary/10 hover:to-primary/5 border-primary/20 hover:border-primary/40"
                  >
                    <Download className="h-4 w-4 group-hover/install:animate-bounce" />
                    <span className="relative z-10">Install</span>
                    {/* Pulse effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover/install:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </Button>
                </DialogTrigger>
                <InstallDialog
                  package={pkg}
                  onCopyCommand={handleCopyCommand}
                  copied={copied}
                />
              </Dialog>
              {onToggleCompare && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isInCompareList ? "default" : "ghost"}
                        size="sm"
                        className="shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
                        onClick={() => onToggleCompare(pkg)}
                        disabled={!isInCompareList && !canAddToCompare}
                      >
                        <GitCompare className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {isInCompareList
                          ? "Remove from compare"
                          : "Add to compare"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {pkg.homepage && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
                        asChild
                      >
                        <a
                          href={pkg.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Visit homepage</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group relative hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:rotate-1 shadow-lg bg-gradient-to-br from-background to-muted/20 border-2 hover:border-primary/20 hover:bg-gradient-to-br hover:from-background hover:to-primary/5 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/30 to-transparent rounded-full blur-xl" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-secondary/30 to-transparent rounded-full blur-lg" />
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "12px 12px",
          }}
        />
      </div>
      <CardHeader className="pb-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-lg font-semibold leading-tight pr-2 flex-1 min-w-0">
              <Link
                href={`/package/${pkg.name}`}
                className="hover:text-primary transition-colors"
              >
                {pkg.title}
              </Link>
            </CardTitle>
            <Badge
              variant="secondary"
              className={`text-xs shrink-0 mt-1 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-r ${categoryColorClass} hover:scale-105 relative overflow-hidden group/badge`}
            >
              <span className="relative z-10">{pkg.category}</span>
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover/badge:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            </Badge>
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            {pkg.name}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {pkg.tagline || pkg.description}
        </p>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {supportedPlatforms.map((platform) => (
            <TooltipProvider key={platform}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/70 px-3 py-1.5 rounded-full shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 hover:bg-muted hover:text-foreground border border-transparent hover:border-border cursor-default">
                    {getPlatformIcon(platform)}
                    <span className="capitalize font-medium">{platform}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Available on {platform}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
          <QuickRating rating={packageRating.averageRating} size="sm" />
        </div>
      </CardContent>

      <CardFooter className="pt-0 gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="flex-1 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary relative overflow-hidden group/install-grid"
              size="sm"
            >
              <Download className="h-4 w-4 group-hover/install-grid:animate-bounce" />
              <span className="relative z-10">Install</span>
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover/install-grid:opacity-100 transition-opacity duration-300 pointer-events-none" />
              {/* Sliding shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover/install-grid:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" />
            </Button>
          </DialogTrigger>
          <InstallDialog
            package={pkg}
            onCopyCommand={handleCopyCommand}
            copied={copied}
          />
        </Dialog>

        {onToggleCompare && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isInCompareList ? "default" : "outline"}
                  size="sm"
                  className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                  onClick={() => onToggleCompare(pkg)}
                  disabled={!isInCompareList && !canAddToCompare}
                >
                  <GitCompare className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isInCompareList ? "Remove from compare" : "Add to compare"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {pkg.homepage && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                  asChild
                >
                  <a
                    href={pkg.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Visit homepage</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardFooter>
    </Card>
  );
}

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
        {/* Webi Method - Always show this first */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm flex-1">
              Using Webi (Recommended)
            </h4>
            <Badge variant="secondary" className="text-xs">
              Fastest
            </Badge>
          </div>

          <div className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Choose your platform:
              </p>
              {/* Linux/macOS Installation */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaLinux className="h-4 w-4" />
                  <RiAppleLine className="h-4 w-4" />
                  <span className="text-xs font-medium">Linux / macOS</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm bg-muted p-2 rounded font-mono break-all">
                    curl -sS https://webi.sh/webi | sh; source
                    ~/.config/envman/PATH.env
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onCopyCommand(
                        "curl -sS https://webi.sh/webi | sh; source ~/.config/envman/PATH.env",
                        "webi-install-unix",
                      )
                    }
                  >
                    {copied === "webi-install-unix" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Windows Installation */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ImWindows className="h-4 w-4" />
                  <span className="text-xs font-medium">Windows</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm bg-muted p-2 rounded font-mono break-all">
                    curl.exe https://webi.ms/webi | powershell
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onCopyCommand(
                        "curl.exe https://webi.ms/webi | powershell",
                        "webi-install-win",
                      )
                    }
                  >
                    {copied === "webi-install-win" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Install the package using Webi */}
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2">
                  After installing Webi, install {pkg.name}:
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm bg-muted p-2 rounded font-mono break-all">
                    webi {pkg.name}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onCopyCommand(`webi ${pkg.name}`, "webi-pkg")
                    }
                  >
                    {copied === "webi-pkg" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <p className="text-sm font-medium">Alternative Methods</p>

        {pkg.platforms.linux || pkg.platforms.macos ? (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">
              Linux / macOS (Direct Install)
            </h4>
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
        ) : null}

        {pkg.platforms.windows && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">
              Windows (PowerShell Direct Install)
            </h4>
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

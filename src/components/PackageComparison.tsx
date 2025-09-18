"use client";

import type { Package } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, X, Monitor, Apple, Zap, ExternalLink } from "lucide-react";

interface PackageComparisonProps {
  packages: Package[];
  isOpen: boolean;
  onClose: () => void;
}

export function PackageComparison({ packages, isOpen, onClose }: PackageComparisonProps) {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "linux":
        return <Monitor className="h-4 w-4" />;
      case "macos":
        return <Apple className="h-4 w-4" />;
      case "windows":
        return <Zap className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const platforms = ["linux", "macos", "windows"] as const;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 py-4 border-b bg-muted/20">
          <DialogTitle className="flex items-center justify-between text-xl">
            Package Comparison
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription className="text-base">
            Compare features and installation commands across {packages.length} packages
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto p-6">
          {packages.length === 2 ? (
            // Two package comparison - side by side
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {packages.map((pkg) => (
                <ComparisonCard key={pkg.name} pkg={pkg} platforms={platforms} getPlatformIcon={getPlatformIcon} />
              ))}
            </div>
          ) : (
            // Three package comparison - responsive grid
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <ComparisonCard key={pkg.name} pkg={pkg} platforms={platforms} getPlatformIcon={getPlatformIcon} />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ComparisonCardProps {
  pkg: Package;
  platforms: readonly string[];
  getPlatformIcon: (platform: string) => JSX.Element | null;
}

function ComparisonCard({ pkg, platforms, getPlatformIcon }: ComparisonCardProps) {
  return (
    <Card className="h-fit border-2 hover:border-primary/20 transition-colors">
      <CardHeader className="pb-4 bg-gradient-to-r from-muted/30 to-muted/10">
        <CardTitle className="text-lg flex items-start justify-between gap-3">
          <span className="flex-1 min-w-0 font-bold">{pkg.title}</span>
          <Badge variant="secondary" className="text-xs shrink-0 font-medium">
            {pkg.category}
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground font-mono">{pkg.name}</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Description */}
        <div>
          <h4 className="font-semibold text-sm mb-2 text-foreground">Description</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {pkg.tagline || pkg.description || "No description available"}
          </p>
        </div>

        {/* Platform Support */}
        <div>
          <h4 className="font-semibold text-sm mb-3 text-foreground">Platform Support</h4>
          <div className="grid grid-cols-1 gap-2">
            {platforms.map((platform) => (
              <div key={platform} className="flex items-center gap-3 p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2 flex-1">
                  {getPlatformIcon(platform)}
                  <span className="capitalize font-medium text-sm">{platform}</span>
                </div>
                {pkg.platforms[platform] ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Installation Commands */}
        <div>
          <h4 className="font-semibold text-sm mb-3 text-foreground">Installation</h4>
          <div className="space-y-3">
            {pkg.platforms.linux || pkg.platforms.macos ? (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Unix (curl)</p>
                <code className="text-xs bg-muted/60 p-3 rounded-md block break-all font-mono border">
                  {pkg.installCommand.curl}
                </code>
              </div>
            ) : null}
            
            {pkg.platforms.windows ? (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Windows (PowerShell)</p>
                <code className="text-xs bg-muted/60 p-3 rounded-md block break-all font-mono border">
                  {pkg.installCommand.powershell}
                </code>
              </div>
            ) : null}
          </div>
        </div>

        {/* Homepage Link */}
        {pkg.homepage && (
          <div>
            <Button variant="outline" size="sm" className="w-full hover:bg-primary hover:text-primary-foreground transition-colors" asChild>
              <a
                href={pkg.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Visit Homepage
              </a>
            </Button>
          </div>
        )}

        {/* Last Updated */}
        {pkg.updatedAt && (
          <div className="pt-2 border-t">
            <h4 className="font-semibold text-sm mb-1 text-foreground">Last Updated</h4>
            <p className="text-xs text-muted-foreground">
              {new Date(pkg.updatedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package2,
  Github,
  ExternalLink,
  Heart,
  Terminal,
  Zap,
  Globe,
  Mail,
  Twitter,
  Coffee,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    product: [
      { label: "Browse Packages", href: "/", icon: Package2 },
      { label: "Popular Tools", href: "/?view=popular", icon: Zap },
      { label: "Categories", href: "/#categories", icon: Terminal },
    ],
    resources: [
      {
        label: "WebInstall.dev",
        href: "https://webinstall.dev",
        icon: ExternalLink,
        external: true,
      },
      {
        label: "GitHub Repository",
        href: "https://github.com/webinstall/webi-installers",
        icon: Github,
        external: true,
      },
      {
        label: "Documentation",
        href: "https://webinstall.dev/api",
        icon: Globe,
        external: true,
      },
    ],
    community: [
      {
        label: "Report Issues",
        href: "https://github.com/webinstall/webi-installers/issues",
        icon: Github,
        external: true,
      },
      {
        label: "Feature Requests",
        href: "https://github.com/webinstall/webi-installers/discussions",
        icon: Mail,
        external: true,
      },
      {
        label: "Follow Updates",
        href: "https://twitter.com/webinstalldev",
        icon: Twitter,
        external: true,
      },
    ],
  };

  return (
    <footer className="relative mt-16 border-t bg-gradient-to-t from-muted/30 to-background">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative">
                  <Package2 className="h-6 w-6 text-primary" />
                  <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  WebInstall UI
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                A modern, elegant interface for discovering and installing
                developer tools. Making package management simple and beautiful.
              </p>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-xs bg-green-500/10 text-green-700 border-green-500/20"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                  170+ Packages
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs bg-blue-500/10 text-blue-700 border-blue-500/20"
                >
                  Cross-Platform
                </Badge>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Product</h3>
              <ul className="space-y-3">
                {links.product.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                    >
                      <link.icon className="h-4 w-4 group-hover:text-primary transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Resources</h3>
              <ul className="space-y-3">
                {links.resources.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                      >
                        <link.icon className="h-4 w-4 group-hover:text-primary transition-colors" />
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                      >
                        <link.icon className="h-4 w-4 group-hover:text-primary transition-colors" />
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Community Links */}
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Community</h3>
              <ul className="space-y-3">
                {links.community.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                    >
                      <link.icon className="h-4 w-4 group-hover:text-primary transition-colors" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>© {currentYear} WebInstall UI</span>
              <span className="hidden md:inline">•</span>
              <div className="flex items-center gap-1">
                Built with{" "}
                <Heart
                  className="h-4 w-4 text-red-500 animate-pulse"
                  fill="currentColor"
                />{" "}
                for developers by{" "}
                <a
                  href="https://github.com/LinuxCTRL/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  @LinuxCTRL
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Powered by</span>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-8 px-2 hover:bg-primary/10"
              >
                <a
                  href="https://webinstall.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span className="font-medium">webinstall.dev</span>
                </a>
              </Button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-border/40">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>One-command installs for 170+ developer tools</span>
                <span className="hidden sm:inline">•</span>
                <span>Cross-platform support (Linux, macOS, Windows)</span>
              </div>
              <div className="flex items-center gap-1">
                <Coffee className="h-3 w-3" />
                <span>Made with caffeine and code</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

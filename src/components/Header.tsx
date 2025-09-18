"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";
import { Package2, Github, ExternalLink, Menu, X, Star } from "lucide-react";
import { githubApi } from "@/lib/github-api";

interface HeaderProps {
  packageCount?: number;
}

export function Header({ packageCount }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [starCount, setStarCount] = useState<number>();

  useEffect(() => {
    const fetchStarCount = async () => {
      try {
        const repoInfo = await githubApi.getRepositoryInfo();
        setStarCount(Number(repoInfo.stargazers_count));
      } catch (error) {
        console.error("Failed to fetch star count:", error);
      }
    };

    fetchStarCount();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between max-w-7xl">
        {/* Logo Section */}
        <div className="flex items-center gap-3 md:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="relative">
              <Package2 className="h-6 w-6 text-primary" />
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              WebInstall
            </span>
            <Badge
              variant="secondary"
              className="text-xs bg-primary/10 text-primary border-primary/20"
            >
              UI
            </Badge>
          </Link>

          {packageCount && (
            <Badge
              variant="outline"
              className="text-xs hidden xs:inline-flex bg-muted/50 hover:bg-muted transition-colors"
            >
              {packageCount} packages
            </Badge>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hover:bg-primary/10"
          >
            <a
              href="https://webinstall.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Original Site
            </a>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hover:bg-primary/10"
          >
            <a
              href="https://github.com/webinstall/webi-installers"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github className="h-4 w-4" />
              GitHub
              {starCount !== undefined && (
                <div className="flex items-center gap-1 text-xs bg-muted/80 px-1.5 py-0.5 rounded-full">
                  <Star className="h-3 w-3" />
                  {starCount}
                </div>
              )}
            </a>
          </Button>

          <div className="ml-2">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 mt-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center gap-2">
                    <Package2 className="h-5 w-5 text-primary" />
                    <span className="font-semibold">WebInstall UI</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {packageCount && (
                  <div className="flex items-center justify-center">
                    <Badge variant="outline" className="text-xs">
                      {packageCount} packages available
                    </Badge>
                  </div>
                )}

                <nav className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    asChild
                    className="justify-start h-12"
                    onClick={() => setIsOpen(false)}
                  >
                    <a
                      href="https://webinstall.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Visit Original Site
                    </a>
                  </Button>

                  <Button
                    variant="ghost"
                    asChild
                    className="justify-start h-12"
                    onClick={() => setIsOpen(false)}
                  >
                    <a
                      href="https://github.com/webinstall/webi-installers"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3"
                    >
                      <Github className="h-4 w-4" />
                      View on GitHub
                      {starCount !== undefined && (
                        <div className="flex items-center gap-1 text-xs bg-muted/80 px-1.5 py-0.5 rounded-full">
                          <Star className="h-3 w-3" />
                          {starCount}
                        </div>
                      )}
                    </a>
                  </Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

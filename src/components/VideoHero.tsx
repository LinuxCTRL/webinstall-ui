"use client";

import { useState } from "react";
import { Play, ExternalLink, Package, Zap, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: string;
}

function FeatureCard({ icon, title, description, link }: FeatureCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer group">
      {link ? (
        <Link href={link}>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              {icon}
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-center leading-relaxed">
              {description}
            </CardDescription>
            <div className="flex justify-center mt-4">
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </CardContent>
        </Link>
      ) : (
        <div>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              {icon}
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-center leading-relaxed">
              {description}
            </CardDescription>
          </CardContent>
        </div>
      )}
    </Card>
  );
}

export function VideoHero() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Visible scratch grid pattern */}
      <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.12] pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 200 200"
          preserveAspectRatio="none"
        >
          <title>Scratch grid background pattern</title>
          <defs>
            <pattern
              id="scratchGrid"
              width="200"
              height="200"
              patternUnits="userSpaceOnUse"
            >
              {/* Main grid lines with scratch effect */}
              <path
                d="M0,20 Q50,18 100,22 T200,20"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                opacity="0.6"
              />
              <path
                d="M0,40 Q30,38 60,42 T200,40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.6"
                opacity="0.4"
              />
              <path
                d="M0,60 Q70,58 140,62 T200,60"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                opacity="0.5"
              />
              <path
                d="M0,80 Q90,78 180,82 T200,80"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.7"
                opacity="0.6"
              />
              <path
                d="M0,100 Q40,98 80,102 T200,100"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.9"
                opacity="0.7"
              />
              <path
                d="M0,120 Q110,118 220,122 T200,120"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.6"
                opacity="0.5"
              />
              <path
                d="M0,140 Q25,138 50,142 T200,140"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                opacity="0.6"
              />
              <path
                d="M0,160 Q80,158 160,162 T200,160"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.7"
                opacity="0.4"
              />
              <path
                d="M0,180 Q60,178 120,182 T200,180"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                opacity="0.5"
              />

              {/* Vertical scratch lines */}
              <path
                d="M20,0 Q18,50 22,100 T20,200"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.7"
                opacity="0.5"
              />
              <path
                d="M40,0 Q38,30 42,60 T40,200"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.6"
                opacity="0.4"
              />
              <path
                d="M60,0 Q58,70 62,140 T60,200"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                opacity="0.6"
              />
              <path
                d="M80,0 Q78,90 82,180 T80,200"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.7"
                opacity="0.5"
              />
              <path
                d="M100,0 Q98,40 102,80 T100,200"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.9"
                opacity="0.7"
              />
              <path
                d="M120,0 Q118,110 122,220 T120,200"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.6"
                opacity="0.4"
              />
              <path
                d="M140,0 Q138,25 142,50 T140,200"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                opacity="0.6"
              />
              <path
                d="M160,0 Q158,80 162,160 T160,200"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.7"
                opacity="0.5"
              />
              <path
                d="M180,0 Q178,60 182,120 T180,200"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                opacity="0.6"
              />

              {/* Cross-hatch scratches for texture */}
              <path
                d="M10,10 Q15,15 20,10 T30,15"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.4"
                opacity="0.3"
              />
              <path
                d="M50,30 Q55,35 60,30 T70,35"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.4"
              />
              <path
                d="M90,50 Q95,55 100,50 T110,55"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.4"
                opacity="0.3"
              />
              <path
                d="M130,70 Q135,75 140,70 T150,75"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.4"
              />
              <path
                d="M170,90 Q175,95 180,90 T190,95"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.4"
                opacity="0.3"
              />

              {/* Small scratches and imperfections */}
              <path
                d="M25,45 L27,43"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.4"
              />
              <path
                d="M65,85 L67,83"
                stroke="currentColor"
                strokeWidth="0.6"
                opacity="0.5"
              />
              <path
                d="M105,125 L103,127"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.4"
              />
              <path
                d="M145,165 L147,163"
                stroke="currentColor"
                strokeWidth="0.6"
                opacity="0.5"
              />
              <path
                d="M185,185 L183,187"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.4"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#scratchGrid)" />
        </svg>
      </div>

      <div className="relative z-10">
        <main className="container mx-auto px-4 py-16 space-y-16 max-w-6xl">
          {/* Hero section */}
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                <span className="block">Modern Package</span>
                <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Discovery
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Discover and install development tools with a single command. A
                modern interface for the webinstall.dev ecosystem with 170+
                packages.
              </p>
            </div>

            {/* Call to action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="px-8 py-3 text-lg">
                <Link href="/packages">
                  <Package className="h-5 w-5 mr-2" />
                  Browse Packages
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowVideo(true)}
                className="px-8 py-3 text-lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Video section */}
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted shadow-2xl">
              {showVideo ? (
                <iframe
                  src="https://www.youtube.com/embed/uu-9Cq5Dssc?autoplay=1"
                  title="WebInstall Demo"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/80 cursor-pointer group focus:outline-none"
                  onClick={() => setShowVideo(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setShowVideo(true);
                    }
                  }}
                  aria-label="Watch the Demo"
                >
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                      <Play className="h-8 w-8 text-primary ml-1" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Watch the Demo</h3>
                      <p className="text-muted-foreground">
                        See how WebInstall works
                      </p>
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-primary" />}
              title="Lightning Fast"
              description="Install development tools with a single command. No complex setup, no dependency management, just simple curl commands that work."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6 text-primary" />}
              title="Secure & Reliable"
              description="All packages are fetched directly from official sources. No custom builds, no dependencies, just the official releases you trust."
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6 text-primary" />}
              title="Cross Platform"
              description="Works on Linux, macOS, and Windows. Install the same tools across all your development environments effortlessly."
            />
          </div>

          {/* Why section */}
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">
                Why WebInstall?
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                WebInstall solves the pain of setting up development
                environments. No more hunting for installation instructions,
                managing package managers, or dealing with system conflicts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Traditional Way</h3>
                <div className="text-left space-y-2 text-muted-foreground">
                  <p>• Search for installation docs</p>
                  <p>• Download installers manually</p>
                  <p>• Manage multiple package managers</p>
                  <p>• Deal with permission issues</p>
                  <p>• Handle system conflicts</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-primary">
                  WebInstall Way
                </h3>
                <div className="text-left space-y-2 text-muted-foreground">
                  <p>• One simple command</p>
                  <p>• Works without root/admin</p>
                  <p>• No system modifications</p>
                  <p>• Version isolation</p>
                  <p>• Cross-platform consistency</p>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Button asChild size="lg" className="px-8 py-3">
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

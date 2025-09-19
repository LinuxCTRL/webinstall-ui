import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About - WebInstall UI",
  description: "Learn about the team behind WebInstall and why we built this modern interface for development tool discovery.",
  openGraph: {
    title: "About - WebInstall UI",
    description: "Learn about the team behind WebInstall",
    type: "website",
    url: "/about",
  },
  alternates: {
    canonical: "/about",
  },
};

interface TeamMemberProps {
  name: string;
  title: string;
  username: string;
  website: string;
  description: string;
  quote: string;
  quoteBy: string;
}

function TeamMember({ name, title, username, website, description, quote, quoteBy }: TeamMemberProps) {
  return (
    <Card className="h-full">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={`https://github.com/${username}.png`} alt={name} />
            <AvatarFallback className="text-2xl">
              {name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription className="text-lg">{title}</CardDescription>
        <div className="flex justify-center gap-2 pt-2">
          <Button variant="outline" size="sm" asChild>
            <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={`https://twitter.com/${username}`} target="_blank" rel="noopener noreferrer">
              <Twitter className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={website} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
          "{quote}"
          <footer className="text-sm mt-1">— {quoteBy}</footer>
        </blockquote>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl font-bold tracking-tight">
            About WebInstall
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Who are we and why are we doing this?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <TeamMember
            name="AJ ONeal"
            title="Technophobic Technologist Extraordinaíre"
            username="coolaj86"
            website="https://coolaj86.com/"
            quote="AJ's superpower is to not be stupid, most of the time at least, which is more than I can say for myself."
            quoteBy="Ryan Burnette"
            description="I consult, primarily with small companies on Security, Auth, On-Prem, and IoT related projects. I've also worked on projects for Intel and Sonos and landed code in consumer products including Slack, the Apple TV SDK, and Mozilla IoT. I'm building webi to make it easier for my clients to deploy their products and to make life easier for students of my upcoming Beyond Code Bootcamp course."
          />

          <TeamMember
            name="Ryan Burnette"
            title="Web Developer"
            username="ryanburnette"
            website="https://ryanburnette.com/"
            quote="Ryan's superpower is the ability to de-complicate a problem until only the part that must be done remains."
            quoteBy="AJ ONeal"
            description="As a web developer, I prefer the tried-and-true approach to the cool-and-new any day of the week. I'm working on webi because I find tools like pathman and serviceman incredibly valuable. I want the easiest possible way to install them as I set up new client machines, as well as to share them with others."
          />
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed text-center text-lg">
                We believe that setting up development environments should be simple, secure, and frustration-free. 
                WebInstall removes the complexity from installing development tools while maintaining security and reliability.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Simple</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  One command to install any tool. No documentation required, no complex setup processes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Secure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Direct downloads from official sources, no custom builds, and no system modifications.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Universal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Works across Linux, macOS, and Windows without requiring admin privileges.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Open Source</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                WebInstall is completely open source. You can find the source code, contribute, or report issues on GitHub.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild>
                  <a href="https://github.com/webinstall/webi-installers" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    WebInstall Source
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://webinstall.dev" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Original Site
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
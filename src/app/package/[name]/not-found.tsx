import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/Header"
import { ArrowLeft, Package2, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] animate-pulse" style={{ animationDuration: '8s' }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="scratches" patternUnits="userSpaceOnUse" width="400" height="400">
              <path d="M0,50 Q100,30 200,60 T400,40" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3"/>
              <path d="M50,0 Q70,100 90,200 T130,400" stroke="currentColor" strokeWidth="0.3" fill="none" opacity="0.2"/>
              <path d="M150,20 Q250,40 350,10 T450,30" stroke="currentColor" strokeWidth="0.4" fill="none" opacity="0.25"/>
              <path d="M20,150 Q40,250 80,350 T140,450" stroke="currentColor" strokeWidth="0.2" fill="none" opacity="0.15"/>
              <path d="M300,5 Q320,105 340,205 T380,405" stroke="currentColor" strokeWidth="0.3" fill="none" opacity="0.2"/>
              <path d="M10,300 Q110,320 210,340 T410,380" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#scratches)" />
        </svg>
      </div>
      
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent_70%)] mix-blend-multiply dark:mix-blend-screen"></div>
      </div>
      
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-16 max-w-2xl">
          <div className="text-center space-y-8">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <Package2 className="h-24 w-24 text-muted-foreground/50" />
                <div className="absolute -top-2 -right-2 bg-destructive rounded-full p-1">
                  <Search className="h-4 w-4 text-destructive-foreground" />
                </div>
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">Package Not Found</h1>
              <p className="text-xl text-muted-foreground">
                The package you're looking for doesn't exist or may have been removed.
              </p>
            </div>

            {/* Suggestions Card */}
            <Card className="text-left shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle>What you can do:</CardTitle>
                <CardDescription>
                  Here are some suggestions to find what you're looking for
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Check the package name</p>
                      <p className="text-sm text-muted-foreground">
                        Make sure the package name is spelled correctly and uses the exact case
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Browse all packages</p>
                      <p className="text-sm text-muted-foreground">
                        Return to the main page to see all available packages
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Use the search feature</p>
                      <p className="text-sm text-muted-foreground">
                        Try searching for similar tools or browse by category
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                <Link href="/">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Packages
                </Link>
              </Button>
              
              <Button variant="outline" asChild size="lg" className="shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
                <Link href="/?search=true">
                  <Search className="h-5 w-5 mr-2" />
                  Search Packages
                </Link>
              </Button>
            </div>

            {/* Help Text */}
            <div className="text-sm text-muted-foreground">
              <p>
                If you believe this package should exist, please check the{" "}
                <a 
                  href="https://github.com/webinstall/webi-installers" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  webi-installers repository
                </a>{" "}
                for the latest available packages.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
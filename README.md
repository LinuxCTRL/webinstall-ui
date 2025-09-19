## Project Overview
I want to build a modern Next.js web application that serves as an improved UI/frontend for the webi-installers project (https://github.com/webinstall/webi-installers). The current website has poor UX, and I want to create a better interface for developers to discover and install development tools.

## Project Requirements

### Core Functionality
1. **Package Discovery**: Display all available packages from the webi-installers repository
2. **Search & Filter**: Allow users to search packages by name, description, and filter by category/platform
3. **Installation Commands**: Show copy-pasteable installation commands for each package
4. **Package Details**: Display comprehensive information about each tool
5. **Modern UI**: Create a responsive, modern interface with excellent UX

### Technical Stack
- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS
- **TypeScript**: Full TypeScript implementation
- **Data Source**: GitHub API to fetch data from webi-installers repo
- **State Management**: React hooks (useState, useReducer)
- **Icons**: Lucide React icons

## Data Structure & Logic

### Repository Structure Understanding
Each package in webi-installers follows this pattern:
```
package-name/
├── README.md          # Contains frontmatter with metadata
├── releases.js        # Release fetching logic
├── install.sh         # Unix installation script
└── install.ps1        # Windows PowerShell script
```

### Key Data Models
```typescript
interface Package {
  name: string;
  title: string;
  tagline: string;
  description: string;
  homepage: string;
  category: string;
  platforms: {
    linux: boolean;
    macos: boolean;
    windows: boolean;
  };
  installCommand: {
    curl: string;
    wget: string;
    powershell: string;
  };
  version?: string;
  updatedAt: string;
}
```

### Data Fetching Strategy
1. Use GitHub API to fetch repository contents
2. Parse README.md frontmatter for package metadata
3. Generate installation commands programmatically
4. Categorize packages intelligently (since no explicit categories exist)
5. Implement caching and ISR for performance

## Features to Implement

### Phase 1: Core Features
- [x] Package listing with grid/list view
- [x] Search functionality (fuzzy search)
- [x] Category filtering
- [x] Platform filtering (Linux, macOS, Windows)
- [x] Installation command copy-to-clipboard
- [x] Responsive design

### Phase 2: Enhanced Features
- [x] Package detail pages
- [x] Popular/trending packages
- [x] Recently updated packages
- [x] Dark/light theme toggle
- [x] Installation command customization
- [x] Package comparison

### Phase 3: Advanced Features
- [ ] In home page instead of listing all packages we have to show this youtube veideo `https://youtu.be/uu-9Cq5Dssc` with some cards explaining why we did this and how its working
- [ ] Move the packages to `/packages` route
- [ ] Read `/faq.md` and create a seperate route for it
- [ ] Add cookie banner
- [ ] Create an about page based on `/about.md`
- [ ] Package ratings/reviews (if data available)
- [ ] Installation success tracking
- [ ] Package dependencies visualization
- [ ] Bookmark/favorites system
- [ ] API for third-party integrations

## UI/UX Requirements

### Design Principles
- **Modern & Clean**: Contemporary design with good spacing and typography
- **Fast & Responsive**: Excellent performance on all devices
- **Developer-Focused**: UI optimized for developer workflow
- **Accessibility**: WCAG compliant with proper contrast and keyboard navigation

### Key Components Needed
1. **Header**: Navigation, search bar, theme toggle
2. **Package Card**: Compact display with key info and install button
3. **Search Bar**: Real-time search with suggestions
4. **Filter Sidebar**: Categories, platforms, other filters
5. **Package Detail**: Comprehensive package information
6. **Installation Modal**: Copy commands with platform selection
7. **Footer**: Links, credits, GitHub link

### Color Scheme & Theming
- Support both light and dark themes
- Use developer-friendly color palette
- Ensure excellent contrast ratios
- Consider terminal/CLI aesthetic elements

## Technical Implementation Guidelines

### File Structure
```
src/
├── app/
│   ├── page.tsx                 # Home page
│   ├── package/[name]/page.tsx  # Package detail pages
│   ├── api/packages/route.ts    # API routes
│   └── layout.tsx
├── components/
│   ├── ui/                      # Reusable UI components
│   ├── PackageCard.tsx
│   ├── SearchBar.tsx
│   ├── FilterSidebar.tsx
│   └── InstallationModal.tsx
├── lib/
│   ├── github-api.ts           # GitHub API integration
│   ├── package-parser.ts       # Parse package data
│   └── utils.ts
└── types/
    └── index.ts                # TypeScript definitions
```

### Data Fetching Approach
1. **Build Time**: Fetch all package data during build using ISR
2. **Runtime**: Use SWR or TanStack Query for client-side data fetching
3. **Caching**: Implement proper caching strategy for GitHub API calls
4. **Error Handling**: Robust error handling for API failures

### Performance Optimizations
- Use Next.js Image optimization
- Implement virtual scrolling for large package lists
- Lazy load package details
- Optimize bundle size with dynamic imports
- Implement proper loading states

## Development Tasks

### Setup Tasks
1. Initialize Next.js project with TypeScript and Tailwind
2. Set up GitHub API integration
3. Create basic project structure
4. Implement data fetching and parsing logic

### Core Development Tasks
1. Build package data parsing system
2. Create responsive package listing
3. Implement search and filtering
4. Build installation command system
5. Create package detail pages
6. Add theme switching functionality

### Testing & Polish
1. Add error boundaries and loading states
2. Implement accessibility features
3. Add animations and micro-interactions
4. Optimize performance
5. Test on multiple devices and browsers

## Success Criteria
- [x] All packages from webi-installers are displayed
- [x] Search finds packages quickly and accurately
- [x] Installation commands work correctly
- [x] UI is responsive and accessible
- [x] Performance scores well on Lighthouse
- [x] Code is well-documented and maintainable

## Additional Context
- The original webi website is at https://webinstall.dev
- Focus on developer experience and usability
- Make it feel modern compared to the current basic interface
- Consider adding features that the original lacks
- Keep the core simplicity that makes webi useful

Please help me build this project step by step, starting with the project setup and data fetching logic. I want to create a professional, modern alternative to the current webi interface that developers will love to use.

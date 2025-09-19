import type { Package, PackageMetadata } from "@/types";
import { decodeBase64Content } from "./github-api";

/**
 * Parse frontmatter from README.md content
 */
export function parseFrontmatter(content: string): PackageMetadata {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return {};
  }

  const frontmatterContent = match[1];
  const metadata: PackageMetadata = {};

  // Parse YAML-like frontmatter
  const lines = frontmatterContent.split("\n");

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) continue;

    const colonIndex = trimmedLine.indexOf(":");
    if (colonIndex === -1) continue;

    const key = trimmedLine.substring(0, colonIndex).trim();
    const value = trimmedLine.substring(colonIndex + 1).trim();

    // Remove quotes if present
    const cleanValue = value.replace(/^["']|["']$/g, "");

    // Parse boolean values
    if (cleanValue.toLowerCase() === "true") {
      metadata[key] = true;
    } else if (cleanValue.toLowerCase() === "false") {
      metadata[key] = false;
    } else {
      metadata[key] = cleanValue;
    }
  }

  return metadata;
}

/**
 * Extract description from README content (after frontmatter)
 */
export function extractDescription(content: string): string {
  // Remove frontmatter
  const withoutFrontmatter = content.replace(
    /^---\s*\n([\s\S]*?)\n---\s*\n/,
    "",
  );

  // Get the first paragraph or line that's not a heading
  const lines = withoutFrontmatter.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && !trimmed.startsWith("```")) {
      return trimmed;
    }
  }

  return "";
}

/**
 * Generate installation commands for a package
 */
export function generateInstallCommands(packageName: string) {
  const baseUrl = "https://webinstall.dev";

  return {
    curl: `curl -sS https://webinstall.dev/${packageName} | bash`,
    wget: `wget -qO- https://webinstall.dev/${packageName} | bash`,
    powershell: `curl.exe -A "MS" https://webinstall.dev/${packageName} | powershell`,
  };
}

/**
 * Categorize package based on name and metadata
 */
export function categorizePackage(
  packageName: string,
  metadata: PackageMetadata,
): string {
  const name = packageName.toLowerCase();

  // Development tools
  if (["node", "npm", "yarn", "pnpm", "deno", "bun"].includes(name)) {
    return "JavaScript Runtime";
  }

  if (["python", "python3", "pip", "pip3", "poetry", "pipenv"].includes(name)) {
    return "Python";
  }

  if (["go", "golang", "gofmt", "goimports"].includes(name)) {
    return "Go";
  }

  if (["rust", "cargo", "rustc", "rustup"].includes(name)) {
    return "Rust";
  }

  if (["java", "javac", "maven", "gradle", "kotlin"].includes(name)) {
    return "Java/JVM";
  }

  // Development tools
  if (["git", "gh", "gitlab-cli", "hub"].includes(name)) {
    return "Version Control";
  }

  if (["docker", "docker-compose", "podman", "containerd"].includes(name)) {
    return "Containers";
  }

  if (["kubectl", "helm", "k9s", "kubectx", "kustomize"].includes(name)) {
    return "Kubernetes";
  }

  if (["terraform", "ansible", "vagrant", "packer"].includes(name)) {
    return "Infrastructure";
  }

  // Editors and IDEs
  if (
    ["vim", "nvim", "neovim", "emacs", "nano", "code", "cursor"].includes(name)
  ) {
    return "Editors";
  }

  // Build tools
  if (["make", "cmake", "ninja", "bazel", "meson"].includes(name)) {
    return "Build Tools";
  }

  // CLI utilities
  if (
    [
      "curl",
      "wget",
      "jq",
      "yq",
      "fzf",
      "rg",
      "fd",
      "bat",
      "exa",
      "lsd",
    ].includes(name)
  ) {
    return "CLI Utilities";
  }

  // Databases
  if (
    ["postgres", "postgresql", "mysql", "redis", "mongodb", "sqlite"].includes(
      name,
    )
  ) {
    return "Databases";
  }

  // Web servers
  if (["nginx", "apache", "caddy", "traefik"].includes(name)) {
    return "Web Servers";
  }

  // Security tools
  if (["gpg", "ssh", "openssl", "age", "sops"].includes(name)) {
    return "Security";
  }

  // Monitoring
  if (["prometheus", "grafana", "jaeger", "zipkin"].includes(name)) {
    return "Monitoring";
  }

  // Default category
  return "Other";
}

/**
 * Detect platform support from metadata and package files
 */
export function detectPlatforms(
  metadata: PackageMetadata,
  hasInstallSh: boolean,
  hasInstallPs1: boolean,
) {
  return {
    linux: metadata.linux !== false && hasInstallSh, // Default true if install.sh exists
    macos: metadata.macos !== false && hasInstallSh, // Default true if install.sh exists
    windows: metadata.windows === true || hasInstallPs1, // Only true if explicitly set or has .ps1
  };
}

/**
 * Parse a complete package from README content and metadata
 */
/**
 * Generate fallback description based on package name and category
 */
function generateFallbackDescription(packageName: string, category: string): string {
  const name = packageName.toLowerCase();
  
  // Popular packages with known descriptions
  const knownDescriptions: { [key: string]: string } = {
    node: "JavaScript runtime built on Chrome's V8 JavaScript engine",
    npm: "Package manager for Node.js packages and modules",
    yarn: "Fast, reliable, and secure dependency management for Node.js",
    git: "Distributed version control system for tracking changes in source code",
    docker: "Platform for developing, shipping, and running applications in containers",
    python: "High-level programming language for general-purpose programming",
    go: "Open source programming language that makes it easy to build simple, reliable, and efficient software",
    rust: "Systems programming language focused on safety, speed, and concurrency",
    vim: "Highly configurable text editor built to make creating and changing any kind of text very efficient",
    nvim: "Hyperextensible Vim-based text editor",
    code: "Free, open-source code editor developed by Microsoft",
    kubectl: "Command line tool for controlling Kubernetes clusters",
    terraform: "Infrastructure as code tool for building, changing, and versioning infrastructure",
    ansible: "Simple IT automation platform that makes your applications and systems easier to deploy",
    jq: "Lightweight and flexible command-line JSON processor",
    curl: "Command line tool and library for transferring data with URLs",
    wget: "Free software package for retrieving files using HTTP, HTTPS, FTP and FTPS",
    make: "Build automation tool that automatically builds executable programs and libraries from source code",
    cmake: "Cross-platform build system generator",
    nginx: "High-performance HTTP server and reverse proxy",
    postgres: "Advanced open source relational database system",
    redis: "In-memory data structure store used as a database, cache, and message broker",
    gh: "GitHub's official command line tool",
    helm: "Package manager for Kubernetes",
    k9s: "Terminal based UI to interact with your Kubernetes clusters",
    fzf: "General-purpose command-line fuzzy finder",
    bat: "Cat clone with syntax highlighting and Git integration",
    fd: "Simple, fast and user-friendly alternative to find",
    rg: "Recursively searches directories for a regex pattern while respecting your gitignore",
    exa: "Modern replacement for ls with Git integration and color coding",
  };

  if (knownDescriptions[name]) {
    return knownDescriptions[name];
  }

  // Generate description based on category
  switch (category) {
    case "JavaScript Runtime":
      return `JavaScript development tool for ${packageName}`;
    case "Python":
      return `Python development tool for ${packageName}`;
    case "Go":
      return `Go programming language tool for ${packageName}`;
    case "Rust":
      return `Rust programming language tool for ${packageName}`;
    case "Java/JVM":
      return `Java development tool for ${packageName}`;
    case "Version Control":
      return `Version control tool for ${packageName}`;
    case "Containers":
      return `Container management tool for ${packageName}`;
    case "Kubernetes":
      return `Kubernetes tool for ${packageName}`;
    case "Infrastructure":
      return `Infrastructure automation tool for ${packageName}`;
    case "Editors":
      return `Text editor and development tool for ${packageName}`;
    case "Build Tools":
      return `Build automation tool for ${packageName}`;
    case "CLI Utilities":
      return `Command line utility for ${packageName}`;
    case "Databases":
      return `Database system for ${packageName}`;
    case "Web Servers":
      return `Web server for ${packageName}`;
    case "Security":
      return `Security tool for ${packageName}`;
    case "Monitoring":
      return `Monitoring and observability tool for ${packageName}`;
    default:
      return `Development tool for ${packageName}`;
  }
}

export function parsePackage(
  packageName: string,
  readmeContent: string,
  hasInstallSh: boolean = false,
  hasInstallPs1: boolean = false,
  lastUpdated?: string,
): Package {
  const decodedContent =
    typeof readmeContent === "string" && readmeContent.includes("\n")
      ? readmeContent
      : decodeBase64Content(readmeContent);

  const metadata = parseFrontmatter(decodedContent);
  const extractedDescription = extractDescription(decodedContent);
  const category = categorizePackage(packageName, metadata);
  
  // Use extracted description, fallback to metadata, then generate one
  const finalDescription = extractedDescription || 
                          metadata.description || 
                          generateFallbackDescription(packageName, category);

  return {
    name: packageName,
    title: metadata.title || packageName,
    tagline: metadata.tagline || finalDescription,
    description: finalDescription,
    homepage:
      metadata.homepage ||
      `https://github.com/webinstall/webi-installers/tree/master/${packageName}`,
    category,
    platforms: detectPlatforms(metadata, hasInstallSh, hasInstallPs1),
    installCommand: generateInstallCommands(packageName),
    version: metadata.version,
    updatedAt: lastUpdated || new Date().toISOString(),
  };
}

/**
 * Validate that a package has minimum required data
 */
export function isValidPackage(pkg: Package): boolean {
  // Filter out example/test packages
  const excludedPackages = ['_npm', 'Foo Bar', 'vim-example'];
  
  if (excludedPackages.includes(pkg.name) || excludedPackages.includes(pkg.title)) {
    return false;
  }
  
  return !!(
    pkg.name &&
    pkg.title &&
    (pkg.platforms.linux || pkg.platforms.macos || pkg.platforms.windows)
  );
}

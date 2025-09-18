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
  const description = extractDescription(decodedContent);

  return {
    name: packageName,
    title: metadata.title || packageName,
    tagline: metadata.tagline || "",
    description: description || metadata.description || "",
    homepage:
      metadata.homepage ||
      `https://github.com/webinstall/webi-installers/tree/master/${packageName}`,
    category: categorizePackage(packageName, metadata),
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

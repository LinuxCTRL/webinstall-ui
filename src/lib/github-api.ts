import type {
  GitHubTreeResponse,
  GitHubFileContent,
  GitHubTreeItem,
} from "@/types";

const GITHUB_API_BASE = "https://api.github.com";
const WEBI_REPO_OWNER = "webinstall";
const WEBI_REPO_NAME = "webi-installers";

// GitHub API client with rate limiting considerations
class GitHubApiClient {
  private baseUrl = GITHUB_API_BASE;
  private headers: HeadersInit;

  constructor() {
    this.headers = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "webi-installers-ui",
    };

    // Add GitHub token if available (for higher rate limits)
    if (process.env.GITHUB_TOKEN) {
      this.headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: this.headers,
        next: {
          // Cache for 5 minutes in production, always fresh in development
          revalidate: process.env.NODE_ENV === "development" ? 0 : 300,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          const rateLimitReset = response.headers.get("x-ratelimit-reset");
          throw new Error(
            `GitHub API rate limit exceeded. Reset at: ${rateLimitReset}`,
          );
        }
        throw new Error(
          `GitHub API error: ${response.status} ${response.statusText}`,
        );
      }

      return response.json();
    } catch (error) {
      console.error(`Failed to fetch ${url}:`, error);
      throw error;
    }
  }

  /**
   * Get the repository tree to find all package directories
   */
  async getRepositoryTree(): Promise<GitHubTreeResponse> {
    return this.makeRequest<GitHubTreeResponse>(
      `/repos/${WEBI_REPO_OWNER}/${WEBI_REPO_NAME}/git/trees/main?recursive=1`,
    );
  }

  /**
   * Get the content of a specific file
   */
  async getFileContent(path: string): Promise<GitHubFileContent> {
    return this.makeRequest<GitHubFileContent>(
      `/repos/${WEBI_REPO_OWNER}/${WEBI_REPO_NAME}/contents/${path}`,
    );
  }

  /**
   * Get multiple file contents in parallel
   */
  async getMultipleFileContents(paths: string[]): Promise<GitHubFileContent[]> {
    const promises = paths.map((path) => this.getFileContent(path));
    return Promise.all(promises);
  }

  /**
   * Get repository information
   */
  async getRepositoryInfo() {
    return this.makeRequest(`/repos/${WEBI_REPO_OWNER}/${WEBI_REPO_NAME}`);
  }
}

/**
 * Extract package directories from the repository tree
 */
export function extractPackageDirectories(tree: GitHubTreeResponse): string[] {
  const packageDirs = new Set<string>();

  for (const item of tree.tree) {
    if (item.type === "tree" && item.path) {
      // Skip hidden directories and common non-package directories
      if (
        !item.path.startsWith(".") &&
        !["docs", "scripts", "tests", "_webi"].includes(item.path)
      ) {
        packageDirs.add(item.path);
      }
    }
  }

  return Array.from(packageDirs).sort();
}

/**
 * Find package files (README.md, releases.js, install scripts) for a package
 */
export function findPackageFiles(
  tree: GitHubTreeResponse,
  packageName: string,
): {
  readme?: string;
  releases?: string;
  installSh?: string;
  installPs1?: string;
} {
  const packageFiles = {
    readme: undefined as string | undefined,
    releases: undefined as string | undefined,
    installSh: undefined as string | undefined,
    installPs1: undefined as string | undefined,
  };

  for (const item of tree.tree) {
    if (item.type === "blob" && item.path.startsWith(`${packageName}/`)) {
      const fileName = item.path.split("/").pop()?.toLowerCase();

      switch (fileName) {
        case "readme.md":
          packageFiles.readme = item.path;
          break;
        case "releases.js":
          packageFiles.releases = item.path;
          break;
        case "install.sh":
          packageFiles.installSh = item.path;
          break;
        case "install.ps1":
          packageFiles.installPs1 = item.path;
          break;
      }
    }
  }

  return packageFiles;
}

// Export singleton instance
export const githubApi = new GitHubApiClient();

// Utility function to decode base64 content
export function decodeBase64Content(content: string): string {
  try {
    return atob(content.replace(/\n/g, ""));
  } catch (error) {
    console.error("Failed to decode base64 content:", error);
    return "";
  }
}

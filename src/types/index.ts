// Core package interface based on README requirements
export interface Package {
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

// GitHub API response types
export interface GitHubTreeItem {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
  url: string;
}

export interface GitHubTreeResponse {
  sha: string;
  url: string;
  tree: GitHubTreeItem[];
  truncated: boolean;
}

export interface GitHubFileContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: "file";
  content: string;
  encoding: "base64";
}

// Package metadata extracted from README frontmatter
export interface PackageMetadata {
  title?: string;
  homepage?: string;
  tagline?: string;
  description?: string;
  linux?: boolean;
  macos?: boolean;
  windows?: boolean;
  [key: string]: any;
}

// Search and filter types
export interface SearchFilters {
  query: string;
  category?: string;
  platforms: {
    linux: boolean;
    macos: boolean;
    windows: boolean;
  };
}

export interface PackageCategory {
  id: string;
  name: string;
  description: string;
  packages: string[];
}

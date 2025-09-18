#!/usr/bin/env node

// Simple test script to verify GitHub API integration
// This will test fetching a few packages from the webi-installers repo

const GITHUB_API_BASE = "https://api.github.com";
const WEBI_REPO_OWNER = "webinstall";
const WEBI_REPO_NAME = "webi-installers";

async function testGitHubIntegration() {
  console.log("🧪 Testing GitHub API integration for webi-installers...\n");

  try {
    // Test 1: Get repository info
    console.log("1️⃣ Testing repository access...");
    const repoResponse = await fetch(
      `${GITHUB_API_BASE}/repos/${WEBI_REPO_OWNER}/${WEBI_REPO_NAME}`,
    );

    if (!repoResponse.ok) {
      throw new Error(`Failed to access repository: ${repoResponse.status}`);
    }

    const repoInfo = await repoResponse.json();
    console.log(`✅ Repository found: ${repoInfo.full_name}`);
    console.log(`   Description: ${repoInfo.description}`);
    console.log(`   Stars: ${repoInfo.stargazers_count}`);
    console.log(`   Last updated: ${repoInfo.updated_at}\n`);

    // Test 2: Get repository tree
    console.log("2️⃣ Testing repository tree access...");
    const treeResponse = await fetch(
      `${GITHUB_API_BASE}/repos/${WEBI_REPO_OWNER}/${WEBI_REPO_NAME}/git/trees/main?recursive=1`,
    );

    if (!treeResponse.ok) {
      throw new Error(`Failed to get repository tree: ${treeResponse.status}`);
    }

    const tree = await treeResponse.json();
    console.log(`✅ Repository tree loaded with ${tree.tree.length} items`);

    // Extract package directories
    const packageDirs = new Set();
    for (const item of tree.tree) {
      if (
        item.type === "tree" &&
        item.path &&
        !item.path.startsWith(".") &&
        !["docs", "scripts", "tests", "_webi"].includes(item.path)
      ) {
        packageDirs.add(item.path);
      }
    }

    const packages = Array.from(packageDirs).sort();
    console.log(`   Found ${packages.length} potential packages`);
    console.log(`   First 10 packages: ${packages.slice(0, 10).join(", ")}\n`);

    // Test 3: Get a specific package README
    console.log("3️⃣ Testing package README access...");
    const testPackage = packages.find((pkg) => pkg === "node") || packages[0];
    console.log(`   Testing with package: ${testPackage}`);

    const readmeResponse = await fetch(
      `${GITHUB_API_BASE}/repos/${WEBI_REPO_OWNER}/${WEBI_REPO_NAME}/contents/${testPackage}/README.md`,
    );

    if (!readmeResponse.ok) {
      console.log(`⚠️  README not found for ${testPackage}, trying another...`);
      // Try another package
      for (const pkg of packages.slice(0, 5)) {
        const altResponse = await fetch(
          `${GITHUB_API_BASE}/repos/${WEBI_REPO_OWNER}/${WEBI_REPO_NAME}/contents/${pkg}/README.md`,
        );
        if (altResponse.ok) {
          const readmeData = await altResponse.json();
          console.log(`✅ README found for ${pkg}`);
          console.log(`   Size: ${readmeData.size} bytes`);

          // Decode and show first few lines
          const content = atob(readmeData.content.replace(/\n/g, ""));
          const firstLines = content.split("\n").slice(0, 3).join("\n");
          console.log(`   Preview:\n${firstLines}\n`);
          break;
        }
      }
    } else {
      const readmeData = await readmeResponse.json();
      console.log(`✅ README found for ${testPackage}`);
      console.log(`   Size: ${readmeData.size} bytes\n`);
    }

    // Test 4: Check rate limit
    console.log("4️⃣ Checking API rate limit...");
    const rateLimitResponse = await fetch(`${GITHUB_API_BASE}/rate_limit`);
    const rateLimitData = await rateLimitResponse.json();

    console.log(`✅ Rate limit status:`);
    console.log(
      `   Core limit: ${rateLimitData.resources.core.remaining}/${rateLimitData.resources.core.limit}`,
    );
    console.log(
      `   Resets at: ${new Date(rateLimitData.resources.core.reset * 1000).toLocaleString()}\n`,
    );

    console.log(
      "🎉 All tests passed! GitHub API integration is working correctly.",
    );

    return {
      success: true,
      packageCount: packages.length,
      rateLimit: rateLimitData.resources.core,
    };
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Run the test
testGitHubIntegration().then((result) => {
  if (result.success) {
    console.log(`\n📊 Summary: Found ${result.packageCount} packages`);
    console.log(
      `🔄 Rate limit: ${result.rateLimit.remaining}/${result.rateLimit.limit} remaining`,
    );
  }
  process.exit(result.success ? 0 : 1);
});

export const REPO_URL = "https://github.com/Open-Less/openless";
export const RELEASES_URL = `${REPO_URL}/releases`;
export const LATEST_RELEASE_URL = `${REPO_URL}/releases/latest`;
export const ISSUES_URL = `${REPO_URL}/issues`;

/** Release assets follow these names; <version> is filled in by the release workflow. */
export const PLATFORM_ASSETS = {
  macArm: "OpenLess_<version>_aarch64.dmg",
  macIntel: "OpenLess_<version>_x64.dmg",
  windows: "OpenLess_<version>_x64-setup.exe",
  linux: ".deb · .rpm + SHA256SUMS",
} as const;

/** Apps the product claims to work with; shown in the compatibility marquee. */
export const COMPATIBLE_APPS = [
  "ChatGPT",
  "Claude",
  "Cursor",
  "Gemini",
  "Notion",
  "Slack",
  "Lark",
  "WeChat",
  "Mail",
  "VS Code",
  "Figma",
  "Linear",
  "Obsidian",
  "Raycast",
] as const;

/** One accent colour per scenario, kept in sync with the demo cards. */
export const SCENARIO_ACCENTS = ["#10A37F", "#1E63FF", "#FF6A1A", "#0A0A0C"] as const;

export const FOOTER_LINKS = {
  // Internal pages first; only community channels stay on GitHub.
  product: ["/download/", "/docs/", "/#roadmap", "/docs/#faq"],
  resource: [REPO_URL, "/docs/#usage", "/docs/#architecture", "/docs/#privacy"],
  community: [ISSUES_URL, `${REPO_URL}/discussions`, "/download/", `${REPO_URL}/blob/main/LICENSE`],
} as const;

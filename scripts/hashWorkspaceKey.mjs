import crypto from "node:crypto";

const key = process.argv[2];
if (!key) {
  console.error("Usage: node scripts/hashWorkspaceKey.mjs <workspace-key>");
  process.exit(1);
}

const hash = crypto.createHash("sha256").update(key).digest("hex");
console.log(hash);

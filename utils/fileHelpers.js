// backend/utils/fileHelpers.js
const fs = require("fs");
const path = require("path");

/**
 * Convert stored relative path (like "/uploads/works/abc.jpg")
 * to absolute path on the server (C:\Users\rajan\Desktop\client\backend\uploads\works\abc.jpg)
 */
function toAbsolute(relPath) {
  if (!relPath) return null;
  // If it's a full URL (Cloudinary), don't attempt to resolve it to a local path
  if (relPath.startsWith('http')) return null;
  const cleaned = relPath.replace(/^\//, "").replace(/\//g, path.sep);
  return path.join(process.cwd(), cleaned);
}

/**
 * Safely delete a single file from disk.
 * Returns true if deleted, false if missing or failed.
 */
function safeUnlink(relPath) {
  return new Promise((resolve) => {
    const abs = toAbsolute(relPath);
    if (!abs) return resolve(false);

    fs.unlink(abs, (err) => {
      if (err) return resolve(false); // ignore missing file or error
      resolve(true);
    });
  });
}

/**
 * Delete multiple files (array or comma-separated string).
 * Returns an array of booleans for each file deleted.
 */
async function unlinkMany(relPaths = []) {
  const results = [];
  if (!Array.isArray(relPaths)) {
    if (typeof relPaths === "string")
      relPaths = relPaths.split(",").map((s) => s.trim());
    else return results;
  }

  for (const p of relPaths) {
    if (!p) {
      results.push(false);
      continue;
    }
    const ok = await safeUnlink(p);
    results.push(ok);
  }
  return results;
}

module.exports = { toAbsolute, safeUnlink, unlinkMany };

// Build-time GitHub snapshot. The site fetches live data in the browser; this file is the
// fallback when the visitor is rate-limited or offline, so the feed is never empty.
import { writeFileSync } from "node:fs";
import { collect } from "../src/lib/github.js";

try {
  const data = await collect(fetch);
  writeFileSync(new URL("../public/github-snapshot.json", import.meta.url), JSON.stringify(data));
  console.log(`github snapshot: ${data.repos.length} repos, ${data.activity.length} activity items`);
} catch (e) {
  // Never fail the build because GitHub is unreachable; the previous snapshot stays in place.
  console.warn("github snapshot skipped:", e.message);
}

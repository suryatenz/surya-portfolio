// Shared by the browser (live feed) and scripts/snapshot-github.mjs (build fallback).
export const GH_USER = "suryatenz";
const API = "https://api.github.com";

// Practice/scaffold repos that aren't worth featuring in the feed.
const HIDE = new Set(["suryatenz", "snehith-portfolio-react", "21L31A0550", "Testing", "Project"]);

async function getJSON(f, path) {
  const res = await f(`${API}${path}`, { headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.json();
}

export async function collect(f = fetch) {
  const [user, repos, events] = await Promise.all([
    getJSON(f, `/users/${GH_USER}`),
    getJSON(f, `/users/${GH_USER}/repos?per_page=100&sort=pushed`),
    getJSON(f, `/users/${GH_USER}/events/public?per_page=60`).catch(() => []),
  ]);

  const visible = repos.filter((r) => !r.fork && !HIDE.has(r.name));

  // Recent commits from the most recently pushed repos. Push events no longer carry
  // commit messages, so read them from the commits endpoint directly.
  const recent = visible.slice(0, 4);
  const commitLists = await Promise.all(
    recent.map((r) =>
      getJSON(f, `/repos/${GH_USER}/${r.name}/commits?per_page=4`)
        .then((cs) =>
          cs.map((c) => ({
            kind: "commit",
            repo: r.name,
            message: (c.commit?.message || "").split("\n")[0],
            sha: c.sha.slice(0, 7),
            url: c.html_url,
            date: c.commit?.author?.date,
          }))
        )
        .catch(() => [])
    )
  );

  const other = events
    .filter((e) => ["CreateEvent", "WatchEvent", "PublicEvent", "ReleaseEvent"].includes(e.type))
    // A new branch is noise; a new repository or tag is news.
    .filter((e) => e.type !== "CreateEvent" || e.payload.ref_type !== "branch")
    .map((e) => ({
      kind: e.type.replace("Event", "").toLowerCase(),
      repo: e.repo.name.replace(`${GH_USER}/`, ""),
      message:
        e.type === "CreateEvent"
          ? `created ${e.payload.ref_type}${e.payload.ref ? " " + e.payload.ref : ""}`
          : e.type === "WatchEvent"
          ? "starred"
          : e.type === "PublicEvent"
          ? "made public"
          : `released ${e.payload.release?.tag_name || ""}`,
      url: `https://github.com/${e.repo.name}`,
      date: e.created_at,
    }));

  const activity = [...commitLists.flat(), ...other]
    .filter((a) => a.date && !HIDE.has(a.repo))
    .filter((a) => !/^(Merge branch|Initial commit$)/.test(a.message))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 14);

  const langs = {};
  for (const r of visible) if (r.language) langs[r.language] = (langs[r.language] || 0) + 1;

  return {
    fetchedAt: new Date().toISOString(),
    user: {
      name: user.name,
      avatar: user.avatar_url,
      publicRepos: user.public_repos,
      followers: user.followers,
      since: user.created_at,
    },
    repos: visible.map((r) => ({
      name: r.name,
      description: r.description,
      language: r.language,
      stars: r.stargazers_count,
      pushedAt: r.pushed_at,
      homepage: r.homepage || null,
      url: r.html_url,
    })),
    languages: Object.entries(langs).sort((a, b) => b[1] - a[1]),
    activity,
  };
}

const CACHE_KEY = "gh-feed-v1";
const TTL = 10 * 60 * 1000;

// Browser entry: session cache -> live API -> build snapshot.
export async function loadGithub() {
  try {
    const hit = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
    if (hit && Date.now() - hit.t < TTL) return { ...hit.data, source: "live" };
  } catch {}
  try {
    const data = await collect(fetch);
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data }));
    } catch {}
    return { ...data, source: "live" };
  } catch {
    const res = await fetch("/github-snapshot.json");
    if (!res.ok) throw new Error("no github data");
    return { ...(await res.json()), source: "snapshot" };
  }
}

export function timeAgo(iso) {
  const s = (Date.now() - new Date(iso)) / 1000;
  const units = [
    ["y", 31536000],
    ["mo", 2592000],
    ["d", 86400],
    ["h", 3600],
    ["m", 60],
  ];
  for (const [u, n] of units) if (s >= n) return `${Math.floor(s / n)}${u} ago`;
  return "just now";
}

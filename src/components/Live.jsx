import { m } from "motion/react";
import { timeAgo, GH_USER } from "../lib/github.js";
import { me, linkedinPosts } from "../data.js";
import { ease } from "../lib/motion.js";
import { RevealText, Rise } from "./Reveal.jsx";

const LANG = { JavaScript: "#f5c542", Python: "#2e4bff", HTML: "#ff8a5c", CSS: "#5fcfa4" };

function GitHubCard({ gh }) {
  if (gh === null)
    return (
      <div className="panel" aria-busy="true">
        <div className="skel" /><div className="skel" /><div className="skel" />
      </div>
    );
  if (gh === false)
    return (
      <div className="panel">
        <p>GitHub is unreachable right now.</p>
        <a className="link" href={me.github} target="_blank" rel="noreferrer">Open the profile <span aria-hidden="true">↗</span></a>
      </div>
    );

  const total = gh.languages.reduce((s, [, n]) => s + n, 0);
  return (
    <Rise className="panel gh">
      <div className="gh__head">
        <img src={gh.user.avatar} alt="" width="48" height="48" />
        <div>
          <p className="gh__name">@{GH_USER}</p>
          <p className="muted small">{gh.user.publicRepos} public repos · since {new Date(gh.user.since).getFullYear()}</p>
        </div>
        <span className="live-pill"><span className="pulse" aria-hidden="true" /> {gh.source === "live" ? "Live" : "Snapshot"} · {timeAgo(gh.fetchedAt)}</span>
      </div>

      <div className="langbar" role="img" aria-label={gh.languages.map(([l, n]) => `${l} ${Math.round((n / total) * 100)}%`).join(", ")}>
        {gh.languages.map(([l, n], i) => (
          <m.i
            key={l}
            style={{ flexGrow: n, background: LANG[l] || "#9aa0ad", originX: 0 }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: ease.out, delay: 0.2 + i * 0.1 }}
          />
        ))}
      </div>
      <ul className="langkey">
        {gh.languages.map(([l, n]) => (
          <li key={l}><i style={{ background: LANG[l] || "#9aa0ad" }} aria-hidden="true" />{l} {Math.round((n / total) * 100)}%</li>
        ))}
      </ul>

      <p className="eyebrow eyebrow--plain gh__sub">Latest commits</p>
      <m.ol
        className="feed"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ staggerChildren: 0.05 }}
      >
        {gh.activity.slice(0, 7).map((a, i) => (
          <m.li
            key={i}
            variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: ease.out } } }}
          >
            <a href={a.url} target="_blank" rel="noreferrer" className="feed__row">
              <span className="feed__repo">{a.repo}</span>
              <span className="feed__msg">{a.message}</span>
              <span className="feed__time">{timeAgo(a.date)}</span>
            </a>
          </m.li>
        ))}
      </m.ol>
    </Rise>
  );
}

function LinkedInCard() {
  return (
    <Rise className="panel li" delay={0.08}>
      <svg viewBox="0 0 24 24" width="36" height="36" aria-hidden="true">
        <rect width="24" height="24" rx="6" fill="#0a66c2" />
        <path fill="#fff" d="M7.1 9.5h2.3V18H7.1zM8.25 5.9a1.33 1.33 0 1 1 0 2.66 1.33 1.33 0 0 1 0-2.66M10.9 9.5h2.2v1.2h.03c.3-.58 1.06-1.2 2.18-1.2 2.33 0 2.76 1.53 2.76 3.53V18h-2.3v-4.4c0-1.05-.02-2.4-1.46-2.4-1.47 0-1.69 1.14-1.69 2.32V18h-2.3z" />
      </svg>
      {linkedinPosts.length > 0 ? (
        <div className="li__posts">
          {linkedinPosts.map((urn) => (
            <iframe key={urn} src={`https://www.linkedin.com/embed/feed/update/${urn}`} title="LinkedIn post" loading="lazy" />
          ))}
        </div>
      ) : (
        <p className="li__text">Project write-ups and what I'm learning at UH, posted on LinkedIn.</p>
      )}
      <m.a className="btn btn--li" href={me.linkedin} target="_blank" rel="noreferrer" whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
        Connect on LinkedIn <span aria-hidden="true">↗</span>
      </m.a>
    </Rise>
  );
}

export default function Live({ gh }) {
  return (
    <section className="section live" id="live">
      <div className="section__head">
        <Rise as="p" className="eyebrow">Live</Rise>
        <RevealText text="What I'm building right now." className="h2" />
        <Rise as="p" className="muted lede" delay={0.1}>Pulled from the GitHub API every time this page loads.</Rise>
      </div>
      <div className="live__grid">
        <GitHubCard gh={gh} />
        <LinkedInCard />
      </div>
    </section>
  );
}

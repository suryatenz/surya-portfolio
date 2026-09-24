import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { projects, me } from "../data.js";
import { timeAgo, GH_USER } from "../lib/github.js";
import { ease, lockScroll } from "../lib/motion.js";
import ProjectArt from "./ProjectArt.jsx";
import { RevealText, Rise } from "./Reveal.jsx";

function Card({ p, index, onOpen, repo }) {
  return (
    <m.article
      layoutId={`card-${p.id}`}
      data-card={p.id}
      className={`card card--${p.tone} ${p.size === "wide" ? "card--wide" : ""} ${repo && !p.shot ? "card--has-meta" : ""}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.8, ease: ease.out, delay: (index % 2) * 0.08 }}
      whileHover="hover"
      style={{ borderRadius: 28 }}
    >
      <m.div className="card__head" layoutId={`head-${p.id}`}>
        <p className="card__kicker">{p.kicker}</p>
        <h3 className="card__title">{p.title}</h3>
        <p className="card__tagline">{p.tagline}</p>
      </m.div>
      <m.div
        className="card__art"
        layoutId={`art-${p.id}`}
        variants={{ hover: { y: -8, scale: 1.02 } }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        <ProjectArt p={p} />
      </m.div>
      {repo && (
        <span className="card__meta">
          <span className="pulse" aria-hidden="true" /> pushed {timeAgo(repo.pushedAt)}
        </span>
      )}
      <m.span className="card__open" aria-hidden="true" variants={{ hover: { scale: 1.1, rotate: 90 } }}>+</m.span>
      <button className="card__hit" onClick={(e) => onOpen(p, e.currentTarget)} aria-label={`Open ${p.title} details`} />
    </m.article>
  );
}

function Sheet({ p, originId, index, dir, repo, onClose, onStep }) {
  const ref = useRef(null);

  // Handlers live in a ref so re-renders of the parent never re-run this effect
  // (which would unlock scroll and steal focus back to the close button).
  const handlers = useRef({ onClose, onStep });
  handlers.current = { onClose, onStep };

  useEffect(() => {
    lockScroll(true);
    const el = ref.current;
    el.querySelector(".sheet__close")?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") handlers.current.onClose();
      if (e.key === "ArrowRight") handlers.current.onStep(1);
      if (e.key === "ArrowLeft") handlers.current.onStep(-1);
      if (e.key !== "Tab") return;
      // Keep focus inside the dialog.
      const f = el.querySelectorAll("a[href], button");
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); lockScroll(false); };
  }, []);

  // New project: scroll the sheet back to the top.
  useEffect(() => { ref.current?.querySelector(".sheet__scroll")?.scrollTo({ top: 0 }); }, [p.id]);

  // Shared-layout ids only apply to the project the sheet grew out of; after stepping to
  // another project the shell stays put, its tint crossfades, and the content slides.
  const own = p.id === originId;
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <div className="sheet-layer">
      <m.div
        className="scrim"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
      />
      <m.div
        ref={ref}
        layoutId={`card-${originId}`}
        className={`sheet card--${p.tone}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`sheet-${p.id}`}
        style={{ borderRadius: 32 }}
      >
        <div className="sheet__scroll" data-lenis-prevent>
          <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <m.div
            key={p.id}
            custom={dir}
            variants={{
              enter: (d) => ({ opacity: 0, x: d * 60 }),
              center: { opacity: 1, x: 0 },
              leave: (d) => ({ opacity: 0, x: d * -60, transition: { duration: 0.2, ease: ease.in } }),
            }}
            initial="enter"
            animate="center"
            exit="leave"
            transition={{ duration: 0.45, ease: ease.out }}
          >
          <m.div className="card__head sheet__head" layoutId={own ? `head-${p.id}` : undefined}>
            <p className="card__kicker">{p.kicker}</p>
            <h3 className="card__title" id={`sheet-${p.id}`}>{p.title}</h3>
            <p className="card__tagline">{p.tagline}</p>
          </m.div>
          <m.div className="card__art sheet__art" layoutId={own ? `art-${p.id}` : undefined}>
            <ProjectArt p={p} />
          </m.div>
          <m.div
            className="sheet__body"
            initial={own ? { opacity: 0, y: 24 } : false}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.6, ease: ease.out } }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
          >
            <ul className="sheet__points">
              {p.points.map((pt) => <li key={pt}>{pt}</li>)}
            </ul>
            <ul className="tags" aria-label="Built with">
              {p.stack.map((s) => <li key={s}>{s}</li>)}
            </ul>
            <div className="sheet__links">
              {p.repo && (
                <a className="btn btn--primary" href={`https://github.com/${GH_USER}/${p.repo}`} target="_blank" rel="noreferrer">
                  View source <span aria-hidden="true">↗</span>
                </a>
              )}
              {p.live && (
                <a className="btn btn--ghost" href={p.live} target="_blank" rel="noreferrer">
                  Live site <span aria-hidden="true">↗</span>
                </a>
              )}
              {repo && <span className="card__meta card__meta--inline"><span className="pulse" aria-hidden="true" /> last push {timeAgo(repo.pushedAt)} · live from GitHub</span>}
            </div>
          </m.div>
          </m.div>
          </AnimatePresence>
          <nav className="sheet__nav" aria-label="Other projects">
            <button className="sheet__step" onClick={() => onStep(-1)}>
              <span aria-hidden="true">←</span> <span className="sheet__step-label">Previous</span> <b>{prev.title}</b>
            </button>
            <span className="sheet__count" aria-live="polite">{index + 1} / {projects.length}</span>
            <button className="sheet__step sheet__step--next" onClick={() => onStep(1)}>
              <span className="sheet__step-label">Next</span> <b>{next.title}</b> <span aria-hidden="true">→</span>
            </button>
          </nav>
        </div>
        <m.button
          className="sheet__close"
          onClick={onClose}
          aria-label="Close"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          whileTap={{ scale: 0.9 }}
        >
          ×
        </m.button>
      </m.div>
    </div>
  );
}

const HASH = "#project-";

export default function Work({ gh }) {
  // origin = card the sheet grew from (and returns to); current = project on show.
  const [open, setOpen] = useState(null);
  const [dir, setDir] = useState(1);
  const opener = useRef(null);
  const repoOf = (p) => (gh && p.repo ? gh.repos.find((r) => r.name === p.repo) : null);

  const setHash = (id) =>
    history.replaceState(null, "", id ? `${HASH}${id}` : location.pathname + location.search);

  const openCard = (p, el) => {
    opener.current = el;
    setOpen({ origin: p.id, current: p.id });
    setHash(p.id);
  };
  const close = () => { setOpen(null); setHash(null); };
  const step = (d) => {
    if (!open) return;
    const i = projects.findIndex((p) => p.id === open.current);
    const nextId = projects[(i + d + projects.length) % projects.length].id;
    setDir(d);
    setOpen({ ...open, current: nextId });
    setHash(nextId);
  };

  // Deep link: /#project-pitwall opens that project directly.
  useEffect(() => {
    const fromHash = () => {
      const id = location.hash.startsWith(HASH) ? location.hash.slice(HASH.length) : null;
      if (id && projects.some((p) => p.id === id)) {
        opener.current = document.querySelector(`[data-card="${id}"] .card__hit`);
        setOpen({ origin: id, current: id });
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const current = open && projects.find((p) => p.id === open.current);
  const currentIndex = open ? projects.findIndex((p) => p.id === open.current) : 0;

  return (
    <section className="section work" id="work">
      <div className="section__head">
        <Rise as="p" className="eyebrow">Selected work</Rise>
        <RevealText text="Things I've built and shipped." className="h2" />
      </div>

      <div className="bento">
        {projects.map((p, i) => (
          <Card key={p.id} p={p} index={i} onOpen={openCard} repo={repoOf(p)} />
        ))}
        <Rise className="card card--more">
          <p className="card__kicker">Everything else</p>
          <p className="card__title">{gh ? gh.user.publicRepos : "28"} public repos</p>
          <a className="link" href={me.github} target="_blank" rel="noreferrer">github.com/{GH_USER} <span aria-hidden="true">↗</span></a>
        </Rise>
      </div>

      <AnimatePresence onExitComplete={() => opener.current?.focus()}>
        {open && (
          <Sheet
            key="sheet"
            p={current}
            originId={open.origin}
            index={currentIndex}
            dir={dir}
            repo={repoOf(current)}
            onClose={close}
            onStep={step}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

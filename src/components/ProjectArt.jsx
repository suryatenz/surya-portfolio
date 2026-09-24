import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, animate, m, useInView } from "motion/react";
import { ease, reduced } from "../lib/motion.js";

// Clean, palette-matched diagrams for projects without a UI to screenshot.
// They loop only while visible.

function Funnel() {
  const ref = useRef(null);
  const on = useInView(ref, { margin: "-10% 0px" });
  const stages = [
    ["Fetched", "10,000+ a day", 100],
    ["Rule filters", "experience · visa · degree", 58],
    ["LLM ranked", "Claude API", 30],
    ["Drafted", "for human review", 14],
  ];
  return (
    <div className="art art--funnel" ref={ref} role="img" aria-label="Funnel: postings are fetched, filtered by rules, ranked by an LLM and drafted for review">
      {stages.map(([a, b, w], i) => (
        <div className="funnel__row" key={a}>
          <m.span
            className="funnel__bar"
            initial={{ scaleX: 0 }}
            animate={on ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.1, ease: ease.out, delay: 0.1 + i * 0.12 }}
            style={{ width: `${w}%` }}
          >
            <m.i
              animate={on ? { x: ["-100%", "220%"] } : {}}
              transition={{ duration: 2.4, repeat: Infinity, ease: "linear", delay: 1.2 + i * 0.3 }}
            />
          </m.span>
          <span className="funnel__label"><b>{a}</b> {b}</span>
        </div>
      ))}
    </div>
  );
}

function Mail() {
  const ref = useRef(null);
  const on = useInView(ref, { margin: "-10% 0px" });
  return (
    <div className="art art--mail" ref={ref} role="img" aria-label="Illustration: scheduled emails go out and a reply is matched">
      {[0, 1, 2].map((i) => (
        <m.div
          key={i}
          className="mail__card"
          style={{ zIndex: 3 - i }}
          initial={{ y: 0, opacity: 1 }}
          animate={on ? { y: [i * 14, i * 14, -120, i * 14], opacity: [1, 1, 0, 1], scale: [1 - i * 0.05, 1 - i * 0.05, 1, 1 - i * 0.05] } : {}}
          transition={{ duration: 3.6, repeat: Infinity, times: [0, 0.45, 0.7, 1], delay: i * 1.2, ease: "easeInOut" }}
        >
          <span className="mail__line mail__line--a" />
          <span className="mail__line mail__line--b" />
          <span className="mail__line mail__line--c" />
        </m.div>
      ))}
      <m.span
        className="mail__badge"
        animate={on ? { scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] } : {}}
        transition={{ duration: 3.6, repeat: Infinity, times: [0.55, 0.65, 0.9, 1], ease: "easeOut" }}
      >
        ✓ Reply matched
      </m.span>
    </div>
  );
}

function Seismic() {
  const ref = useRef(null);
  const clip = `sweep-${useId().replace(/:/g, "")}`;
  const on = useInView(ref, { margin: "-10% 0px" });
  const W = 400, H = 240;
  const dome = (x) => H * 0.95 - Math.exp(-(((x - W * 0.5) / (W * 0.2)) ** 4)) * H * 0.6;
  const layers = Array.from({ length: 11 }, (_, k) => {
    let d = "";
    for (let x = 0; x <= W; x += 8) {
      const y = 18 + k * 20 + Math.sin(x * 0.03 + k) * 4 - Math.max(0, H * 0.95 - dome(x)) * 0.3 * (k / 10);
      d += `${x === 0 ? "M" : "L"}${x},${Math.min(y, dome(x) - 2).toFixed(1)}`;
    }
    return d;
  });
  let domePath = `M0,${H}`;
  for (let x = 0; x <= W; x += 6) domePath += ` L${x},${dome(x).toFixed(1)}`;
  domePath += ` L${W},${H} Z`;

  return (
    <div className="art art--seismic" ref={ref} role="img" aria-label="Illustration: layered seismic reflectors with a segmented salt body">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <clipPath id={clip}>
            <m.rect
              x="0" y="0" height={H}
              initial={{ width: 0 }}
              animate={on ? { width: [0, W, W] } : { width: 0 }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.6, 1], ease: "easeInOut" }}
            />
          </clipPath>
        </defs>
        {layers.map((d, i) => (
          <path key={i} d={d} className="seis__layer" />
        ))}
        <path d={domePath} className="seis__salt" />
        <path d={domePath} className="seis__mask" clipPath={`url(#${clip})`} />
      </svg>
      <span className="art__note">Illustration</span>
    </div>
  );
}

// Job Alerts writing a new résumé: the posting's keywords light up, the résumé lines that
// match them move to the top, the PDF recompiles and the fit score climbs. The 78 → 92 is
// a real tailoring run; the lines are abstract placeholders, not real résumé text.
const LINES = [
  { id: "a", w: 88, kw: false },
  { id: "b", w: 72, kw: true },
  { id: "c", w: 80, kw: false },
  { id: "d", w: 64, kw: true },
  { id: "e", w: 76, kw: true },
];
const KEYWORDS = ["Python", "SQL", "ML pipelines"];

function Tailor() {
  const ref = useRef(null);
  const on = useInView(ref, { margin: "-10% 0px" });
  const [phase, setPhase] = useState(0); // 0 read · 1 match · 2 reorder · 3 compile + score
  const [score, setScore] = useState(78);

  useEffect(() => {
    if (reduced) { setPhase(3); return; }
    if (!on) return;
    const t = setInterval(() => setPhase((p) => (p + 1) % 4), 1500);
    return () => clearInterval(t);
  }, [on]);

  useEffect(() => {
    if (reduced) { setScore(92); return; }
    if (phase !== 3) { if (phase === 0) setScore(78); return; }
    const c = animate(78, 92, { duration: 1.1, ease: ease.out, onUpdate: (v) => setScore(Math.round(v)) });
    return () => c.stop();
  }, [phase]);

  const order = phase >= 2 ? [...LINES].sort((x, y) => Number(y.kw) - Number(x.kw)) : LINES;

  return (
    <div className="art art--tailor" ref={ref} role="img" aria-label="Animation: keywords from a job posting are matched, résumé lines reorder to fit the role, the PDF recompiles and the fit score rises from 78 to 92">
      <div className="tailor__posting">
        <span className="tailor__label">Job posting</span>
        <div className="tailor__kws">
          {KEYWORDS.map((k, i) => (
            <m.span
              key={k}
              className="tailor__kw"
              animate={phase >= 1 ? { backgroundColor: "#176548", color: "#ffffff" } : { backgroundColor: "#ffffff", color: "#15171f" }}
              transition={{ duration: 0.35, delay: phase === 1 ? i * 0.12 : 0 }}
            >
              {k}
            </m.span>
          ))}
        </div>
      </div>
      <div className="tailor__doc">
        <span className="tailor__label">Résumé.tex</span>
        {order.map((l) => (
          <m.span
            key={l.id}
            layout
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="tailor__line"
            style={{ width: `${l.w}%` }}
            animate={{ backgroundColor: phase >= 1 && l.kw ? "#7fdcb6" : "#e7ebe9" }}
          />
        ))}
        <AnimatePresence>
          {phase === 3 && (
            <m.span
              className="tailor__stamp"
              initial={{ scale: 1.6, opacity: 0, rotate: -12 }}
              animate={{ scale: 1, opacity: 1, rotate: -6 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
            >
              PDF compiled
            </m.span>
          )}
        </AnimatePresence>
      </div>
      <div className="tailor__score">
        <span className="tailor__label">Fit score</span>
        <span className="tailor__num">{score}</span>
        <span className="tailor__bar"><m.i animate={{ scaleX: score / 100 }} transition={{ duration: 0.3 }} /></span>
        <span className="tailor__note">example run</span>
      </div>
    </div>
  );
}

const ARTS = { funnel: Funnel, mail: Mail, seismic: Seismic, tailor: Tailor };

export default function ProjectArt({ p }) {
  if (p.shot)
    return (
      <div className="art art--shot">
        <img src={p.shot} alt={`${p.title} screenshot`} width="1440" height="900" loading="lazy" decoding="async" />
      </div>
    );
  const A = ARTS[p.art];
  return <A />;
}

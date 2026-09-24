import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { me } from "../data.js";
import { ease, reduced, scrollToId } from "../lib/motion.js";

const ORBS = [
  { tone: "cobalt", x: "8%", y: "8%", size: 46, depth: 34 },
  { tone: "apricot", x: "58%", y: "0%", size: 40, depth: -26 },
  { tone: "mint", x: "40%", y: "46%", size: 36, depth: 20 },
  { tone: "butter", x: "78%", y: "52%", size: 30, depth: -16 },
];

function Orbs() {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 40, damping: 18 });
  const sy = useSpring(py, { stiffness: 40, damping: 18 });

  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const move = (e) => {
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [px, py]);

  return (
    <div className="orbs" aria-hidden="true">
      {ORBS.map((o, i) => (
        <Orb key={o.tone} o={o} i={i} sx={sx} sy={sy} />
      ))}
      <div className="orbs__grain" />
    </div>
  );
}

function Orb({ o, i, sx, sy }) {
  const x = useTransform(sx, (v) => v * o.depth * 2);
  const y = useTransform(sy, (v) => v * o.depth * 2);
  return (
    <m.div className="orb-wrap" style={{ left: o.x, top: o.y, x, y }}>
      <m.div
        className={`orb orb--${o.tone}`}
        style={{ width: `${o.size}vw`, height: `${o.size}vw` }}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: ease.out, delay: 0.1 + i * 0.12 }}
      />
    </m.div>
  );
}

const line = {
  hidden: { y: "105%" },
  show: (i) => ({ y: 0, transition: { duration: 1.05, ease: ease.out, delay: 0.15 + i * 0.09 } }),
};

export default function Hero() {
  const ref = useRef(null);
  const [role, setRole] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const lift = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setRole((r) => (r + 1) % me.roles.length), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="hero" id="top" ref={ref}>
      <Orbs />
      <m.div className="hero__inner" style={{ scale, opacity, y: lift }}>
        <m.p
          className="chip chip--status"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: ease.out }}
        >
          <span className="pulse" aria-hidden="true" /> Open to internships &amp; full-time roles · US
        </m.p>

        <h1 className="hero__title">
          <span className="sr-only">Hi, I'm {me.name}. I build data systems that run themselves.</span>
          <m.span aria-hidden="true" initial="hidden" animate="show" className="hero__lines">
            {["Hi, I'm Surya.", "I build data systems", "that run themselves."].map((t, i) => (
              <span className="mask" key={t}>
                <m.span className={`mask__in ${i === 0 ? "hero__hello" : ""}`} variants={line} custom={i}>
                  {t}
                </m.span>
              </span>
            ))}
          </m.span>
        </h1>

        <m.div
          className="hero__foot"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: ease.out, delay: 0.55 }}
        >
          <p className="hero__role">
            <span className="sr-only">Roles: {me.roles.join(", ")}.</span>
            <span aria-hidden="true">Working as a</span>
            <span className="role-slot" aria-hidden="true">
              <AnimatePresence mode="popLayout" initial={false}>
                <m.span
                  key={role}
                  className="role-tag"
                  initial={{ y: "100%", opacity: 0, rotateX: -60 }}
                  animate={{ y: 0, opacity: 1, rotateX: 0 }}
                  exit={{ y: "-100%", opacity: 0, rotateX: 60, transition: { duration: 0.25, ease: ease.in } }}
                >
                  {me.roles[role]}
                </m.span>
              </AnimatePresence>
            </span>
            <span aria-hidden="true">· MS Data Science &amp; AI, University of Houston</span>
          </p>
          <div className="hero__ctas">
            <m.a
              href="#work"
              className="btn btn--primary"
              onClick={(e) => { e.preventDefault(); scrollToId("work"); }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              See my work <span aria-hidden="true" className="btn__arrow">↓</span>
            </m.a>
            <m.a href={me.resume} target="_blank" rel="noreferrer" className="btn btn--ghost" whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
              Résumé
            </m.a>
          </div>
        </m.div>
      </m.div>
    </section>
  );
}

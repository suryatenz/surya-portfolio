import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useMotionValue, useSpring } from "motion/react";
import { me } from "../data.js";
import { reduced } from "../lib/motion.js";
import { RevealText } from "./Reveal.jsx";

// Button that leans toward the pointer on a spring.
function Magnetic({ children, ...rest }) {
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 14 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 14 });
  const fine = typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
  const move = (e) => {
    if (reduced || !fine) return;
    const b = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - b.left - b.width / 2) * 0.3);
    y.set((e.clientY - b.top - b.height / 2) * 0.3);
  };
  return (
    <m.a style={{ x, y }} onPointerMove={move} onPointerLeave={() => { x.set(0); y.set(0); }} whileTap={{ scale: 0.95 }} {...rest}>
      {children}
    </m.a>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(me.email);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <footer className="contact" id="contact">
      <div className="contact__card">
        <p className="eyebrow eyebrow--light">Contact</p>
        <RevealText text="Let's build something useful." className="contact__title" />
        <p className="contact__lede">Internships, full-time roles, research, or a data problem that needs automating. My inbox is open.</p>
        <div className="contact__actions">
          <Magnetic className="btn btn--apricot btn--lg" href={`mailto:${me.email}`}>
            {me.email}
          </Magnetic>
          <m.button className="btn btn--glass btn--copy" onClick={copy} whileTap={{ scale: 0.95 }}>
            <AnimatePresence mode="popLayout" initial={false}>
              <m.span
                key={copied ? "y" : "n"}
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0, transition: { duration: 0.15 } }}
              >
                {copied ? "Copied ✓" : "Copy email"}
              </m.span>
            </AnimatePresence>
          </m.button>
          <span className="sr-only" role="status">{copied ? "Email address copied" : ""}</span>
        </div>
      </div>
      <div className="foot">
        <span>© 2026 {me.name}</span>
        <nav aria-label="Profiles">
          <a href={me.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={me.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={me.resume} target="_blank" rel="noreferrer">Résumé</a>
        </nav>
        <span>Based in the {me.location}</span>
      </div>
    </footer>
  );
}

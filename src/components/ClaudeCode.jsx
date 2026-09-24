import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useInView } from "motion/react";
import { claudeCode } from "../data.js";
import { ease, reduced } from "../lib/motion.js";
import { RevealText, Rise } from "./Reveal.jsx";

// A prompt window that types real tasks and prints their real outcomes, one after another.
function Session() {
  const ref = useRef(null);
  const on = useInView(ref, { margin: "-15% 0px" });
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState(reduced ? claudeCode.session[0][0] : "");
  const [done, setDone] = useState(reduced);

  useEffect(() => {
    if (!on || reduced) return;
    const [cmd] = claudeCode.session[i];
    let n = 0;
    setTyped("");
    setDone(false);
    const typer = setInterval(() => {
      n += 1;
      setTyped(cmd.slice(0, n));
      if (n >= cmd.length) {
        clearInterval(typer);
        setTimeout(() => setDone(true), 450);
      }
    }, 38);
    const next = setTimeout(() => setI((x) => (x + 1) % claudeCode.session.length), cmd.length * 38 + 2600);
    return () => { clearInterval(typer); clearTimeout(next); };
  }, [i, on]);

  return (
    <div className="term" ref={ref}>
      <div className="term__bar" aria-hidden="true">
        <i /><i /><i />
        <span>claude — ~/surya-portfolio</span>
      </div>
      {/* Screen readers get the full list instead of the typing loop. */}
      <ul className="sr-only">
        {claudeCode.session.map(([c, r]) => <li key={c}>{c}: {r}</li>)}
      </ul>
      <div className="term__body" aria-hidden="true">
        <p className="term__line">
          <span className="term__prompt">&gt;</span> {typed}
          {!done && <span className="term__caret" />}
        </p>
        <AnimatePresence mode="wait">
          {done && (
            <m.p
              key={i}
              className="term__out"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.35, ease: ease.out }}
            >
              <span className="term__spark">✻</span> {claudeCode.session[i][1]}
            </m.p>
          )}
        </AnimatePresence>
        <div className="term__dots">
          {claudeCode.session.map((_, k) => <span key={k} className={k === i ? "on" : ""} />)}
        </div>
      </div>
    </div>
  );
}

export default function ClaudeCode() {
  return (
    <section className="section claude" id="claude">
      <div className="claude__grid">
        <div>
          <Rise as="p" className="eyebrow">How I build</Rise>
          <RevealText text="Engineering with Claude Code." className="h2" />
          <Rise className="claude__level" delay={0.1}>
            <span className="claude__badge">{claudeCode.level}</span>
            <span className="muted">Claude Code user</span>
          </Rise>
          <Rise as="p" className="claude__summary" delay={0.15}>{claudeCode.summary}</Rise>
          <div className="claude__facts">
            {claudeCode.facts.map(([n, l], k) => (
              <Rise className="claude__fact" key={l} delay={0.2 + k * 0.06}>
                <b>{n}</b>
                <span>{l}</span>
              </Rise>
            ))}
          </div>
        </div>
        <Rise delay={0.1}>
          <Session />
        </Rise>
      </div>

      <div className="claude__groups">
        {claudeCode.groups.map(([g, items], gi) => (
          <Rise className="claude__group" key={g} delay={gi * 0.08}>
            <p className="eyebrow eyebrow--plain">{g}</p>
            <ul className="tags">
              {items.map((s, k) => (
                <m.li
                  key={s}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 400, damping: 24, delay: gi * 0.08 + k * 0.03 }}
                >
                  {s}
                </m.li>
              ))}
            </ul>
          </Rise>
        ))}
      </div>
    </section>
  );
}

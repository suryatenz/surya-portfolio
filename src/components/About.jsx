import { useEffect, useRef } from "react";
import { animate, m, useInView, useScroll, useTransform } from "motion/react";
import { statement, stats } from "../data.js";
import { reduced } from "../lib/motion.js";
import { Rise } from "./Reveal.jsx";

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.22, 1]);
  const color = useTransform(progress, range, ["#8a8f9c", "#15171f"]);
  return <m.span style={{ opacity, color }} className="stmt__w">{children} </m.span>;
}

// The statement "reads itself in" as it scrolls through the viewport.
function Statement() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 45%"] });
  const words = statement.split(" ");
  return (
    <p className="stmt" ref={ref}>
      {words.map((w, i) =>
        reduced ? (
          <span key={i}>{w} </span>
        ) : (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</Word>
        )
      )}
    </p>
  );
}

function Stat({ s, i }) {
  const ref = useRef(null);
  const num = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  useEffect(() => {
    if (!inView || reduced) return;
    const c = animate(0, s.value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      delay: i * 0.08,
      onUpdate: (v) => { if (num.current) num.current.textContent = Math.round(v).toLocaleString("en-US"); },
    });
    return () => c.stop();
  }, [inView, s.value, i]);

  return (
    <Rise className="stat" delay={i * 0.06}>
      <p className="stat__value" ref={ref}>
        {s.prefix}<span ref={num}>{s.value.toLocaleString("en-US")}</span>{s.suffix}
      </p>
      <p className="stat__label">{s.label}</p>
    </Rise>
  );
}

export default function About() {
  return (
    <section className="section about" id="about">
      <Rise as="p" className="eyebrow">About</Rise>
      <Statement />
      <div className="stats">
        {stats.map((s, i) => <Stat key={s.label} s={s} i={i} />)}
      </div>
    </section>
  );
}

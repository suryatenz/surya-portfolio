import { useEffect, useState } from "react";
import { m } from "motion/react";
import { scrollToId } from "../lib/motion.js";

const LINKS = [
  ["work", "Work"],
  ["about", "About"],
  ["claude", "Claude Code"],
  ["resume", "Résumé"],
  ["live", "Live"],
];

// Floating pill nav. A single highlight glides between links as sections scroll into view.
export default function Nav() {
  const [active, setActive] = useState(null);
  const [hover, setHover] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ["top", ...LINKS.map(([id]) => id), "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  const go = (id) => (e) => {
    e.preventDefault();
    scrollToId(id);
  };
  const lit = hover ?? active;

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
      <a href="#top" className="nav__mark" onClick={go("top")} aria-label="Surya Prajyesh, back to top">
        <span className="nav__dot" aria-hidden="true" />
        Surya
      </a>
      <nav aria-label="Sections" onMouseLeave={() => setHover(null)}>
        {LINKS.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={go(id)}
            onMouseEnter={() => setHover(id)}
            aria-current={active === id ? "true" : undefined}
            className={lit === id ? "is-lit" : ""}
          >
            {lit === id && <m.span layoutId="nav-pill" className="nav__pill" aria-hidden="true" />}
            <span className="nav__label">{label}</span>
          </a>
        ))}
      </nav>
      <m.a href="#contact" onClick={go("contact")} className="nav__cta" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
        Say hi
      </m.a>
    </header>
  );
}

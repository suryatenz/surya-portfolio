import { useEffect, useState } from "react";
import { LazyMotion, MotionConfig } from "motion/react";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import Work from "./components/Work.jsx";
import About from "./components/About.jsx";
import ClaudeCode from "./components/ClaudeCode.jsx";
import Resume from "./components/Resume.jsx";
import Live from "./components/Live.jsx";
import Contact from "./components/Contact.jsx";
import { loadGithub } from "./lib/github.js";
import { startSmoothScroll, ScrollTrigger, spring } from "./lib/motion.js";

const loadMotionFeatures = () => import("./lib/motionFeatures.js").then((mod) => mod.default);

export default function App() {
  const [gh, setGh] = useState(null);

  useEffect(() => {
    startSmoothScroll();
    loadGithub().then(setGh).catch(() => setGh(false));
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return (
    // LazyMotion + `m` components ship only the animation features this site uses.
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user" transition={spring}>
        <a className="skip" href="#work">Skip to projects</a>
        <Nav />
        <main>
          <Hero />
          <Work gh={gh} />
          <About />
          <ClaudeCode />
          <Resume />
          <Live gh={gh} />
        </main>
        <Contact />
      </MotionConfig>
    </LazyMotion>
  );
}

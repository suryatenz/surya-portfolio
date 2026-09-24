import { Fragment } from "react";
import { m } from "motion/react";
import { ease } from "../lib/motion.js";

// Words rise out of a mask as the block scrolls into view. The accessible text is the
// plain string; the animated words are presentation only.
export function RevealText({ text, as: Tag = "h2", className, delay = 0 }) {
  const words = text.split(" ");
  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <m.span
        aria-hidden="true"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -12% 0px" }}
        transition={{ staggerChildren: 0.045, delayChildren: delay }}
      >
        {/* The space sits between masks: inside an inline-block it would collapse. */}
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="mask">
              <m.span
                className="mask__in"
                variants={{
                  hidden: { y: "110%" },
                  show: { y: 0, transition: { duration: 0.9, ease: ease.out } },
                }}
              >
                {w}
              </m.span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </m.span>
    </Tag>
  );
}

// Generic fade-and-rise for blocks.
export function Rise({ children, className, delay = 0, as = "div", ...rest }) {
  const M = m[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, ease: ease.out, delay }}
      {...rest}
    >
      {children}
    </M>
  );
}

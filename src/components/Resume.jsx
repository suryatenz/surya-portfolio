import { m } from "motion/react";
import { me, experience, education, publication, certification, skillGroups, projects } from "../data.js";
import { ease } from "../lib/motion.js";
import { RevealText, Rise } from "./Reveal.jsx";

// Each block of the page slides in; the section rule under each heading draws itself.
const block = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: ease.out } },
};

function Block({ title, children }) {
  return (
    <m.section className="cv__block" variants={block}>
      <h3 className="cv__h">
        {title}
        <m.span className="cv__rule" variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.9, ease: ease.out, delay: 0.15 } } }} />
      </h3>
      {children}
    </m.section>
  );
}

export default function Resume() {
  return (
    <section className="section resume" id="resume">
      <div className="section__head resume__head">
        <div>
          <Rise as="p" className="eyebrow">Résumé</Rise>
          <RevealText text="The one-page version." className="h2" />
        </div>
        <Rise className="resume__actions" delay={0.1}>
          <m.a className="btn btn--primary" href={me.resume} download="Surya_Prajyesh_Eatha_Resume.pdf" whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
            Download PDF <span aria-hidden="true">↓</span>
          </m.a>
          <m.a className="btn btn--ghost" href={me.resume} target="_blank" rel="noreferrer" whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
            View PDF <span aria-hidden="true">↗</span>
          </m.a>
        </Rise>
      </div>

      <m.article
        className="cv"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ staggerChildren: 0.09 }}
        aria-label="Résumé"
      >
        <m.header className="cv__top" variants={block}>
          <div>
            <p className="cv__name">{me.name}</p>
            <p className="cv__role">Data Scientist · ML &amp; AI Automation Engineer</p>
          </div>
          <ul className="cv__contact">
            <li><a href={`mailto:${me.email}`}>{me.email}</a></li>
            <li><a href={me.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
            <li><a href={me.github} target="_blank" rel="noreferrer">github.com/suryatenz</a></li>
            <li>{me.location}</li>
          </ul>
        </m.header>

        <div className="cv__cols">
          <div className="cv__main">
            <Block title="Experience">
              {experience.map((x) => (
                <div className="cv__item" key={x.org}>
                  <div className="cv__row">
                    <p className="cv__title">{x.role}</p>
                    <p className="cv__when">{x.when}</p>
                  </div>
                  <p className="cv__org">{x.org} · {x.where}</p>
                  <ul className="cv__list">{x.points.map((p) => <li key={p}>{p}</li>)}</ul>
                </div>
              ))}
            </Block>
            <Block title="Selected projects">
              {projects.filter((p) => p.repo || p.live).slice(0, 4).map((p) => (
                <div className="cv__item cv__item--tight" key={p.id}>
                  <p className="cv__title">{p.title} <span className="cv__kicker">· {p.kicker}</span></p>
                  <p className="cv__text">{p.points[0]}</p>
                </div>
              ))}
            </Block>
          </div>

          <aside className="cv__side">
            <Block title="Education">
              <p className="cv__title">{education.school}</p>
              <p className="cv__org">{education.degree}</p>
              <p className="cv__when">{education.when}</p>
              <p className="cv__text cv__muted">{education.focus}</p>
            </Block>
            <Block title="Publication">
              <p className="cv__text">{publication.title}</p>
              <p className="cv__when">{publication.when}</p>
            </Block>
            <Block title="Skills">
              {skillGroups.map(([g, items]) => (
                <div className="cv__skills" key={g}>
                  <p className="cv__skill-h">{g}</p>
                  <p className="cv__text">{items.join(" · ")}</p>
                </div>
              ))}
            </Block>
            <Block title="Certification">
              <p className="cv__text">{certification.title}</p>
              <p className="cv__when">{certification.by} · {certification.when}</p>
            </Block>
          </aside>
        </div>
      </m.article>
    </section>
  );
}

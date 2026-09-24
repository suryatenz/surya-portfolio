// Every fact here traces to the resume master reference or a public repo. Nothing invented.
export const me = {
  name: "Surya Prajyesh Eatha",
  short: "Surya Prajyesh",
  email: "sprajyesh@gmail.com",
  location: "United States",
  linkedin: "https://www.linkedin.com/in/surya-prajyesh-3053ab253/",
  github: "https://github.com/suryatenz",
  resume: "/Surya_Prajyesh_Resume.pdf",
  roles: ["data scientist", "ML engineer", "automation engineer"],
};

export const statement =
  "I like the moment a spreadsheet becomes a system. I build tools that read the data, make the call, and do the repetitive work — so people can spend their time on the part that needs a human.";

export const stats = [
  { value: 10000, suffix: "+", label: "postings screened a day by Job Alerts" },
  { value: 100, prefix: "70–", label: "personalised emails a day from OwlPost" },
  { value: 74, suffix: " yrs", label: "of Formula 1 history in Pit Wall" },
  { value: 1, label: "published deep-learning paper" },
];

// `tone` picks the tile colour from the palette in styles.css.
export const projects = [
  {
    id: "pitwall",
    repo: "Pit-Wall",
    title: "Pit Wall",
    kicker: "Full-stack ML",
    tagline: "74 years of Formula 1, one race predictor.",
    tone: "apricot",
    size: "wide",
    shot: "/shots/pitwall.webp",
    stack: ["FastAPI", "scikit-learn", "pandas", "React", "Recharts"],
    points: [
      "Analytics over 1,125 races and 861 drivers from a 14-table historical dataset (1950–2024).",
      "Random Forest race predictor with confidence scoring, trained from the UI and served with FastAPI.",
      "Championship what-if simulator and head-to-head driver comparison with radar charts.",
      "ETL layer with LRU caching; model serialised with joblib.",
    ],
  },
  {
    id: "jobalerts",
    repo: "job-alerts",
    title: "Job Alerts",
    kicker: "LLM pipeline",
    tagline: "10,000 postings in. A short list out.",
    tone: "mint",
    art: "tailor",
    stack: ["Python", "Claude API", "LaTeX", "Flask", "Playwright"],
    points: [
      "Aggregates 10,000+ live postings a day from SimplifyJobs, Greenhouse, Lever, RemoteOK and Adzuna.",
      "Layered rule filters for experience, visa sponsorship and degree before LLM ranking with the Claude API.",
      "Writes a new résumé for each shortlisted role: Claude tailors the LaTeX source, it recompiles to PDF, and Claude Haiku re-scores the fit (one real run went from 78 to 92).",
      "Drafts application answers with a memory profile that learns from every correction.",
      "Flask review dashboard; Playwright pre-fills forms and always stops before submitting.",
    ],
  },
  {
    id: "owlpost",
    repo: "OwlPost",
    title: "OwlPost",
    kicker: "Outreach automation",
    tagline: "70–100 personal emails a day, replies tracked.",
    tone: "cobalt",
    art: "mail",
    stack: ["Python", "Gmail SMTP", "IMAP", "Task Scheduler"],
    points: [
      "Schedules and sends 70–100 personalised emails a day over Gmail SMTP.",
      "Recycles the contact list automatically when a run completes.",
      "Multi-method reply detection over IMAP with exact email matching.",
    ],
  },
  {
    id: "brainhub",
    title: "BRAIN Hub",
    kicker: "Concept redesign",
    tagline: "Three research networks, one living hub.",
    tone: "butter",
    size: "wide",
    shot: "/shots/brainhub.webp",
    live: "https://brain-hub-demo.vercel.app",
    stack: ["React", "Vite", "Tailwind", "Framer Motion"],
    points: [
      "Concept redesign uniting the NSF BRAIN Center, AccelNet and MDRN sites.",
      "Built only on real public data: people, publications, events and partner institutions.",
      "Live neural canvas and EEG trace; WCAG 2.2 AA with zero axe violations across 11 routes.",
    ],
  },
  {
    id: "salt",
    repo: "Salt_segmentation",
    title: "Salt Segmentation",
    kicker: "Published research",
    tagline: "Finding salt bodies in seismic images with UNet.",
    tone: "sky",
    size: "wide",
    art: "seismic",
    stack: ["Python", "TensorFlow", "UNet"],
    points: [
      "Paper: “Deep Learning for Seismic Salt Segmentation to Aid Hydrocarbon Exploration Using UNet”, June 2025.",
      "UNet pipeline that segments salt bodies in seismic images.",
    ],
  },
];

// Résumé content mirrors job-alerts/resume/master_reference.md (the source of truth).
export const experience = [
  {
    role: "AI Automation & Data Analytics Intern",
    org: "Diversified Medical Practices",
    where: "United States",
    when: "May – Jul 2026",
    points: [
      "Automated clinic administrative workflows in Python, replacing paper-based processes with a fully electronic system.",
      "Built automation for everyday tasks such as patient service requests and scheduling.",
    ],
  },
  {
    role: "Data Visualization Developer Intern (React)",
    org: "UnBoxing Community",
    where: "Bangalore, India",
    when: "Apr – Jul 2024",
    points: [
      "Built a React.js portal with REST APIs and a Java backend that aggregated data into interactive dashboards.",
      "Worked cross-functionally on KPIs and managed AWS and Git deployments.",
    ],
  },
  {
    role: "Web Development Intern",
    org: "EduMoon",
    where: "Remote, India",
    when: "Jan – Aug 2023",
    points: ["Built web pages in HTML, CSS and JavaScript as part of a frontend team."],
  },
];

export const education = {
  school: "University of Houston",
  degree: "MS, Engineering Data Science & AI",
  when: "Aug 2025 – present",
  focus: "Data analysis, statistical modeling, data visualization, applied machine learning",
};

export const publication = {
  title: "Deep Learning for Seismic Salt Segmentation to Aid Hydrocarbon Exploration Using UNet",
  when: "Jun 2025",
};

export const certification = { title: "Python for Data Science, AI & Development", by: "IBM · Coursera", when: "Oct 2023" };

export const skillGroups = [
  ["Languages", ["Python", "SQL", "C++", "JavaScript"]],
  ["ML & data", ["pandas", "NumPy", "scikit-learn", "TensorFlow", "Matplotlib", "Power BI", "Tableau"]],
  ["Build", ["FastAPI", "Flask", "React", "Redux", "Tailwind", "MERN"]],
  ["Automation & AI", ["Claude API", "Playwright", "Gmail SMTP / IMAP", "Task Scheduler"]],
  ["Platforms", ["Git", "GitHub", "AWS S3", "Docker", "Vercel", "Jupyter"]],
];

// How I work with Claude Code. Everything here is the actual local setup
// (~/.claude/skills, enabled plugins, MCP servers) and things done with it.
export const claudeCode = {
  level: "Advanced",
  summary:
    "Claude Code is my daily engineering environment. I extend it with custom skills, persistent memory and MCP connectors, and I ship Claude API features to production.",
  groups: [
    ["Custom skills", ["ui-ux-pro-max", "design", "design-system", "ui-styling", "brand", "banner-design", "slides", "task-observer"]],
    ["Plugins & MCP", ["claude-mem (persistent memory)", "claude-code-setup", "headroom MCP", "Gmail", "Google Calendar", "Notion", "Vercel"]],
    ["Workflows", ["Playwright visual QA", "axe-core a11y audits", "CSP testing", "Vercel deploys", "scheduled pipelines"]],
  ],
  facts: [
    ["8", "custom skills installed"],
    ["7", "plugins & MCP connectors"],
    ["~$2/mo", "Claude API cost of Job Alerts in production"],
  ],
  // Replayed in the prompt window: real tasks from building this site and Job Alerts.
  session: [
    ["/ui-ux-pro-max audit the portfolio", "✓ 8 issues fixed · 0 console errors"],
    ["test the CSP against the live build", "✓ 0 violations at 1440px and 390px"],
    ["tailor my résumé for this role", "✓ PDF compiled · fit 78 → 92"],
  ],
};

// LinkedIn has no public API for reading a member's posts, so the feed uses LinkedIn's
// official embeds. To add a post: open it on LinkedIn -> "..." -> "Embed this post", copy
// the URN from the iframe src (e.g. "urn:li:share:7123456789012345678") and paste it here.
export const linkedinPosts = [];

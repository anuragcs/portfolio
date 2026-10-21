export const socialLinks = {
  email: "mailto:anurag9953001342@gmail.com",
  phone: "tel:+919650124336",
  github: "https://github.com/anuragcs",
  linkedin: "https://www.linkedin.com/in/anurag-gupta-686391167/",
  leetcode: "https://leetcode.com/u/anurag_chaos/",
} as const;

export const heroStats = [
  { value: "8.67", label: "CGPA · BPIT" },
  { value: "<200ms", label: "API latency" },
  { value: "10k+", label: "Tasks / day" },
] as const;

export const education = [
  {
    school: "Bhagwan Parshuram Institute of Technology",
    place: "Delhi",
    degree: "B.Tech · Information Technology",
    period: "2021 – 2025",
    score: "8.67 CGPA",
  },
  {
    school: "Delhi International Public School",
    place: "Delhi",
    degree: "Higher Secondary",
    period: "2020 – 2021",
    score: "89%",
  },
  {
    school: "Delhi International Public School",
    place: "Delhi",
    degree: "Secondary Examination",
    period: "2018 – 2019",
    score: "95.6%",
  },
] as const;

export const experience = [
  {
    id: "ninjacart-sde",
    role: "Software Developer (SDE)",
    org: "Ninjacart",
    time: "July 2025 – Present · Bengaluru",
    points: [
      "Designed report generation APIs with dynamic JsonNode processing in Spring Boot, integrated with Redash.",
      "Built email notification workflows with reusable templates and routing APIs, cutting delays by ~25%.",
      "Owned payment service integration — orchestration, webhooks, and transaction state management.",
      "Shipped a Strategy Pattern–based GST module for dynamic tax computation (~35% less duplication).",
      "Developed and deployed React screens to production with performance-focused state management.",
    ],
  },
  {
    id: "ninjacart-intern",
    role: "SDE Intern",
    org: "Ninjacart",
    time: "Jan 2025 – Feb 2025 · Bengaluru",
    points: [
      "Implemented Redis caching strategies, reducing DB load by 40%+ and average latency to under 200ms.",
      "Built a scalable scheduler with a Hierarchical Timing Wheel (O(1)), handling 10,000+ tasks per day.",
    ],
  },
  {
    id: "drdo",
    role: "Research Intern",
    org: "DRDO",
    time: "July 2024 – Aug 2024 · Delhi",
    points: [
      "Used the Metasploit Framework for penetration testing and vulnerability assessment.",
    ],
  },
] as const;

export const projects = [
  {
    id: "teachnew",
    name: "TeachNew",
    tagline: "Full-stack course platform",
    desc: "Browse, purchase, and access courses with real-time dashboards and role-based workflows.",
    highlights: [
      "Nginx reverse proxy in production",
      "JWT auth, RBAC, bcrypt, rate limiting",
      "node-cache cut MongoDB reads ~60%; ~40–50ms faster responses",
    ],
    stack: ["React", "Node.js", "MongoDB", "Nginx", "JWT"],
  },
  {
    id: "ryoko",
    name: "RYOKO",
    tagline: "Travelling in the metaverse",
    desc: "Immersive VR travel on the MERN stack — explore global destinations before you book.",
    highlights: [
      "MERN full-stack architecture",
      "Immersive 3D destination previews",
      "User journeys from discovery to booking",
    ],
    stack: ["MongoDB", "Express", "React", "Node.js", "WebXR"],
  },
] as const;

export const skills = [
  { name: "Spring Boot", icon: "server" as const },
  { name: "Java", icon: "code" as const },
  { name: "React", icon: "layout" as const },
  { name: "MongoDB", icon: "database" as const },
  { name: "MySQL", icon: "database" as const },
  { name: "Redis", icon: "zap" as const },
  { name: "C++", icon: "code" as const },
  { name: "System Design", icon: "network" as const },
] as const;

export const certifications = [
  {
    title: "VIHAAN · IEEE DTU Hackathon",
    period: "April 2023",
  },
] as const;

/* ============================================================
   data.js — ALL editable content lives here.
   To customize the portfolio, you mostly only touch this file:
   add a project, tweak a skill level, update experience, etc.
   Rendering is handled by js/modules/render.js.
   ============================================================ */

/* Site-wide configuration */
export const config = {
  // Roles cycled by the hero typing effect
  typedRoles: [
    "an AI & Data Engineer",
    "a Machine Learning Engineer",
    "a Backend Developer",
    "a Computer Vision Enthusiast",
    "an NLP Practitioner",
  ],

  // Contact form: paste a Formspree endpoint (https://formspree.io/f/xxxx)
  // to enable real submissions. Left empty, the form falls back to
  // opening the visitor's mail client with the message pre-filled.
  formEndpoint: "",
  email: "enisfurkankirmizi@gmail.com",
};

/* ---------- Skills ----------
   level: 0–100, drives the proficiency bar width.
   abbr:  2–3 chars shown in the gradient badge.
   icon:  key into the icon library in render.js. */
export const skills = [
  {
    category: "Programming Languages",
    icon: "code",
    items: [
      { name: "Python", abbr: "Py", level: 93 },
      { name: "SQL", abbr: "SQL", level: 82 },
      { name: "C++", abbr: "C++", level: 78 },
      { name: "TypeScript", abbr: "TS", level: 70 },
    ],
  },
  {
    category: "AI / ML Frameworks",
    icon: "layers",
    items: [
      { name: "PyTorch", abbr: "PT", level: 90 },
      { name: "TensorFlow", abbr: "TF", level: 78 },
      { name: "scikit-learn", abbr: "Sk", level: 85 },
      { name: "Hugging Face", abbr: "HF", level: 82 },
    ],
  },
  {
    category: "ML Specializations",
    icon: "brain",
    items: [
      { name: "Computer Vision", abbr: "CV", level: 88 },
      { name: "NLP", abbr: "NLP", level: 84 },
      { name: "Knowledge Distillation", abbr: "KD", level: 86 },
      { name: "Model Compression", abbr: "MC", level: 85 },
    ],
  },
  {
    category: "Big Data & Databases",
    icon: "database",
    items: [
      { name: "PySpark", abbr: "Spk", level: 80 },
      { name: "Hadoop", abbr: "Hd", level: 74 },
      { name: "PostgreSQL", abbr: "PG", level: 80 },
      { name: "ChromaDB", abbr: "Ch", level: 80 },
    ],
  },
  {
    category: "Backend & Web",
    icon: "server",
    items: [
      { name: "FastAPI", abbr: "FA", level: 85 },
      { name: "Flask", abbr: "Fl", level: 80 },
      { name: "REST APIs", abbr: "API", level: 85 },
      { name: "React", abbr: "Re", level: 70 },
    ],
  },
  {
    category: "Tools & DevOps",
    icon: "wrench",
    items: [
      { name: "Docker", abbr: "Dk", level: 82 },
      { name: "Git", abbr: "Git", level: 90 },
      { name: "OpenCV", abbr: "Cv2", level: 82 },
      { name: "Pandas / NumPy", abbr: "Pd", level: 90 },
    ],
  },
];

/* ---------- Projects ----------
   cover: CSS gradient for the placeholder cover. Replace with a real
   screenshot later by adding an `image` field (see render.js).
   icon:  key into the icon library, drawn on the cover. */
export const projects = [
  {
    title: "Joint Distillation & Tensor Compression",
    description:
      "Senior graduation project extending the PURSUhInT knowledge-distillation framework with CP/Tucker tensor decomposition and a custom BSAT loss. A distributed DDP + AMP pipeline compresses a ResNet-34 into a ResNet-18 — 13.7× fewer parameters (21.3M → 1.5M) and 12.3× fewer FLOPs at only ~3% Top-1 drop on CIFAR and ImageNet.",
    tech: ["PyTorch", "DDP + AMP", "Tensorly", "CUDA"],
    tags: ["Model Compression", "Deep Learning"],
    github: "https://github.com/efkirmizi/distill",
    demo: "",
    icon: "brain",
    cover: "linear-gradient(135deg, #241a5e, #14406e)",
  },
  {
    title: "AI-Powered E-Commerce Platform",
    description:
      "Full-stack shopping platform with semantic product search over word embeddings, voice search via Google Speech-to-Text, Gemini-refined queries, and AI sentiment analysis that scores and summarizes product reviews. FastAPI backend, React frontend, OAuth2/JWT, Dockerized.",
    tech: ["FastAPI", "React", "TypeScript", "PostgreSQL", "Gemini", "Docker"],
    tags: ["Full-Stack", "NLP"],
    github: "https://github.com/efkirmizi/e-commerce",
    demo: "https://kumulala.xyz",
    icon: "cart",
    cover: "linear-gradient(135deg, #0f2f5e, #2a2a7e)",
  },
  {
    title: "ViT Multitask Age & Gender Estimation",
    description:
      "Multitask Vision Transformer that fine-tunes ViT-Base with a shared trunk and two heads to jointly predict age (regression) and gender (classification) on UTKFace. Ships attention-map, t-SNE and PCA explainability plus deep error- and bias-analysis.",
    tech: ["PyTorch", "Transformers", "ViT", "scikit-learn"],
    tags: ["Computer Vision", "Deep Learning"],
    github: "https://github.com/efkirmizi/deep_learning_project",
    demo: "",
    icon: "eye",
    cover: "linear-gradient(135deg, #1a1f5e, #4a1a6e)",
  },
  {
    title: "Real-Time Face Recognition",
    description:
      "Live webcam recognition pipeline: MTCNN face detection, FaceNet (InceptionResnetV1) embeddings, and ChromaDB vector similarity for identity matching against a gallery — rendered in real time with OpenCV.",
    tech: ["PyTorch", "FaceNet", "MTCNN", "ChromaDB", "OpenCV"],
    tags: ["Computer Vision", "Vector Search"],
    github: "https://github.com/efkirmizi/FaceRecognition",
    demo: "",
    icon: "camera",
    cover: "linear-gradient(135deg, #14285e, #3a1a5e)",
  },
  {
    title: "Social Media Backend API",
    description:
      "Full-featured social platform backend covering posts, comments, communities, follows, likes, saves and view-logging — with OAuth2/JWT auth, SQLAlchemy models and Alembic migrations over a normalized PostgreSQL schema.",
    tech: ["FastAPI", "SQLAlchemy", "PostgreSQL", "Alembic", "JWT"],
    tags: ["Backend", "REST API"],
    github: "https://github.com/efkirmizi/fastapi_social_media_project",
    demo: "",
    icon: "server",
    cover: "linear-gradient(135deg, #12356e, #241a6e)",
  },
  {
    title: "Banking System REST API",
    description:
      "Modular banking backend spanning accounts, cards, loans, transactions, branches and credit scoring, built on Flask with hand-written SQL (no ORM), JWT auth, role-based access and full Swagger/OpenAPI documentation.",
    tech: ["Flask", "SQL", "JWT", "Swagger"],
    tags: ["Backend", "Databases"],
    github: "https://github.com/efkirmizi/Banking-API",
    demo: "",
    icon: "bank",
    cover: "linear-gradient(135deg, #1a2a4e, #24186e)",
  },
  {
    title: "Optimal Dormitory Placement",
    description:
      "Multi-criteria optimization that selects ideal student-dormitory locations across Istanbul's districts — weighing rent, population, crime, air quality, university proximity and social-vulnerability data through grid search, with geospatial visualization.",
    tech: ["Python", "Pandas", "NumPy", "GeoJSON"],
    tags: ["Optimization", "Data Analysis"],
    github: "https://github.com/efkirmizi/Optimization_Project",
    demo: "",
    icon: "map",
    cover: "linear-gradient(135deg, #14404e, #1a2a6e)",
  },
  {
    title: "The Harmonizer — AI Solver",
    description:
      "Search-based AI agent that automatically solves “The Harmonizer,” a two-character mirror-movement puzzle with walls and conveyors, by exploring the game's state space with breadth-first search. Built on a custom Pygame engine.",
    tech: ["Python", "Pygame", "NumPy", "BFS"],
    tags: ["AI Search", "Algorithms"],
    github: "https://github.com/efkirmizi/the_harmonizer-ud_skeleton",
    demo: "",
    icon: "gamepad",
    cover: "linear-gradient(135deg, #2a1a5e, #14285e)",
  },
];

/* ---------- Experience (newest first) ---------- */
export const experience = [
  {
    role: "Data Science Intern",
    company: "Merkezi Kayıt Kuruluşu (MKK) — Borsa İstanbul",
    dates: "2026 — Present",
    achievements: [
      "Data science intern at Türkiye's Central Securities Depository, which operates the securities settlement, custody, and investor-record infrastructure behind Borsa İstanbul.",
    ],
  },
  {
    role: "Artificial Intelligence Intern",
    company: "Ziraat Teknoloji A.Ş.",
    dates: "Aug 2025 — Sep 2025",
    achievements: [
      "Built a multimodal Retrieval-Augmented Generation (RAG) pipeline using CLIP (ViT-B/32) to align text and image embeddings for context-aware responses.",
      "Developed an automated document-ingestion pipeline with PyMuPDF and Tesseract OCR to extract, chunk, and embed PDF data into a ChromaDB vector database.",
      "Implemented a real-time face-recognition system using OpenCV, MTCNN, and FaceNet (InceptionResnetV1) for video-stream processing.",
    ],
  },
];

/* ---------- Education ---------- */
export const education = [
  {
    degree: "B.Sc. Artificial Intelligence & Data Engineering",
    school: "Istanbul Technical University",
    dates: "2022 — 2026",
    gpa: "GPA 3.33 / 4.00",
    notes: [
      "Ranked 4th in the graduating class of the AI & Data Engineering department.",
      "Senior graduation project: knowledge-distillation + tensor-decomposition model compression — 13.7× fewer parameters at ~3% Top-1 accuracy drop.",
      "Relevant coursework: Deep Learning, NLP, Computer Vision, Data Mining, Analysis of Algorithms.",
    ],
  },
];

/* ---------- Certifications ----------
   Empty for now — add objects like { name, issuer, year } as you earn
   them. While this array is empty the whole section auto-hides
   (see hideIfEmpty in main.js). */
export const certifications = [];

/* ---------- Publications / Research ---------- */
export const publications = [
  {
    title: "Multimodal Idiomaticity Representation (AdMIRe 2.0)",
    authors: "Enis Furkan Kırmızı",
    venue: "Research Project · Istanbul Technical University",
    abstract:
      "A multimodal architecture combining vision-language encoders (SigLIP2) and BGE-M3 embeddings to model multilingual idiomatic expressions, with dynamic idiom paraphrasing via small language models to counter literal visual bias in image–text ranking.",
    link: "",
  },
  {
    title: "Distributed Big-Data Analysis of 40 GB Steam Reviews",
    authors: "Enis Furkan Kırmızı",
    venue: "Big Data Project · PySpark · Hadoop · Google Cloud Dataproc",
    abstract:
      "A distributed pipeline processing a 40 GB Steam user-review dataset on Google Cloud Dataproc, using efficient sampling for gamer-profiling insights and benchmarking single- vs multi-node clusters to quantify in-memory distributed-processing gains.",
    link: "",
  },
];

/* ---------- Achievements ---------- */
export const achievements = [
  {
    title: "Ranked 4th in Department",
    description: "Graduated 4th among peers in the Artificial Intelligence & Data Engineering department at Istanbul Technical University.",
    year: "2026",
    icon: "trophy",
  },
  {
    title: "13.7× Model Compression",
    description: "Senior project compressed a ResNet-34 into a ResNet-18 — 21.3M → 1.5M parameters and 12.3× fewer FLOPs at only ~3% Top-1 accuracy drop.",
    year: "2026",
    icon: "star",
  },
  {
    title: "AI Internship — Ziraat Teknoloji",
    description: "Selected for a summer AI internship building a multimodal CLIP-based RAG pipeline and a real-time face-recognition system.",
    year: "2025",
    icon: "award",
  },
];

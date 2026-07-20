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
    "a Data Engineer",
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
   abbr:  2–3 chars shown when no icon is available.
   icon:  brand slug from js/modules/brandicons.js, or a key into
          the stroke icon library in render.js (custom glyphs). */
export const skills = [
  {
    category: "Programming Languages",
    icon: "code",
    items: [
      { name: "Python", abbr: "Py", icon: "python", level: 93 },
      { name: "SQL", abbr: "SQL", icon: "database", level: 85 },
      { name: "C++", abbr: "C++", icon: "cplusplus", level: 78 },
      { name: "TypeScript", abbr: "TS", icon: "typescript", level: 70 },
    ],
  },
  {
    category: "AI / ML Frameworks",
    icon: "layers",
    items: [
      { name: "PyTorch", abbr: "PT", icon: "pytorch", level: 90 },
      { name: "TensorFlow", abbr: "TF", icon: "tensorflow", level: 78 },
      { name: "scikit-learn", abbr: "Sk", icon: "scikitlearn", level: 85 },
      { name: "Hugging Face", abbr: "HF", icon: "huggingface", level: 82 },
      { name: "OpenCV", abbr: "Cv2", icon: "opencv", level: 82 },
    ],
  },
  {
    category: "ML Specializations",
    icon: "brain",
    items: [
      { name: "Computer Vision", abbr: "CV", icon: "eye", level: 88 },
      { name: "NLP & RAG", abbr: "NLP", icon: "message", level: 85 },
      { name: "Model Compression & Distillation", abbr: "MC", icon: "compress", level: 86 },
      { name: "Vector Search", abbr: "VS", icon: "vector", level: 83 },
    ],
  },
  {
    category: "Data Engineering",
    icon: "pipeline",
    items: [
      { name: "PySpark", abbr: "Spk", icon: "apachespark", level: 80 },
      { name: "Apache Iceberg", abbr: "Ib", icon: "iceberg", level: 78 },
      { name: "Apache Airflow", abbr: "Af", icon: "apacheairflow", level: 75 },
      { name: "Hadoop", abbr: "Hd", icon: "apachehadoop", level: 74 },
      { name: "Pandas / NumPy", abbr: "Pd", icon: "pandas", level: 90 },
    ],
  },
  {
    category: "Databases & Storage",
    icon: "database",
    items: [
      { name: "PostgreSQL", abbr: "PG", icon: "postgresql", level: 82 },
      { name: "MySQL", abbr: "My", icon: "mysql", level: 78 },
      { name: "ClickHouse", abbr: "CH", icon: "clickhouse", level: 72 },
      { name: "ChromaDB", abbr: "Ch", icon: "chroma", level: 80 },
    ],
  },
  {
    category: "Backend & DevOps",
    icon: "server",
    items: [
      { name: "FastAPI", abbr: "FA", icon: "fastapi", level: 88 },
      { name: "Flask", abbr: "Fl", icon: "flask", level: 82 },
      { name: "React", abbr: "Re", icon: "react", level: 70 },
      { name: "Docker", abbr: "Dk", icon: "docker", level: 82 },
      { name: "Git", abbr: "Git", icon: "git", level: 90 },
    ],
  },
];

/* ---------- Projects ----------
   image: SVG cover art in assets/covers/ (decorative, lazy-loaded).
   cover: CSS gradient shown behind/instead of the image.
   icon:  key into the icon library, drawn if the image is missing.
   tags:  drive the filter chips above the grid — keep the
          vocabulary small so the filters stay meaningful. */
export const projects = [
  {
    title: "ACL-Native Enterprise RAG Platform",
    description:
      "Retrieval-augmented generation where permissions are first-class: OpenFGA relationship-based access control is applied as a SQL predicate inside both retrieval arms, so unauthorized chunks can never be retrieved — continuously verified at 0 violations across 402 user×document pairs. Hybrid retrieval fuses pgvector HNSW with Turkish-stemmed full-text search via reciprocal rank fusion, then cross-encoder reranks before cited answer generation.",
    tech: ["FastAPI", "PostgreSQL", "pgvector", "OpenFGA", "bge-m3", "Docker"],
    tags: ["NLP & Retrieval", "Backend & APIs"],
    github: "https://github.com/efkirmizi/rag-platform",
    demo: "",
    icon: "search",
    image: "assets/covers/rag-platform.svg",
    cover: "linear-gradient(135deg, #241a5e, #14406e)",
  },
  {
    title: "CSD Analytics Lakehouse",
    description:
      "End-to-end data lakehouse modeling a Central Securities Depository's analytics workload, built during my MKK internship: Spark ETL through a bronze/silver/gold medallion model into Iceberg tables on MinIO, versioned by Nessie with Write-Audit-Publish quality gates, served by ClickHouse. Gold-layer queries answer in ~10 ms vs a 15.4 s PostgreSQL baseline on 20M rows, with 20M corrupted rows recoverable via time travel in 5.5 s.",
    tech: ["Spark", "Iceberg", "Nessie", "ClickHouse", "MinIO", "Airflow"],
    tags: ["Data Engineering"],
    github: "https://github.com/efkirmizi/csd-lakehouse",
    demo: "",
    icon: "pipeline",
    image: "assets/covers/csd-lakehouse.svg",
    cover: "linear-gradient(135deg, #14406e, #241a5e)",
  },
  {
    title: "Joint Distillation & Tensor Compression",
    description:
      "Senior graduation project extending the PURSUhInT knowledge-distillation framework with a custom BSAT loss (batch-subspace alignment + attention transfer), VBMF-guided CP/Tucker tensor decomposition, and dual-student training with bidirectional coupling. A distributed DDP + AMP pipeline compresses a ResNet-34 to 13.7× fewer parameters (21.3M → 1.5M) and 12.3× fewer FLOPs at only ~3% Top-1 drop on CIFAR and ImageNet-100.",
    tech: ["PyTorch", "DDP + AMP", "TensorLy", "CUDA"],
    tags: ["Deep Learning", "Computer Vision"],
    github: "https://github.com/efkirmizi/distill",
    demo: "",
    icon: "brain",
    image: "assets/covers/distill.svg",
    cover: "linear-gradient(135deg, #241a5e, #14406e)",
  },
  {
    title: "Fine-Tuning SAM 2 on DAVIS 2017",
    description:
      "Video-object-segmentation study that fine-tunes SAM 2's mask decoder (~4M trainable parameters, everything else frozen) on DAVIS 2017 with boundary-aware losses and homoscedastic uncertainty weighting. The honest headline: zero-shot SAM 2 scores 0.905 J&F and every fine-tuned variant lands below it — a documented case study of when fine-tuning on small data hurts. Backed by 44 unit tests over metrics and augmentation pipelines.",
    tech: ["PyTorch", "SAM 2", "CUDA", "DAVIS toolkit"],
    tags: ["Computer Vision", "Deep Learning"],
    github: "https://github.com/efkirmizi/SAM2-DAVIS",
    demo: "",
    icon: "camera",
    image: "assets/covers/sam2-davis.svg",
    cover: "linear-gradient(135deg, #1a1f5e, #4a1a6e)",
  },
  {
    title: "Semantic Commerce — AI E-Commerce",
    description:
      "AI-native shop where you search the catalog the way people actually talk: Gemini-refined queries embedded with sentence-transformers and ranked by pgvector HNSW cosine search, voice search via Google Speech-to-Text, sentiment-scored review summaries, and auto-generated product descriptions. FastAPI backend, React 19 + Vite + Tailwind frontend, OAuth2/JWT, fully Dockerized behind Nginx.",
    tech: ["FastAPI", "React", "PostgreSQL", "pgvector", "Gemini", "Docker"],
    tags: ["Full-Stack", "NLP & Retrieval"],
    github: "https://github.com/efkirmizi/e-commerce",
    demo: "",
    icon: "cart",
    image: "assets/covers/e-commerce.svg",
    cover: "linear-gradient(135deg, #0f2f5e, #2a2a7e)",
  },
  {
    title: "Agora — Community Platform API",
    description:
      "Reddit-style discussion backend: 77 endpoints across 12 tables covering communities, posts, comment threads nested to 50 levels, follows, likes, saves and karma. Denormalized counters keep feed sorts fast, soft deletes preserve reply-chain integrity, and views deduplicate per user per 24 hours. FastAPI + SQLModel over PostgreSQL, schema managed entirely through Alembic migrations.",
    tech: ["FastAPI", "SQLModel", "PostgreSQL", "Alembic", "JWT", "Docker"],
    tags: ["Backend & APIs"],
    github: "https://github.com/efkirmizi/agora",
    demo: "",
    icon: "message",
    image: "assets/covers/agora.svg",
    cover: "linear-gradient(135deg, #12356e, #241a6e)",
  },
  {
    title: "Retail Banking Platform API",
    description:
      "Production-grade banking backend where money invariants come first: every balance change writes an append-only double-entry ledger inside atomic transactions, overdrafts are blocked at three layers (service check, DB CHECK constraint, row lock), and cards are PCI-shaped — full PAN shown once, stored only as HMAC + last-four. Amortising loans, explainable 300–850 credit scoring, and three-role RBAC, proven by 77 pytest cases at 87% coverage.",
    tech: ["Flask", "SQLAlchemy 2.0", "PostgreSQL", "JWT", "pytest", "Docker"],
    tags: ["Backend & APIs"],
    github: "https://github.com/efkirmizi/Banking-Management-System-Database",
    demo: "",
    icon: "bank",
    image: "assets/covers/banking-platform.svg",
    cover: "linear-gradient(135deg, #1a2a4e, #24186e)",
  },
  {
    title: "CoreBank API — Raw-SQL Backend",
    description:
      "A university database project rebuilt to production standards on hand-written SQL — no ORM. A strict four-layer architecture (API → services → repositories → MySQL) is enforced by architectural tests, transfers run atomically via SELECT … FOR UPDATE locking in account-id order, and RBAC with ownership checks guards 62 endpoints. One-command Docker setup with demo data; 48 tests at 91% coverage.",
    tech: ["Flask", "MySQL", "SQL", "JWT", "OpenAPI", "Docker"],
    tags: ["Backend & APIs"],
    github: "https://github.com/efkirmizi/corebank-api",
    demo: "",
    icon: "bank",
    image: "assets/covers/corebank-api.svg",
    cover: "linear-gradient(135deg, #1a2a4e, #14285e)",
  },
  {
    title: "ViT Multitask Age & Gender Estimation",
    description:
      "Multitask Vision Transformer fine-tuning ViT-Base with a shared 512-d trunk and two heads to jointly predict age (regression) and gender (classification) on UTKFace — benchmarked against ResNet-50 across random seeds and optimizers (Adam, AdamW, SGD, AdaBelief). Ships attention-map, t-SNE and PCA explainability plus systematic error and bias analysis.",
    tech: ["PyTorch", "Transformers", "ViT", "scikit-learn"],
    tags: ["Computer Vision", "Deep Learning"],
    github: "https://github.com/efkirmizi/multitask-age-gender-estimation",
    demo: "",
    icon: "eye",
    image: "assets/covers/vit-age-gender.svg",
    cover: "linear-gradient(135deg, #1a1f5e, #4a1a6e)",
  },
  {
    title: "Real-Time Face Recognition",
    description:
      "Live webcam recognition pipeline: MTCNN face detection, FaceNet (InceptionResnetV1) embeddings, and ChromaDB vector similarity for identity matching against a gallery — rendered in real time with OpenCV.",
    tech: ["PyTorch", "FaceNet", "MTCNN", "ChromaDB", "OpenCV"],
    tags: ["Computer Vision"],
    github: "https://github.com/efkirmizi/FaceRecognition",
    demo: "",
    icon: "camera",
    image: "assets/covers/face-recognition.svg",
    cover: "linear-gradient(135deg, #14285e, #3a1a5e)",
  },
  {
    title: "Optimal Dormitory Placement",
    description:
      "Multi-criteria optimization that selects ideal student-dormitory locations across Istanbul's districts — weighing rent, population, crime, air quality, university proximity and social-vulnerability data through grid search, with geospatial visualization.",
    tech: ["Python", "Pandas", "NumPy", "GeoJSON"],
    tags: ["AI & Algorithms"],
    github: "https://github.com/efkirmizi/Optimization_Project",
    demo: "",
    icon: "map",
    image: "assets/covers/dormitory-placement.svg",
    cover: "linear-gradient(135deg, #14404e, #1a2a6e)",
  },
  {
    title: "The Harmonizer — Search-Agent Lab",
    description:
      "Grid puzzle where two mirrored characters move as one — and a lab for classical AI search: six solver agents (BFS, DFS, A* in tree- and graph-search variants) with swappable Manhattan / Chebyshev / Euclidean heuristics, full search statistics (nodes expanded, peak frontier), conveyor-chain mechanics, and a 20-test suite on a custom Pygame engine.",
    tech: ["Python", "Pygame", "pytest", "A* / BFS / DFS"],
    tags: ["AI & Algorithms"],
    github: "https://github.com/efkirmizi/the_harmonizer",
    demo: "",
    icon: "gamepad",
    image: "assets/covers/the-harmonizer.svg",
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
      "Designed and built csd-lakehouse, a reference data lakehouse for CSD analytics: Spark ETL through a bronze/silver/gold medallion model into Iceberg tables on MinIO, with Nessie branch-based Write-Audit-Publish quality gates and a ClickHouse serving layer.",
      "Benchmarked gold-layer queries at ~10 ms vs a 15.4 s PostgreSQL baseline on 20M rows, and reconciled 10.4M positions against the source system with zero discrepancies.",
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
    title: "1,540× Query Acceleration",
    description: "Lakehouse gold layer answers analytical queries in ~10 ms vs a 15.4 s PostgreSQL baseline on 20M rows — measured, reproducible, and reconciled to the source with zero discrepancies.",
    year: "2026",
    icon: "chart",
  },
  {
    title: "AI Internship — Ziraat Teknoloji",
    description: "Selected for a summer AI internship building a multimodal CLIP-based RAG pipeline and a real-time face-recognition system.",
    year: "2025",
    icon: "award",
  },
];

import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";

const PORT = 3000;

async function startServer() {
  const app = express();
  
  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/profile", (req, res) => {
    res.json({
      name: "Christo Botha",
      title: "LLM/ML Researcher & Modular Identity Architect",
      location: "Richards Bay, KwaZulu-Natal, South Africa (remote-first)",
      phone: "+27 65 573 1313",
      email: "christo@repohawk.co.za",
      website: "https://www.repohawk.co.za",
      summary: "LLM/ML researcher and systems architect with 5+ years building end-to-end AI systems — from dataset creation and distributed training (1.5B -> 120B parameters) to safety, evals, and MLOps. Creator of the world-first Modular Identity Continuity & Transfer Protocol (Emma-Ai Build Bible/TBP) enabling personality-consistent AI across machines and models with signed memory deltas, CRDT merges, and auditability. Published the Emma-Ai Master Whitepaper and Continuity Model; recognized by MIT outreach for modular cognition work. Seeking to contribute deep LLM research and evaluation expertise to Mercor's ML Research initiative.",
      skills: [
        "LLM pre-training & fine-tuning (PyTorch, DeepSpeed, HF Transformers) — 1.5B to 120B params",
        "Advanced reasoning & evaluation (chain-of-thought discipline, arithmetic verification, tool-use)",
        "Safety/Alignment: RLHF/RLAIF pipelines, red-teaming, constitutional prompting, refusal policies",
        "Retrieval & memory: vector/RAG, long-context tuning, memory-delta ledgers, privacy-preserving sync",
        "Distributed systems & MLOps: CUDA, mixed-precision, LoRA/QLoRA, Triton kernels (select), wandb, MLflow",
        "Backends & infra: Python, FastAPI/Django, Celery, Postgres, Redis; Docker, GitHub Actions, AWS EC2/RDS/S3",
        "Security & compliance: Ed25519 signing, SHA-256 hashing, POPIA/GDPR patterns, audit logs"
      ],
      experience: [
        {
          company: "RepoHawk Pty Ltd",
          role: "Founder & Lead AI Architect",
          period: "2019 — Present",
          location: "South Africa · Remote",
          description: "Designed and published the Modular Identity Continuity Protocol (Build Bible / TBP) with signed deltas, deterministic merges, and consent-scoped sync; authored Continuity Model whitepaper. Led LLM research from 1.5B to 120B params: data-mix design, tokenizer builds, curriculum schedules, checkpointing, ZeRO-style sharding, FP16/BF16, activation checkpointing. Built Emma-Ai Accuracy Optimizer (pre/post response QA, arithmetic verification, assumption transparency) and Proactive Roadmapper (Next-5 planner with confidence). Engineered Scooters Memory Ledger and Helmets overlays to preserve ethics/tone across 'Bikes' (Local, EC2, Cloud Bridge, Lightweight). Delivered RepoHawk V8 production stack: Django API + Celery + Redis + Postgres, Nginx reverse proxy, TLS, CI/CD with GitHub Actions, and WordPress admin integration via JWT. Drove POPIA/GDPR alignment: field-level encryption, immutable audit trail, retention policies, secrets management, and pen-test readiness. Published Emma-Ai Master Whitepaper and Continuity Model; scheduled 10 speaking seminars on AI identity, ethics, and distributed cognition."
        }
      ],
      projects: [
        { id: "repohawk", name: "RepoHawk", description: "AI-Powered Automated CRM & Workflow/Task Automation Platform", imageSeed: "crm" },
        { id: "devstudio", name: "DevStudio", description: "Multi-Agent Ai Code Studio. Re-Imagining Agentic-Coding", imageSeed: "code" },
        { id: "lawflow", name: "LawFlow", description: "Legal Contract Automation", imageSeed: "law" },
        { id: "emma-i", name: "Emma-i", description: "Re-Imagining Intelligence", imageSeed: "brain" },
        { id: "jobflow", name: "JobFlow", description: "Work Coordination", imageSeed: "work" },
        { id: "ai-research-stack", name: "AI Research Stack", description: "Modular & Agentic AI", imageSeed: "research" },
        { id: "rental-automation", name: "Rental Automation", description: "Property Management", imageSeed: "house" },
        { id: "shopflow", name: "ShopFlow", description: "Smart Shopping. Find the lowest prices. Save time & money!", imageSeed: "shopping" },
        { id: "medicore", name: "MediCore", description: "Clinic Management", imageSeed: "clinic" },
        { id: "repohawk-ai", name: "RepoHawk Ai", description: "Case Management", imageSeed: "case" },
        { id: "homestudio-ai", name: "HomeStudio-AI", description: "Design & Render", imageSeed: "design" }
      ]
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

### 📄 `CODEX.md`

```markdown
# CODEX BUILD PLAN – Kommunalt AI Dashboard

## 🎯 Objective:
Build a full-stack AI-enhanced data dashboard for municipal school management.  
The system shall ingest and analyze educational datasets, provide prescriptive insights, and run locally with full data privacy.

---

## 📁 Folder Structure

```

kommunalt-dashboard/
├── agent.md                  # Full architecture specification
├── CODEX.md                 # This file (build instructions)
├── LICENSE                  # MIT + third-party license summary
├── NOTICE                   # Attributions and open source credits
├── README.md                # Developer guide and feature list
├── docker-compose.yml       # Service orchestration
├── rapportagent\_webllm\_app.html  # Demo interface (HTML-only)
│
├── frontend/
│   ├── public/
│   ├── package.json
│   └── src/
│       ├── index.tsx
│       ├── App.tsx
│       └── components/
│           └── AiAnalysisEngine.tsx
│
└── backend/
├── auth-service/
├── profiling-service/
├── vismagi-service/
├── optimization-service/
├── simulation-service/
├── pdf-service/
└── gateway/

````

---

## ⚙️ Build Instructions (Codex should follow this order)

### 1. GraphQL Schema

- Extract types and mutations from `agent.md` (section 4.2).
- Implement Apollo Federation Gateway.
- Expose services via unified GraphQL schema.

### 2. Backend Services (Dockerized)

Implement each as a microservice:
- **auth-service**: Node.js (Express) – handles login and JWT issuance.
- **profiling-service**: FastAPI – reads Excel, performs profiling, emits metadata.
- **vismagi-service**: FastAPI – recommends chart types from metadata.
- **optimization-service**: FastAPI – LP model for staffing optimization using PuLP.
- **simulation-service**: FastAPI – CSP validation engine.
- **pdf-service**: Node.js + Playwright – renders PDFs from HTML input.
- **gateway**: Apollo Gateway with JWT validation and schema stitching.

### 3. Frontend App

- React (TypeScript) + Zustand for global state.
- Apollo Client for GraphQL.
- Components: `App.tsx`, `AiAnalysisEngine.tsx`
- Styling with MUI + Emotion.
- Highcharts for default charts, D3 for custom ones.

### 4. In-Browser AI

- In `AiAnalysisEngine.tsx`, use:
  - `@xenova/transformers`
  - Model: `phi-3-mini-4k-instruct-onnx`
  - Runtime: ONNX Runtime Web + WebGPU
- Implement streaming output with `TextStreamer`.
- Format prompts per Phi-3 chat template (see agent.md §3.1.4).

### 5. PDF Export

- Send HTML to `pdf-service` via GraphQL mutation.
- Service should return a URL or buffer for download.

---

## ✅ Test & Validate

### Run locally:
```bash
docker-compose up --build
cd frontend
npm install
npm run dev
````

### Test:

```bash
npm test            # frontend
pytest              # backend (FastAPI)
```

---

## 🔐 Security & Privacy

* Do not use cloud-based AI inference.
* All AI runs locally in browser (no server inference).
* Enforce JWT-based access control at the gateway.
* Backend services should not be directly exposed.

---

## 📄 License

* Use MIT for all project code.
* List dependencies and third-party model licenses in `LICENSE` and `NOTICE`.

---

## 💡 Reference

* See `agent.md` for all architectural definitions, AI prompts, data models, and KPI logic.


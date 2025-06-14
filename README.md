# 📘 Municipal AI Dashboard for Schools – README

## Overview
This repository contains the full source code and architecture for a modular, AI-enhanced data dashboard designed for use in Norwegian municipalities. The system supports local school administrators by providing automated insights, staffing recommendations, and intelligent simulations – all powered by microservices and a fully local AI engine.

The frontend is built in React and communicates with a set of containerized backend microservices via a federated GraphQL API. All sensitive analysis is handled locally in the browser using a small, optimized LLM (Phi-3-mini) via ONNX Runtime Web.

---

## ✨ Key Features

- 📊 Upload & Analyze School Data (Excel files)
- 📈 Visualization Recommendations ("Vis magi")
- 🧠 In-browser AI report generation (Phi-3 SLM)
- 🛠️ Prescriptive Analytics via Linear Programming
- 🔄 Interactive Scenario Simulation with Constraints
- 🧾 PDF Report Export
- 🔐 JWT-authenticated multi-tenant access (17 schools)
- 🚫 No cloud-based inference – full privacy compliance

---

## 🧱 Technology Stack

### Frontend
- React + Zustand + Apollo Client
- Material UI + Emotion CSS-in-JS
- Highcharts + D3 for visualization
- Transformers.js + ONNX Runtime Web for local AI

### Backend
- FastAPI (Python) for analysis & simulation
- Express.js (Node.js) for auth and PDF rendering
- Apollo Federation Gateway (GraphQL)
- Docker & docker-compose

---

## 📂 Project Structure

```
kommunalt-dashboard/
├── agent.md                  # Full architecture spec (used by Codex)
├── CODEX.md                 # Build instructions for Codex CLI
├── README.md                # This file
├── docker-compose.yml       # Full service orchestration
├── rapportagent_webllm_app.html  # Standalone browser demo
│
├── frontend/
│   ├── public/
│   ├── package.json
│   └── src/
│       ├── App.tsx
│       ├── index.tsx
│       └── components/
│           └── AiAnalysisEngine.tsx
│
├── backend/
│   ├── auth-service/
│   ├── profiling-service/
│   ├── vismagi-service/
│   ├── optimization-service/
│   ├── simulation-service/
│   ├── pdf-service/
│   └── gateway/
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- Docker & Docker Compose
- A Chromium-based browser with WebGPU (e.g. Chrome, Edge)

### Installation
```bash
# Start backend services
docker-compose up --build

# Run frontend app
cd frontend
npm install
npm run dev
```

### Demo
```bash
# Open in browser
http://localhost:3000
```

---

## 🤖 AI Integration
- **Model**: `microsoft/phi-3-mini-4k-instruct-onnx`
- **Engine**: `@xenova/transformers` + ONNX Runtime Web
- **Execution**: 100% in-browser with WebGPU
- **Security**: No server communication required for inference

---

## ✅ Tests
- Frontend: `jest` + `react-testing-library`
- Backend: `pytest`, `supertest`
- Linting & Formatting: ESLint, Prettier

---

## 📄 License
This project is licensed under the MIT License. See `LICENSE` for details.

---

## 📬 Contact
For contributions, questions, or issues – please open a GitHub Issue or contact the repository maintainer.

---

## 🧠 Built With
- Public Sector Innovation in mind
- AI-first principles
- Privacy and accessibility as defaults

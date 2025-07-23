# 📁 Struktur

## Root
- `backend/` – mikrotjenestene (FastAPI + Node)
- `frontend/` – React/TypeScript-klient
- `docker-compose.yml` – starter alle tjenester
- Shellskript (`run-all.sh`, `build-check.sh`, `test.sh`)

## Backend-tjenester
- `auth-service/`
- `profiling-service/`
- `vismagi-service/`
- `optimization-service/`
- `simulation-service/`
- `pdf-service/`
- `reporting-service/`
- `gateway/`
- `shared/` – felles modeller/sikkerhet/logging

## Frontend
- `src/` inneholder React-komponenter og hooks
  - `App.tsx` – hoveddashboard
  - `AiAnalysisEngine.tsx` – kjører Phi‑3 lokalt i browser
  - `views/CompareView.tsx` mm.

# 🧩 Komponenter

## Microservices
- **auth-service**: FastAPI som utsteder JWT. Tests i `tests/test_auth_main.py`.
- **profiling-service**: mottar Excel-fil, bruker Pandas for profilering.
- **vismagi-service**: gir diagram-anbefalinger basert på dataset metadata.
- **optimization-service**: løser LP med PuLP for bemanningsforslag.
- **simulation-service**: validerer scenarier og rapporterer brudd.
- **pdf-service**: Node/Playwright genererer PDF (Python-versjon finnes men brukes ikke i Docker).
- **reporting-service**: samler data fra andre tjenester og returnerer PDF.
- **gateway**: Apollo Server (Node) som eksponerer GraphQL API.
- **shared**: Pydantic-modeller, auth-utility og observability setup.

## Frontend
- React-klient som kommuniserer med `/graphql` via Apollo Client.
- Bruker Zustand for tilstand, Tailwind/MUI for UI.
- Innebygget AI-komponent (Phi‑3 via `@xenova/transformers`).

# 🔗 Avhengigheter

- Frontend → Gateway (`/graphql`)
- Gateway → auth-, profiling-, vismagi-, optimization-, simulation-, pdf- og reporting-service via HTTP.
- Reporting-service → optimization-service, vismagi-service, pdf-service.
- Alle Python-tjenester deler `backend.shared.*`-moduler.
- Docker Compose starter alle tjenestene og Jaeger for tracing.

# ⚠️ Mulige feil eller svakheter

1. **Manglende felleskode i Docker-image**
   - Alle Dockerfiles bygger kun fra sin egen mappe. `backend.shared` kopieres ikke inn, så `import backend.shared...` vil feile når containeren kjøres.
2. **Inkonsistent PDF-service**
   - Dockerfilen kjører Node-varianten (`index.js`), men prosjektet har også `main.py` og tests mot denne. Ulik implementasjon kan skape forvirring.
3. **Autorisasjon i reporting-service**
   - `generate_report` sender `Authorization: Bearer {user}` videre til andre tjenester i stedet for JWT-tokenet. Disse tjenestene forventer et gyldig token og vil svare 401.
4. **Frontend/GraphQL mismatch**
   - `ChartPanel` forventer at `xAxis` og `yAxis` er arrays, men Gateway-resolvere returnerer kun strenger. Datastrukturen stemmer ikke overens.
5. **Delvis dupliserte filer**
   - Flere tjenester har `main.py` men Docker kjører Node (gateway og pdf-service). Kan føre til at tester og produksjonskjøring ikke matcher.
6. **Manglende inkludering av `backend/__init__.py` i pakkestruktur**
   - Ved kjøring utenfor repoets rot kan modulen `backend.shared` bli utilgjengelig hvis PYTHONPATH ikke settes.

# 💡 Anbefalt strukturforbedring

- Flytt `backend/shared` inn i hvert Docker-image eller gjør `backend` til et installérbart Python‑pakke som bygges før mikroservice-images.
- Rydd opp i pdf-service: velg enten Node eller Python for produksjon og tests.
- I `reporting-service`, videresend JWT-tokenet (`authorization` header) i stedet for brukernavnet.
- Harmoniser GraphQL-skjemaet med frontendens forventninger (arrays for `xAxis`/`yAxis` om nødvendig).
- Vurder å samle gateway‑funksjonaliteten (Node vs Python) til én implementasjon for enkelhet.

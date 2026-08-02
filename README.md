# MERIDIAN — Cold Case Intelligence Platform

**MERIDIAN** is an enterprise AI-powered Cold Case Intelligence Platform designed for police investigators, crime analysts, and law enforcement command staff. 

It analyzes newly ingested cold case files, cross-references them against historical criminal databases across multi-decadal timelines, uncovers hidden entity relationships (using NetworkX graphs), identifies recurring Modus Operandi (MO) signatures (using a 7-agent LangGraph workflow), and outputs automated reopening priority scores and official intelligence reports.

---

## 🏛️ Project Architecture

```
meridian-cold-case/
├── backend/
│   ├── agents/
│   │   └── graph_workflow.py     # 7-Agent LangGraph Pipeline Implementation
│   ├── mock_data/
│   │   └── database.json         # 20 Historical Cold Cases, 100+ Entities, Graphs
│   ├── routes/
│   │   └── api_routes.py         # Flask REST API endpoints
│   ├── services/
│   │   ├── db_service.py         # Swappable Data Access Layer (JSON -> Postgres / Mongo)
│   │   └── graph_service.py      # NetworkX Centrality & Graph Construction Engine
│   ├── main.py                   # Flask App Entrypoint (Port 5000)
│   └── requirements.txt          # Python Dependencies
│
└── frontend/
    ├── src/
    │   ├── components/           # Sidebar, Header, KPI Cards, React Flow Custom Nodes, Ingest Modal
    │   ├── pages/                # Dashboard, Cases, Evidence, AI Analysis, Graph, Timeline, Patterns, Report
    │   ├── services/             # Axios API Client Wrapper
    │   ├── styles/               # Glassmorphism & Dark Intelligence Theme Tokens
    │   ├── utils/                # CSV & PDF Export Utilities
    │   ├── App.jsx               # React Router Navigation Root
    │   └── main.jsx              # React 19 Client Entrypoint
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🤖 Multi-Agent LangGraph Pipeline

1. **Evidence Processing Agent**: Extracts entities (suspects, vehicles, addresses, phones), normalizes forensic logs, and performs OCR text parsing.
2. **Case Similarity Agent**: Computes vector & attribute similarity scores against the historical cold case repository.
3. **Evidence Correlation Agent**: Constructs cross-case relationship networks using NetworkX.
4. **Timeline Reconstruction Agent**: Merges multi-decade crime events and chronologically orders incidents from 1994 to 2025.
5. **Pattern Discovery Agent**: Detects recurring MO signatures, getaway vehicles (e.g., 1991 Dark Blue Ford Econoline Van), burner phone lines, and syndicate storage hubs (4400 S Pulaski Rd, Chicago).
6. **Recommendation Agent**: Calculates cold case reopening priority indices (0-100%) and confidence ratings.
7. **Investigation Summary Agent**: Synthesizes formal Law Enforcement Sensitive executive intelligence dossiers.

---

## 🚀 Quickstart & Installation Instructions

### 1. Backend Setup (Flask + LangGraph + NetworkX)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows (PowerShell):
.venv\Scripts\Activate.ps1
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start Flask Backend Server (Runs on http://localhost:5000)
python main.py
```

### 2. Frontend Setup (React 19 + Vite + Tailwind CSS + React Flow)

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite Development Server (Runs on http://localhost:5173)
npm run dev
```

---

## ⚡ API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Backend status & system version check |
| `GET` | `/api/cases` | Retrieve all 20 historical cold cases (supports `status`, `priority`, `search` parameters) |
| `GET` | `/api/cases/:id` | Fetch specific case dossier, evidence, and witness statements |
| `POST` | `/api/upload` | Ingest a new case file into the database |
| `POST` | `/api/analyze` | Execute the 7-agent LangGraph workflow for a selected case |
| `GET` | `/api/graph` | Fetch NetworkX graph nodes & edges formatted for React Flow |
| `GET` | `/api/timeline` | Fetch chronologically ordered timeline events (1994 - 2025) |
| `GET` | `/api/patterns` | Fetch discovered criminal patterns and recurring MO signatures |
| `GET` | `/api/report` | Generate full executive intelligence report for command staff |

---

## 🔒 Security Classification & Design

- **Dark Intelligence Theme**: Crafted using law enforcement dashboard standards (`#0D1016` background, `#161B22` card surfaces, `#C9902E` Accent Gold, `#3FA9A0` Accent Blue, and `#D15B5B` Accent Red).
- **Typography**: IBM Plex Sans & IBM Plex Mono for high data density readability.
- **Exporting**: Supports one-click CSV export and high-resolution PDF printing for court proceedings and joint taskforce command briefings.

# DealDNA: Next.js + Python (FastAPI) + JSON Starter Kit

Yeh folder aapke **DealDNA (Real Estate Revenue Experimentation + Intervention OS)** project ka ready-to-run **Next.js + Python FastAPI + JSON** starter codebase hai.

---

## Folder Structure

```text
deal-dna-starter/
├── backend/                  # Python FastAPI + Local JSON Data Store
│   ├── app/
│   │   ├── data/             # Ready-to-use JSON files (No DB required!)
│   │   │   ├── deals.json          (10 synthetic deals)
│   │   │   ├── events.json         (Chronological deal journey events)
│   │   │   ├── interventions.json  (Recommended actions & checklists)
│   │   │   ├── experiments.json    (A/B experiments & conversion lift)
│   │   │   └── screens.json        (All 20 DealDNA screen specifications)
│   │   ├── models/           # Pydantic data schemas (deal.py, intervention.py)
│   │   ├── routers/          # API Endpoints (dashboard.py, deals.py, experiments.py)
│   │   └── main.py           # FastAPI entry point with CORS enabled
│   └── requirements.txt
│
└── frontend/                 # Next.js 14 (App Router) + TypeScript + Tailwind CSS
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/login/page.tsx       # Screen 01
    │   │   ├── dashboard/page.tsx          # Screen 02 (Command Center)
    │   │   ├── revenue-risk/page.tsx       # Screen 03 (Interactive Deals Table)
    │   │   ├── portfolio-health/page.tsx   # Screen 04
    │   │   ├── deals/[id]/page.tsx         # Screens 05, 06, 07 (Details, Timeline, Root Cause)
    │   │   ├── interventions/page.tsx      # Screens 08, 09, 10, 15 (Closed-loop workflow)
    │   │   ├── experiments/page.tsx        # Screens 11, 12, 13 (Experiment Lab)
    │   │   ├── revenue-impact/page.tsx     # Screen 14
    │   │   ├── properties/page.tsx         # Screen 17
    │   │   ├── reports/page.tsx            # Screens 18, 19
    │   │   ├── settings/page.tsx           # Screen 20
    │   │   └── screens/[screenId]/page.tsx # Dynamic viewer for all 20 screens (01 to 20)
    │   ├── components/
    │   │   ├── Sidebar.tsx                 # Left Navigation + 20-Screen Quick Switcher
    │   │   ├── MetricCard.tsx              # Top KPI Cards
    │   │   └── RightRailInsight.tsx        # DealDNA Insight + Next Step Panel
    │   └── lib/api.ts                      # Fetch helper with automatic offline fallback
    ├── package.json
    └── tailwind.config.js
```

---

## Kaise Run Karein? (How to Run Locally)

### Step 1: Python FastAPI Backend Start Karein
Terminal 1 kholein aur `backend` folder mein jayein:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- Backend live ho jayega: `http://localhost:8000`
- Interactive Swagger API Docs dekhein: `http://localhost:8000/docs`

### Step 2: Next.js Frontend Start Karein
Terminal 2 kholein aur `frontend` folder mein jayein:
```bash
cd frontend
npm install
npm run dev
```
- Browser mein kholein: `http://localhost:3000`

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import dashboard, deals, experiments

app = FastAPI(
    title="DealDNA API",
    description="Real Estate Revenue Experimentation + Intervention OS Backend (JSON Storage)",
    version="1.0.0"
)

# Allow all origins for seamless live deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router)
app.include_router(deals.router)
app.include_router(experiments.router)

@app.get("/")
def root():
    return {
        "app": "DealDNA Backend API",
        "status": "Running",
        "docs": "/docs"
    }

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.api import auth, deals, users
from app.database import engine, Base
from datetime import datetime
import logging

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Dreamery Backend API",
    description="Custom JWT Authentication Backend for Dreamery",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", "*.dreamery.com"]
)

# Include routers
app.include_router(auth.router)
app.include_router(deals.router)
app.include_router(users.router)

@app.get("/")
async def root():
    return {"message": "Dreamery Backend API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logging.error(f"Global exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

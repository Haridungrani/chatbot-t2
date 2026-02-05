from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

# Load environment variables
load_env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(load_env_path)

# Import routers
from app.auth.routes import router as auth_router
from app.chatbot.routes import router as chatbot_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    print("🚀 Starting FastAPI server...")
    print(f"📊 Hasura endpoint: {os.getenv('HASURA_GRAPHQL_ENDPOINT')}")
    yield
    print("👋 Shutting down FastAPI server...")

# Create FastAPI app
app = FastAPI(
    title="Chatbot API",
    description="Authentication and Chatbot API with Hasura GraphQL",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(chatbot_router, prefix="/chatbot", tags=["Chatbot"])

# Health check endpoint
@app.get("/")
async def root():
    """Root endpoint - health check"""
    return {
        "status": "ok",
        "message": "Chatbot API is running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "connected",
        "hasura": os.getenv("HASURA_GRAPHQL_ENDPOINT")
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=os.getenv("BACKEND_HOST", "0.0.0.0"),
        port=int(os.getenv("BACKEND_PORT", 8000)),
        reload=os.getenv("BACKEND_RELOAD", "true").lower() == "true"
    )

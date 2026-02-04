from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from datetime import timedelta
from sqlalchemy.orm import Session

from database import init_db, get_db
from models import User as UserModel
from schemas import UserCreate, UserLogin, AuthResponse, User
from auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
    validate_password_length,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize database
    print("Initializing database...")
    init_db()
    print("Database initialized successfully!")
    yield
    # Shutdown: cleanup if needed
    print("Shutting down...")

app = FastAPI(
    title="ChatBot Authentication API",
    description="FastAPI + PostgreSQL + JWT Authentication",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "message": "ChatBot Authentication API",
        "endpoints": {
            "signup": "auth/signup",
            "login": "auth/login",
            "me": "auth/me"
        },
        "status": "running"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Authentication Endpoints
@app.post("/api/auth/signup", response_model=AuthResponse)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Validate password length
    validate_password_length(user_data.password)
    
    # Check if user already exists
    existing_user = db.query(UserModel).filter(
        (UserModel.email == user_data.email) | (UserModel.username == user_data.username)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    db_user = UserModel(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email},
        expires_delta=access_token_expires
    )
    
    return AuthResponse(
        token=access_token,
        user=User(
            id=db_user.id,
            email=db_user.email,
            username=db_user.username,
            created_at=db_user.created_at
        )
    )

@app.post("/api/auth/login", response_model=AuthResponse)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return token"""
    # Find user
    user = db.query(UserModel).filter(UserModel.email == user_data.email).first()
    
    if not user:
        print(f"Login failed: User not found with email {user_data.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    print(f"Login attempt for user: {user.email}")
    if not verify_password(user_data.password, user.hashed_password):
        print(f"Login failed: Password verification failed for {user.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    
    return AuthResponse(
        token=access_token,
        user=User(
            id=user.id,
            email=user.email,
            username=user.username,
            created_at=user.created_at
        )
    )

@app.get("/api/auth/me", response_model=User)
def get_me(current_user: UserModel = Depends(get_current_user)):
    """Get current authenticated user"""
    return User(
        id=current_user.id,
        email=current_user.email,
        username=current_user.username,
        created_at=current_user.created_at
    )
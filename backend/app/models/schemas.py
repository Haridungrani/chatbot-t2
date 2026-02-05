from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime
import uuid

# ================================
# Authentication Schemas
# ================================

class UserSignup(BaseModel):
    """User signup request"""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    full_name: Optional[str] = Field(None, max_length=255)
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one digit')
        if not any(char.isalpha() for char in v):
            raise ValueError('Password must contain at least one letter')
        return v

class UserLogin(BaseModel):
    """User login request"""
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    """JWT token response"""
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserResponse(BaseModel):
    """User data response"""
    id: str
    email: str
    full_name: Optional[str]
    is_active: bool
    created_at: datetime

# ================================
# FAQ Schemas
# ================================

class FAQCreate(BaseModel):
    """Create FAQ request"""
    question: str = Field(..., min_length=5, max_length=1000)
    answer: str = Field(..., min_length=5, max_length=5000)
    category: Optional[str] = Field(None, max_length=100)
    is_published: bool = True

class FAQUpdate(BaseModel):
    """Update FAQ request"""
    question: Optional[str] = Field(None, min_length=5, max_length=1000)
    answer: Optional[str] = Field(None, min_length=5, max_length=5000)
    category: Optional[str] = Field(None, max_length=100)
    is_published: Optional[bool] = None

class FAQResponse(BaseModel):
    """FAQ response"""
    id: str
    question: str
    answer: str
    category: Optional[str]
    created_by: Optional[str]
    created_at: datetime
    updated_at: datetime
    is_published: bool

# ================================
# Chatbot Schemas
# ================================

class ChatMessage(BaseModel):
    """Chat message request"""
    message: str = Field(..., min_length=1, max_length=2000)
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    """Chat response"""
    id: str
    message: str
    response: str
    session_id: str
    created_at: datetime

# ================================
# Error Response Schema
# ================================

class ErrorResponse(BaseModel):
    """Error response"""
    detail: str
    status_code: int

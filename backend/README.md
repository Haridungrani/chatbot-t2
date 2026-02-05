# ✅ FastAPI Backend - Complete Setup

## 🎉 Backend Structure Created

### Files Created:
```
backend/
├── main.py                          # FastAPI app entry point
├── requirements.txt                 # Python dependencies  
├── start.bat                        # Windows startup script
├── app/
│   ├── __init__.py
│   ├── auth/
│   │   ├── __init__.py
│   │   ├── routes.py               # Login/Signup endpoints
│   │   ├── jwt_handler.py          # JWT token management
│   │   └── utils.py                # Password hashing (bcrypt)
│   ├── chatbot/
│   │   ├── __init__.py
│   │   └── routes.py               # Chatbot endpoints
│   ├── graphql/
│   │   ├── __init__.py
│   │   └── client.py               # Hasura GraphQL client
│   └── models/
│       ├── __init__.py
│       └── schemas.py              # Pydantic models
```

---

## 🚀 How to Start the Server

### Option 1: Using the Script (Easiest)
```bash
cd backend
.\start.bat
```

### Option 2: Manual Command
```bash
cd backend
.\.venv\Scripts\Activate.ps1
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Option 3: Direct Python Command (Always Works)
```bash
cd backend
.\.venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 🌐 API Endpoints

### Base URL
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs (Swagger UI)
- **ReDoc**: http://localhost:8000/redoc

### Authentication Endpoints

#### 1. **Signup** - Create New User
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepass123",
  "full_name": "John Doe"
}

Response: 201 Created
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "is_active": true
  }
}
```

#### 2. **Login** - Authenticate User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepass123"
}

Response: 200 OK
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": { ... }
}
```

#### 3. **Get Current User**
```http
GET /auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "created_at": "2026-02-05T10:00:00Z"
}
```

#### 4. **Verify Token**
```http
POST /auth/verify
Authorization: Bearer <token>

Response: 200 OK
{
  "valid": true,
  "user_id": "uuid",
  "email": "user@example.com",
  "expires_at": 1738752000
}
```

### Chatbot Endpoints

#### 5. **Send Message**
```http
POST /chatbot/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Hello, how are you?",
  "session_id": "optional-session-id"
}

Response: 200 OK
{
  "id": "uuid",
  "message": "Hello, how are you?",
  "response": "Hello! How can I help you today?",
  "session_id": "uuid",
  "created_at": "2026-02-05T10:00:00Z"
}
```

#### 6. **Get Chat History**
```http
GET /chatbot/history?session_id=<session_id>&limit=50
Authorization: Bearer <token>

Response: 200 OK
{
  "messages": [...],
  "count": 10
}
```

### Health Check

```http
GET /health

Response: 200 OK
{
  "status": "healthy",
  "database": "connected",
  "hasura": "http://localhost:8080/v1/graphql"
}
```

---

## 🧪 Testing with curl

### Signup
```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456","full_name":"Test User"}'
```

### Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456"}'
```

### Send Chat Message (replace TOKEN)
```bash
curl -X POST http://localhost:8000/chatbot/chat \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello chatbot!"}'
```

---

## 🔑 Features Implemented

### ✅ Authentication
- [x] User signup with email validation
- [x] Password hashing using bcrypt
- [x] JWT token generation with Hasura claims
- [x] Login with password verification
- [x] Token verification endpoint
- [x] Get current user endpoint
- [x] Password strength validation (min 8 chars, 1 digit, 1 letter)

### ✅ Hasura Integration
- [x] GraphQL client for Hasura
- [x] User CRUD operations via GraphQL
- [x] Chat message storage via GraphQL
- [x] JWT claims for Hasura permissions
- [x] Admin secret authentication

### ✅ Chatbot
- [x] Chat message endpoint
- [x] Message/response storage
- [x] Session management
- [x] Chat history retrieval
- [x] Basic response generation (ready for AI integration)

### ✅ Security
- [x] CORS middleware configured
- [x] JWT token authentication
- [x] Password hashing with bcrypt
- [x] HTTPBearer security scheme
- [x] Environment variable configuration

---

## 🔧 Configuration

All configuration is in `.env` file in project root:

```env
# Hasura
HASURA_GRAPHQL_ENDPOINT=http://localhost:8080/v1/graphql
HASURA_ADMIN_SECRET=chatbot_admin_secret_2026

# JWT
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production-32chars
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# Backend
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
BACKEND_RELOAD=true
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

---

## 📚 Next Steps

1. **Test the API**: http://localhost:8000/docs
2. **Test Authentication Flow**:
   - Create a user (signup)
   - Login to get token
   - Use token to access chatbot
3. **Integrate AI/LLM** (Optional):
   - OpenAI GPT API
   - Anthropic Claude API
   - Local LLM model
   - Current: Simple rule-based responses

---

## 🐛 Troubleshooting

### uvicorn command not found
Use one of these instead:
- `python -m uvicorn main:app --reload`
- `.\.venv\Scripts\python.exe -m uvicorn main:app --reload`

### Module not found errors
Reinstall dependencies:
```bash
pip install -r requirements.txt
```

### Can't connect to Hasura
- Check Hasura is running: `docker-compose ps`
- Verify endpoint in `.env`: http://localhost:8080/v1/graphql
- Check admin secret matches

---

**Backend is ready! Start building the Next.js frontend next!** 🚀

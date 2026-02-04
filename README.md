# ChatBot Authentication System

Full-stack authentication application with JWT, GraphQL, FastAPI, PostgreSQL, and Next.js.

## Backend Setup

### Prerequisites
- Python 3.8+
- PostgreSQL database running
- Virtual environment (venv already created)

### Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Activate virtual environment:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
- Update `.env` file with your PostgreSQL credentials
- Default: `postgresql://postgres:postgres@localhost:5432/chatbot_db`
- Change `SECRET_KEY` in production

5. Create PostgreSQL database:
```sql
CREATE DATABASE chatbot_db;
```

6. Run the server:
```bash
uvicorn main:app --reload
```

Backend will run at: http://localhost:8000
GraphQL endpoint: http://localhost:8000/graphql

## Frontend Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

Frontend will run at: http://localhost:3000

## Features

### Backend
- ✅ FastAPI REST API
- ✅ GraphQL API with Strawberry
- ✅ JWT Authentication
- ✅ Bcrypt password hashing
- ✅ PostgreSQL database with SQLAlchemy
- ✅ User registration and login
- ✅ Protected routes

### Frontend
- ✅ Next.js 16 with App Router
- ✅ TypeScript
- ✅ Tailwind CSS v4
- ✅ Apollo Client for GraphQL
- ✅ JWT token management with cookies
- ✅ Login/Signup pages
- ✅ Protected dashboard
- ✅ Auth context provider

## API Endpoints

### GraphQL Mutations
```graphql
# Sign up
mutation Signup {
  signup(email: "user@example.com", username: "johndoe", password: "password123") {
    token
    user {
      id
      email
      username
      createdAt
    }
  }
}

# Login
mutation Login {
  login(email: "user@example.com", password: "password123") {
    token
    user {
      id
      email
      username
      createdAt
    }
  }
}
```

### GraphQL Queries
```graphql
# Get current user (requires Authorization header)
query Me {
  me {
    id
    email
    username
    createdAt
  }
}
```

## Project Structure

```
backend/
├── main.py              # FastAPI app entry point
├── database.py          # PostgreSQL connection
├── models.py            # SQLAlchemy User model
├── schemas.py           # Pydantic schemas
├── auth.py              # JWT & bcrypt utilities
├── graphql_schema.py    # GraphQL schema
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables
└── venv/               # Virtual environment

frontend/
├── app/
│   ├── page.tsx         # Home page
│   ├── layout.tsx       # Root layout with providers
│   ├── login/
│   │   └── page.tsx     # Login page
│   ├── signup/
│   │   └── page.tsx     # Signup page
│   └── dashboard/
│       └── page.tsx     # Protected dashboard
├── lib/
│   ├── apollo-client.ts # Apollo Client config
│   ├── auth.ts          # Auth utilities
│   └── graphql-queries.ts # GraphQL queries
├── context/
│   └── AuthContext.tsx  # Auth state management
└── package.json         # Dependencies
```

## Usage

1. Start PostgreSQL database
2. Run backend: `uvicorn main:app --reload` (from backend folder)
3. Run frontend: `npm run dev` (from frontend folder)
4. Open http://localhost:3000
5. Create an account on signup page
6. Login with credentials
7. Access protected dashboard

## Technologies

**Backend:**
- FastAPI
- Strawberry GraphQL
- SQLAlchemy
- PostgreSQL
- JWT (python-jose)
- Bcrypt (passlib)

**Frontend:**
- Next.js 16
- React 19
- TypeScript
- Apollo Client
- Tailwind CSS v4
- js-cookie

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookie storage (recommended)
- Protected routes
- Token expiration (30 minutes default)
- CORS configuration

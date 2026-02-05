# 🤖 Chatbot Project - Hasura Setup Guide (Local PostgreSQL)

## 📋 Quick Setup Instructions

### Prerequisites
- **PostgreSQL** installed locally and running
- **Docker Desktop** installed and running
- **Docker Compose** v2.0+
- **psql** command-line tool (comes with PostgreSQL)
- **Windows PowerShell**

---

## 🚀 Step-by-Step Setup

### 1️⃣ Prepare Your Local PostgreSQL

Ensure PostgreSQL is running:
```powershell
# Check PostgreSQL service status
Get-Service -Name postgresql*

# Start if not running
Start-Service postgresql-x64-<version>
```

**Update .env file** with your PostgreSQL password:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/chatbot_db
POSTGRES_PASSWORD=YOUR_PASSWORD
```

### 2️⃣ Create Database and Tables

Run the automated setup script:

```powershell
# Option 1: Use default settings (user: postgres, password: postgres)
.\setup_database.ps1

# Option 2: Specify your credentials
.\setup_database.ps1 -PostgresUser "postgres" -PostgresPassword "your_password" -DatabaseName "chatbot_db"
```

**Or manually with psql:**
```powershell
# Create database
psql -U postgres -c "CREATE DATABASE chatbot_db;"

# Run setup script
psql -U postgres -d chatbot_db -f database\setup_local.sql
```

**What This Does:**
- ✅ Creates `chatbot_db` database
- ✅ Creates 3 tables: `users`, `faqs`, `chat_messages`
- ✅ Creates indexes for performance
- ✅ Sets up auto-update triggers
- ✅ Inserts 5 sample FAQ records

### 3️⃣ Start Hasura & Adminer

```powershell
# Start Hasura GraphQL Engine and Adminer
docker-compose up -d
```

**What This Does:**
- ✅ Starts Hasura GraphQL Engine (connects to your local PostgreSQL)
- ✅ Starts Adminer (database management UI)

### 4️⃣ Verify Services Are Running

```powershell
# Check container status

---

## 🌐 Access Your Services

| Service | URL | Credentials |
|---------|-----|-------------|
| **Hasura Console** | http://localhost:8080 | Admin Secret: `chatbot_admin_secret_2026` |
| **Adminer (DB UI)** | http://localhost:8081 | Server: `host.docker.internal`<br>Username: `postgres`<br>Password: `your_postgres_password`<br>Database: `chatbot_db` |
| **PostgreSQL** | localhost:5432 | Your local PostgreSQL credentials |
- `chatbot_adminer` (Database UI)

| Service | URL | Credentials |
|---------|-----|-------------|
| **Hasura Console** | http://localhost:8080 | Admin Secret: `chatbot_admin_secret_2026` |
| **Adminer (DB UI)** | http://localhost:8081 | Server: `postgres`<br>Username: `postgres`<br>Password: `postgres_password`<br>Database: `chatbot_db` |
| **PostgreSQL** | localhost:5432 | Same as above |

### 🔐 Hasura Console Access

1. Open http://localhost:8080
2. Enter admin secret: `chatbot_admin_secret_2026`
3. You'll see the Hasura Console with GraphQL API ready!

---

## 🗄️ Database Schema

### Tables Created:

#### 1. **users**
- `id` (UUID, Primary Key)
- `email` (VARCHAR, Unique)
- `password_hash` (VARCHAR) - For bcrypt hashed passwords
- `full_name` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `is_active` (BOOLEAN)

#### 2. **faqs**
- `id` (UUID, Primary Key)
- `question` (TEXT)
- `answer` (TEXT)
- `category` (VARCHAR)
- `created_by` (UUID, Foreign Key → users)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `is_published` (BOOLEAN)

#### 3. **chat_messages**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → users)
- `message` (TEXT)
- `response` (TEXT)
- `session_id` (VARCHAR)
- `created_at` (TIMESTAMP)
- `metadata` (JSONB)

---

## 🧪 Testing Hasura GraphQL API

### Open GraphiQL Interface

1. Go to http://localhost:8080
2. Click on **"API"** tab
3. Try these sample queries:

#### Query 1: Get All FAQs
```graphql
query GetAllFAQs {
  faqs {
    id
    question
    answer
    category
    created_at
    is_published
  }
}
```

#### Query 2: Get FAQs by Category
```graphql
query GetFAQsByCategory {
  faqs(where: {category: {_eq: "General"}}) {
    id
    question
    answer
  }
}
```

#### Mutation 1: Create New FAQ (Requires Authentication)
```graphql
mutation CreateFAQ {
  insert_faqs_one(object: {
    question: "How do I contact support?"
    answer: "You can reach us at support@chatbot.com"
    category: "Support"
    is_published: true
  }) {
    id
    question
    answer
  }
}
```

---

## 🔑 JWT Authentication Setup

The Hasura JWT secret is already configured in docker-compose.yml:

```json
{
  "type": "HS256",
  "key": "your-super-secret-jwt-key-change-this-in-production-32chars"
}
```

### JWT Token Format for API Requests

When making authenticated requests, include this header:

```
Authorization: Bearer <YOUR_JWT_TOKEN>
```

The JWT payload should contain:
```json
{
  "sub": "user-uuid-here",
  "https://hasura.io/jwt/claims": {
    "x-hasura-allowed-roles": ["user", "anonymous"],
    "x-hasura-default-role": "user",
    "x-hasura-user-id": "user-uuid-here"
  }
}
```

---

## 🛡️ Permissions Configured

### **users** table:
- ✅ **anonymous**: Can insert (for signup)
- ✅ **user**: Can select/update own data only

### **faqs** table:
- ✅ **anonymous**: Can view published FAQs
- ✅ **user**: Can CRUD own FAQs, view all published FAQs

### **chat_messages** table:
- ✅ **user**: Full CRUD on own messages only

---

## 🔧 Useful Commands

### Start Services
```powershell
docker-compose up -d
```

### Stop Services
```powershell
docker-compose down
```

### Stop and Remove All Data
```powershell
docker-compose down -v
```

### View Logs
```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f hasura
docker-compose logs -f postgres
```

### Restart Services
```powershell
docker-compose restart
```

### Check Service Health
```powershell
docker-compose ps
```

### Access PostgreSQL CLI
```powershell
docker exec -it chatbot_postgres psql -U postgres -d chatbot_db
```

---

## 🔄 Apply Hasura Metadata (Optional)

If you need to update permissions or track new tables:

```powershell
# Using Hasura CLI (if installed)
hasura metadata apply --endpoint http://localhost:8080 --admin-secret chatbot_admin_secret_2026
```

---

## 🐛 Troubleshooting

### Problem: Containers won't start
```powershell
# Check Docker Desktop is running
# Remove old containers and volumes
docker-compose down -v
docker-compose up -d
```

### Problem: Port already in use
```powershell
# Check what's using the ports
netstat -ano | findstr :8080
netstat -ano | findstr :5432

# Kill the process or change ports in docker-compose.yml
```

### Problem: Database not initialized
```powershell
# Recreate database with fresh data
docker-compose down -v
docker-compose up -d
```

### Problem: Can't connect to Hasura Console
- Ensure Docker containers are running: `docker-compose ps`
- Check logs: `docker-compose logs hasura`
- Try accessing: http://localhost:8080/healthz

---

## 📊 Database Management Options

### Option 1: Adminer (Included)
- URL: http://localhost:8081
- Lightweight, web-based interface

### Option 2: pgAdmin (Optional)
Add to docker-compose.yml if you prefer pgAdmin

### Option 3: DBeaver / TablePlus
Connect directly:
- Host: localhost
- Port: 5432
- Database: chatbot_db
- Username: postgres
- Password: postgres_password

---

## 🔒 Security Notes

⚠️ **IMPORTANT FOR PRODUCTION:**

1. Change admin secret in docker-compose.yml
2. Change JWT secret key (must be 32+ characters)
3. Use strong PostgreSQL password
4. Don't commit .env file to git
5. Enable SSL/TLS for database connections
6. Restrict CORS origins in Hasura
7. Disable dev mode in Hasura
8. Use environment-specific secrets

---

## 📚 Next Steps

Now that Hasura is running:

1. ✅ **Backend**: Build FastAPI authentication endpoints
2. ✅ **Frontend**: Create Next.js pages and GraphQL client
3. ✅ **Integration**: Connect all pieces together

---

## 🆘 Need Help?

- **Hasura Docs**: https://hasura.io/docs/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Docker Docs**: https://docs.docker.com/

---

## ✅ Verification Checklist

- [ ] Docker Desktop is running
- [ ] Containers started successfully: `docker-compose ps`
- [ ] Can access Hasura Console: http://localhost:8080
- [ ] Can access Adminer: http://localhost:8081
- [ ] Can query FAQs in GraphiQL interface
- [ ] 5 sample FAQs are visible
- [ ] All 3 tables exist: users, faqs, chat_messages

---

**🎉 Congratulations! Your Hasura + PostgreSQL setup is complete!**

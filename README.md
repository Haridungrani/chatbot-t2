# ✅ Hasura Setup Complete - Next Steps

## 🎉 What's Been Created

### Docker Services (Running)
- ✅ **Hasura GraphQL Engine** - Running on http://localhost:8080
- ✅ **Adminer** (Database UI) - Running on http://localhost:8081
- ✅ **Configured for local PostgreSQL** (connects to host.docker.internal)

### Configuration Files
- ✅ **docker-compose.yml** - Updated for local PostgreSQL
- ✅ **.env** - Environment variables (UPDATE WITH YOUR PASSWORD!)
- ✅ **database/setup_local.sql** - Complete database schema
- ✅ **database/init.sql** - Original schema (for reference)
- ✅ **hasura/metadata/** - Hasura metadata with permissions

### Documentation
- ✅ **HASURA_SETUP.md** - Complete setup guide
- ✅ **MANUAL_DB_SETUP.md** - Database setup instructions

---

## ⚠️ IMPORTANT: Complete These Steps

### Step 1: Update .env File
Open `.env` and update with your PostgreSQL password:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/chatbot_db
POSTGRES_PASSWORD=YOUR_PASSWORD
```

### Step 2: Create Database on Local PostgreSQL

**You need to set up the database on your local PostgreSQL. Choose one method:**

#### Method A: Using pgAdmin (Easiest)
1. Open pgAdmin
2. Create database: `chatbot_db`
3. Open Query Tool
4. Run the file: `database/setup_local.sql`

#### Method B: Using psql (If in PATH)
```powershell
# Add PostgreSQL to PATH first (adjust path to your version)
$env:PATH += ";C:\Program Files\PostgreSQL\16\bin"

# Then run setup script
.\setup_database.ps1 -PostgresPassword "your_password"
```

#### Method C: Using psql with Full Path
```powershell
# Create database
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE chatbot_db;"

# Run setup script
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d chatbot_db -f database\setup_local.sql
```

See **MANUAL_DB_SETUP.md** for detailed instructions.

### Step 3: Track Tables in Hasura

1. Open Hasura Console: http://localhost:8080
2. Enter Admin Secret: `chatbot_admin_secret_2026`
3. Go to **Data** tab
4. Click **Track All** to track the 3 tables:
   - users
   - faqs
   - chat_messages
5. Click **Track All** for foreign keys

### Step 4: Apply Hasura Permissions (Optional)

To apply pre-configured permissions:
```powershell
# Install Hasura CLI if needed
npm install -g hasura-cli

# Apply metadata
hasura metadata apply --endpoint http://localhost:8080 --admin-secret chatbot_admin_secret_2026
```

Or configure permissions manually in the console.

---

## 📊 Database Schema

### Tables Created:
1. **users** - User authentication (email, password_hash, etc.)
2. **faqs** - FAQ management with CRUD operations
3. **chat_messages** - Chat history storage

### Sample Data:
- ✅ 5 sample FAQs pre-loaded
- ✅ Auto-update timestamps configured
- ✅ All indexes created

---

## 🌐 Access Your Services

| Service | URL | Credentials |
|---------|-----|-------------|
| **Hasura Console** | http://localhost:8080 | Admin Secret: `chatbot_admin_secret_2026` |
| **Adminer (DB UI)** | http://localhost:8081 | Server: `host.docker.internal`<br>Username: `postgres`<br>Password: YOUR_PASSWORD<br>Database: `chatbot_db` |
| **GraphQL API** | http://localhost:8080/v1/graphql | Use JWT tokens after auth |

---

## 🧪 Test GraphQL API

Once tables are tracked in Hasura:

```graphql
# Get all FAQs
query GetAllFAQs {
  faqs {
    id
    question
    answer
    category
  }
}
```

---

## 🔧 Useful Commands

```powershell
# View logs
docker-compose logs -f hasura

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Stop and remove everything
docker-compose down -v
```

---

## 🚦 Current Status

- [✅] Docker Compose configured
- [✅] Hasura & Adminer running
- [⚠️] **Database needs to be created** (Step 2 above)
- [ ] Tables need tracking in Hasura (Step 3 above)
- [ ] Permissions need configuration (Step 4 above)

---

## 📚 What's Next After Setup?

1. **Backend (FastAPI)**
   - Create authentication endpoints (signup/login)
   - Implement JWT generation
   - Build chatbot logic

2. **Frontend (Next.js)**
   - Create login/signup pages  
   - Build chatbot interface
   - Implement FAQ management UI

3. **Integration**
   - Connect Next.js to FastAPI
   - Connect both to Hasura GraphQL
   - Test end-to-end flow

---

## 🆘 Troubleshooting

### Hasura can't connect to database
- Check PostgreSQL is running: `Get-Service postgresql*`
- Verify database exists: Connect via Adminer
- Check .env file has correct password

### Can't access Hasura Console
- Verify container is running: `docker-compose ps`
- Check logs: `docker-compose logs hasura`
- Try restarting: `docker-compose restart`

### psql command not found
- See MANUAL_DB_SETUP.md for alternatives
- Use pgAdmin GUI instead
- Add PostgreSQL bin to PATH

---

**🎯 Priority: Complete Step 2 (Create Database) to proceed!**

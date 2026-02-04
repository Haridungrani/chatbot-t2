# ChatBot Docker Setup

## 🐳 Running with Docker

### Quick Start

1. **Make sure Docker and Docker Compose are installed**
   ```bash
   docker --version
   docker-compose --version
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **View logs**
   ```bash
   # All services
   docker-compose logs -f
   
   # Specific service
   docker-compose logs -f backend
   docker-compose logs -f postgres
   docker-compose logs -f frontend
   ```

4. **Stop all services**
   ```bash
   docker-compose down
   ```

5. **Stop and remove volumes (clears database)**
   ```bash
   docker-compose down -v
   ```

### Services Running

- **Backend (FastAPI + GraphQL):** http://localhost:8000
  - GraphQL Playground: http://localhost:8000/graphql
  - API Docs: http://localhost:8000/docs

- **Frontend (Next.js):** http://localhost:3000

- **PostgreSQL Database:** localhost:5432
  - Database: `chatbot_db1`
  - User: `postgres`
  - Password: `postgres`

### Docker Commands

#### Build services
```bash
docker-compose build
```

#### Rebuild without cache
```bash
docker-compose build --no-cache
```

#### Start services
```bash
docker-compose up
```

#### Start in detached mode (background)
```bash
docker-compose up -d
```

#### Stop services
```bash
docker-compose stop
```

#### Restart a specific service
```bash
docker-compose restart backend
docker-compose restart postgres
docker-compose restart frontend
```

#### Remove containers
```bash
docker-compose down
```

#### View running containers
```bash
docker-compose ps
```

#### Execute commands in container
```bash
# Access backend shell
docker-compose exec backend bash

# Access PostgreSQL
docker-compose exec postgres psql -U postgres -d chatbot_db1

# Run Python script in backend
docker-compose exec backend python create_database.py
```

### Database Management

#### Access PostgreSQL CLI
```bash
docker-compose exec postgres psql -U postgres -d chatbot_db1
```

#### PostgreSQL Commands
```sql
-- List all tables
\dt

-- Describe users table
\d users

-- View all users
SELECT * FROM users;

-- Exit
\q
```

#### Backup Database
```bash
docker-compose exec postgres pg_dump -U postgres chatbot_db1 > backup.sql
```

#### Restore Database
```bash
cat backup.sql | docker-compose exec -T postgres psql -U postgres chatbot_db1
```

### Troubleshooting

#### Container not starting
```bash
# Check logs
docker-compose logs backend

# Restart service
docker-compose restart backend
```

#### Database connection issues
```bash
# Check if PostgreSQL is ready
docker-compose exec postgres pg_isready -U postgres

# View PostgreSQL logs
docker-compose logs postgres
```

#### Reset everything
```bash
# Stop all services and remove volumes
docker-compose down -v

# Rebuild and start
docker-compose up --build
```

#### Port already in use
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or change port in docker-compose.yml
```

### Development Workflow

#### Hot Reload
Both backend and frontend support hot reload:
- Edit files in `./backend` or `./frontend`
- Changes are automatically detected and reloaded

#### Install new Python package
```bash
# Add to requirements.txt
echo "package-name==version" >> backend/requirements.txt

# Rebuild backend
docker-compose up -d --build backend
```

#### Install new npm package
```bash
# Option 1: Inside container
docker-compose exec frontend npm install package-name

# Option 2: Rebuild
cd frontend
npm install package-name
docker-compose up -d --build frontend
```

### Production Deployment

For production, update docker-compose.yml:
1. Remove volume mounts for code
2. Change `--reload` to production settings
3. Use proper secrets management
4. Set up reverse proxy (nginx)
5. Use production database credentials
6. Enable HTTPS

### Environment Variables

Edit docker-compose.yml to change:
- `DATABASE_URL`: PostgreSQL connection
- `SECRET_KEY`: JWT secret (change in production!)
- `NEXT_PUBLIC_API_URL`: Backend URL for frontend

### Network Architecture

```
┌─────────────────────────────────────────┐
│         Docker Network (Bridge)         │
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │PostgreSQL│◄─┤ Backend  │◄─┤Frontend││
│  │   :5432  │  │  :8000   │  │  :3000 ││
│  └──────────┘  └──────────┘  └────────┘│
└─────────────────────────────────────────┘
         │            │            │
         └────────────┴────────────┘
              Host: localhost
```

### Only Backend + Database (No Frontend)

If you only want backend and database:
```bash
docker-compose up postgres backend
```

Or comment out the frontend service in docker-compose.yml

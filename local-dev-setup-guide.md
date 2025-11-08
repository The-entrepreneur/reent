# Reent: Local Development Setup Guide

**Goal**: Build entire MVP for **$0** during 8-week development phase using Docker + local services.

---

## Prerequisites (One-Time Installation)

### Required Software

```bash
# 1. Docker Desktop (includes Docker Compose)
# Download: https://www.docker.com/products/docker-desktop
# Version: 24.0+

# 2. Node.js 18+ and pnpm
# Download: https://nodejs.org
npm install -g pnpm

# 3. Python 3.11+
# Download: https://www.python.org

# 4. Git
# Download: https://git-scm.com

# Verify installations
docker --version          # Should show: Docker version 24.x.x
pnpm --version           # Should show: 8.x.x
python --version         # Should show: Python 3.11.x
git --version            # Should show: git version 2.x.x
```

**Time Required**: 30 minutes for all installations

---

## Project Structure

```
reent/
├── docker-compose.yml              # Local infrastructure
├── .env.example                    # Environment template
├── turbo.json                      # TurboRepo config
├── pnpm-workspace.yaml            # Workspace config
│
├── apps/
│   ├── api/                       # FastAPI backend
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   ├── .env
│   │   └── app/
│   │
│   ├── mobile/                    # React Native + Expo
│   │   ├── app.json
│   │   ├── package.json
│   │   ├── .env
│   │   └── src/
│   │
│   ├── web/                       # Next.js main web app
│   │   ├── package.json
│   │   ├── next.config.js
│   │   ├── .env.local
│   │   └── src/
│   │
│   ├── waitlist/                  # Next.js waitlist site (SEPARATE)
│   │   ├── package.json
│   │   ├── next.config.js
│   │   └── src/
│   │       └── pages/
│   │           └── index.tsx      # Waitlist landing page
│   │
│   └── admin/                     # Next.js admin dashboard
│       ├── package.json
│       └── src/
│
├── packages/
│   ├── shared-types/              # Shared TypeScript types
│   ├── api-client/                # Shared API client
│   └── shared-utils/              # Shared utilities
│
└── data/                          # Local data volumes
    ├── postgres/                  # PostgreSQL data
    ├── redis/                     # Redis data
    └── minio/                     # File storage data
```

---

## Step 1: Project Initialization (5 minutes)

```bash
# Create project directory
mkdir reent && cd reent

# Initialize Git
git init
echo "node_modules/" > .gitignore
echo "data/" >> .gitignore
echo ".env" >> .gitignore
echo "*.pyc" >> .gitignore
echo "__pycache__/" >> .gitignore

# Initialize monorepo
pnpm init

# Create workspace config
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'apps/*'
  - 'packages/*'
EOF

# Create TurboRepo config
cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "lint": {}
  }
}
EOF

# Create directory structure
mkdir -p apps/{api,mobile,web,waitlist,admin}
mkdir -p packages/{shared-types,api-client,shared-utils}
mkdir -p data/{postgres,redis,minio}
```

---

## Step 2: Docker Infrastructure Setup (10 minutes)

### Create docker-compose.yml

```bash
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # PostgreSQL Database (replaces Supabase)
  postgres:
    image: postgres:15-alpine
    container_name: reent_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: reent_dev
      POSTGRES_PASSWORD: dev_password_2024
      POSTGRES_DB: reent_db
    ports:
      - "5432:5432"
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
      - ./apps/api/migrations:/docker-entrypoint-initdb.d
    networks:
      - reent_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U reent_dev -d reent_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: reent_redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - ./data/redis:/data
    networks:
      - reent_network
    command: redis-server --appendonly yes --requirepass dev_redis_pass_2024
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  # MinIO (S3-compatible storage, replaces Supabase Storage)
  minio:
    image: minio/minio:latest
    container_name: reent_minio
    restart: unless-stopped
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin123
    volumes:
      - ./data/minio:/data
    networks:
      - reent_network
    command: server /data --console-address ":9001"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

  # Mailhog (Email testing, replaces SendGrid in dev)
  mailhog:
    image: mailhog/mailhog:latest
    container_name: reent_mailhog
    restart: unless-stopped
    ports:
      - "1025:1025"  # SMTP
      - "8025:8025"  # Web UI
    networks:
      - reent_network

networks:
  reent_network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
  minio_data:
EOF
```

### Start Infrastructure

```bash
# Start all services
docker-compose up -d

# Verify all containers are running
docker ps
# Should show: postgres, redis, minio, mailhog (4 containers)

# Check logs
docker-compose logs -f postgres  # PostgreSQL logs
docker-compose logs -f redis     # Redis logs

# Test connections
docker exec -it reent_postgres psql -U reent_dev -d reent_db -c "SELECT version();"
docker exec -it reent_redis redis-cli -a dev_redis_pass_2024 ping
# Should return: PONG

# Access services:
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
# - MinIO Console: http://localhost:9001 (minioadmin/minioadmin123)
# - Mailhog UI: http://localhost:8025
```

---

## Step 3: Backend Setup (FastAPI) (20 minutes)

### Initialize Backend

```bash
cd apps/api

# Create virtual environment
python -m venv venv

# Activate (Windows: venv\Scripts\activate)
source venv/bin/activate

# Create requirements.txt
cat > requirements.txt << 'EOF'
# Core Framework
fastapi==0.104.1
uvicorn[standard]==0.24.0

# Database
sqlalchemy==2.0.23
alembic==1.12.1
psycopg2-binary==2.9.9

# Validation & Config
pydantic==2.5.0
pydantic-settings==2.1.0

# Cache
redis==5.0.1

# Security
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
cryptography==41.0.7

# HTTP & WebSocket
httpx==0.25.2
python-socketio==5.10.0
python-multipart==0.0.6

# Storage
boto3==1.29.7  # For MinIO (S3-compatible)

# Utilities
python-dotenv==1.0.0
email-validator==2.1.0
EOF

# Install dependencies
pip install -r requirements.txt

# Create directory structure
mkdir -p app/{api/v1,models,schemas,services,core,websockets}
mkdir -p tests migrations

# Create __init__.py files
touch app/__init__.py
touch app/api/__init__.py
touch app/api/v1/__init__.py
touch app/models/__init__.py
touch app/schemas/__init__.py
touch app/services/__init__.py
touch app/core/__init__.py
touch app/websockets/__init__.py
```

### Create Environment File

```bash
cat > .env << 'EOF'
# Environment
ENVIRONMENT=development

# Database
DATABASE_URL=postgresql://reent_dev:dev_password_2024@localhost:5432/reent_db

# Redis
REDIS_URL=redis://:dev_redis_pass_2024@localhost:6379/0

# JWT Authentication
JWT_SECRET=dev_jwt_secret_key_change_in_production_1234567890
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=1440

# Encryption
ENCRYPTION_KEY=dev_encryption_key_must_be_32_bytes_long_exactly_1234

# Storage (MinIO - S3 compatible)
STORAGE_ENDPOINT=localhost:9000
STORAGE_ACCESS_KEY=minioadmin
STORAGE_SECRET_KEY=minioadmin123
STORAGE_BUCKET=reent-property-media
STORAGE_USE_SSL=false

# Email (Mailhog for testing)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=noreply@reent.com

# CORS (Allow local development)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:19006,http://localhost:19007

# Mock External APIs (Development Only)
MOCK_YOUVERIFY=true
MOCK_PAYSTACK=true

# API Keys (Use test keys in development)
YOUVERIFY_API_KEY=mock_youverify_dev_key
PAYSTACK_SECRET_KEY=sk_test_mock_development_key
PAYSTACK_PUBLIC_KEY=pk_test_mock_development_key
EOF
```

### Create Main Application

```bash
cat > main.py << 'EOF'
"""FastAPI application entry point"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI(
    title="Reent API",
    description="Nigerian Rental Property Marketplace API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "database": "connected"  # TODO: Add actual DB check
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Reent API - Local Development",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
EOF
```

### Create Configuration

```bash
cat > app/core/config.py << 'EOF'
"""Application configuration"""
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Environment
    ENVIRONMENT: str = "development"
    
    # Database
    DATABASE_URL: str
    
    # Redis
    REDIS_URL: str
    
    # JWT
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 1440
    
    # Encryption
    ENCRYPTION_KEY: str
    
    # Storage
    STORAGE_ENDPOINT: str
    STORAGE_ACCESS_KEY: str
    STORAGE_SECRET_KEY: str
    STORAGE_BUCKET: str
    STORAGE_USE_SSL: bool = False
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # Mock flags
    MOCK_YOUVERIFY: bool = True
    MOCK_PAYSTACK: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
EOF
```

### Create Mock Services

```bash
# Mock Youverify Service
cat > app/services/mock_verification.py << 'EOF'
"""Mock verification service for local development"""
import random
import time
from datetime import datetime

class MockYouverifyService:
    """Simulates Youverify API responses"""
    
    async def verify_bvn(self, bvn: str, phone: str) -> dict:
        """Mock BVN verification (₦150 in production)"""
        # Simulate API delay
        time.sleep(0.5)
        
        # Return mock success
        return {
            "status": "success",
            "verified": True,
            "data": {
                "full_name": "John Doe Agent",
                "phone_number": phone,
                "date_of_birth": "1990-05-15"
            },
            "match_score": 0.95,
            "message": "BVN verified successfully (MOCK)"
        }
    
    async def verify_nin(self, nin: str, dob: str) -> dict:
        """Mock NIN verification"""
        time.sleep(0.5)
        
        # Randomly assign state
        states = ["Lagos", "Abuja", "Port Harcourt", "Ibadan"]
        state = random.choice(states)
        lga = "Ikeja" if state == "Lagos" else "Municipal"
        
        return {
            "status": "success",
            "verified": True,
            "data": {
                "full_name": "John Doe Agent",
                "state": state,
                "lga": lga,
                "date_of_birth": dob
            },
            "message": "NIN verified successfully (MOCK)"
        }

# Singleton instance
mock_youverify = MockYouverifyService()
EOF

# Mock Paystack Service
cat > app/services/mock_payment.py << 'EOF'
"""Mock payment service for local development"""
import uuid
from datetime import datetime

class MockPaystackService:
    """Simulates Paystack API responses"""
    
    async def initialize_payment(
        self,
        email: str,
        amount: int,
        metadata: dict
    ) -> dict:
        """Mock payment initialization (free in test mode)"""
        reference = f"mock_ref_{uuid.uuid4().hex[:16]}"
        
        return {
            "status": True,
            "message": "Authorization URL created (MOCK)",
            "data": {
                "authorization_url": f"http://localhost:3000/mock-payment?ref={reference}",
                "access_code": f"mock_access_{uuid.uuid4().hex[:10]}",
                "reference": reference
            }
        }
    
    async def verify_payment(self, reference: str) -> dict:
        """Mock payment verification"""
        return {
            "status": True,
            "message": "Verification successful (MOCK)",
            "data": {
                "status": "success",
                "reference": reference,
                "amount": 500000,  # ₦5,000 in kobo
                "currency": "NGN",
                "paid_at": datetime.now().isoformat(),
                "customer": {
                    "email": "tenant@example.com"
                }
            }
        }
    
    async def create_subaccount(
        self,
        business_name: str,
        settlement_bank: str,
        account_number: str
    ) -> dict:
        """Mock subaccount creation"""
        return {
            "status": True,
            "message": "Subaccount created (MOCK)",
            "data": {
                "subaccount_code": f"ACCT_mock_{uuid.uuid4().hex[:12]}",
                "business_name": business_name,
                "settlement_bank": settlement_bank,
                "account_number": account_number
            }
        }

# Singleton instance
mock_paystack = MockPaystackService()
EOF
```

### Run Backend

```bash
# From apps/api/ with venv activated
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Backend running at: http://localhost:8000
# API docs at: http://localhost:8000/docs
# Test health check: curl http://localhost:8000/health
```

---

## Step 4: Mobile App Setup (React Native + Expo) (15 minutes)

```bash
cd ../../  # Back to root
cd apps/mobile

# Initialize Expo app
npx create-expo-app@latest . --template blank-typescript

# Install dependencies
pnpm add @react-navigation/native @react-navigation/stack
pnpm add react-native-screens react-native-safe-area-context
pnpm add axios socket.io-client
pnpm add @shopify/flash-list
pnpm add expo-location expo-image-picker expo-av
pnpm add @react-native-async-storage/async-storage
pnpm add react-native-dotenv

# Create .env
cat > .env << 'EOF'
API_BASE_URL=http://localhost:8000
WS_URL=ws://localhost:8000/ws
ENVIRONMENT=development
MOCK_MODE=true
EOF

# Create basic directory structure
mkdir -p src/{screens,components,navigation,services,hooks,context,utils,types}

# Update app.json
cat > app.json << 'EOF'
{
  "expo": {
    "name": "Reent",
    "slug": "reent",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.reent.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.reent.app"
    },
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow Reent to use your location to show nearby properties."
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "Allow Reent to access your photos to upload property images."
        }
      ]
    ]
  }
}
EOF

# Run app
npx expo start

# Press 'i' for iOS simulator (Mac only)
# Press 'a' for Android emulator
# Or scan QR code with Expo Go app on your phone
```

---

## Step 5: Web App Setup (Next.js) (10 minutes)

```bash
cd ../web

# Initialize Next.js with TypeScript and Tailwind
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"

# Install dependencies
pnpm add axios @tanstack/react-query
pnpm add lucide-react  # Icons

# Create .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
NEXT_PUBLIC_ENVIRONMENT=development
EOF

# Run web app
pnpm dev

# Web app running at: http://localhost:3000
```

---

## Step 6: Waitlist Site Setup (Separate Next.js App) (10 minutes)

```bash
cd ../waitlist

# Initialize Next.js
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir

# Create simple landing page
cat > app/page.tsx << 'EOF'
export default function WaitlistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold mb-4">
          Find Your Perfect Rental in Nigeria 🏠
        </h1>
        <p className="text-xl text-gray-700 mb-6">
          Verified agents. Secure payments. Zero fraud.
        </p>
        <form className="bg-white rounded-2xl shadow-2xl p-8">
          <input 
            type="email" 
            placeholder="Enter your email"
            className="w-full px-4 py-3 border-2 rounded-lg mb-4"
          />
          <button className="w-full bg-indigo-600 text-white py-4 rounded-lg font-bold">
            Join Waitlist 🚀
          </button>
        </form>
        <p className="mt-4 text-gray-600">
          <span className="font-bold text-2xl text-indigo-600">247</span> people already joined
        </p>
      </div>
    </div>
  );
}
EOF

# Run waitlist site
pnpm dev -- -p 3001

# Waitlist site running at: http://localhost:3001
```

---

## Step 7: Shared Packages Setup (10 minutes)

### Shared Types Package

```bash
cd ../../packages/shared-types

# Initialize package
pnpm init

# Install TypeScript
pnpm add -D typescript

# Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "declaration": true,
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

# Create src directory
mkdir src

# Create basic types
cat > src/index.ts << 'EOF'
// User types
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'agent' | 'tenant';
  created_at: string;
}

export interface Agent extends User {
  business_name: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  credibility_score: number;
  average_rating: number;
  total_reviews: number;
}

export interface Tenant extends User {
  full_name: string;
}

// Property types
export interface Property {
  id: string;
  agent_id: string;
  title: string;
  description: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  price_monthly: number;
  state: string;
  lga: string;
  city: string;
  media_urls: string[];
  flick_count: number;
  is_active: boolean;
  created_at: string;
}

// More types...
export interface Inspection {
  id: string;
  property_id: string;
  tenant_id: string;
  agent_id: string;
  inspection_fee: number;
  status: 'pending' | 'scheduled' | 'completed' | 'disputed';
  created_at: string;
}

export interface Payment {
  id: string;
  inspection_id: string;
  amount: number;
  commission: number;
  status: 'pending' | 'held' | 'released' | 'refunded';
  created_at: string;
}
EOF

# Update package.json
cat > package.json << 'EOF'
{
  "name": "@reent/shared-types",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
EOF

# Build types
pnpm build
```

---

## Daily Development Workflow

### Morning (Start Development)

```bash
# 1. Start Docker infrastructure (if not already running)
docker-compose up -d

# Verify containers
docker ps  # Should show 4 containers

# 2. Start backend (Terminal 1)
cd apps/api
source venv/bin/activate
python main.py

# 3. Start mobile app (Terminal 2)
cd apps/mobile
npx expo start

# 4. Start web app (Terminal 3 - optional)
cd apps/web
pnpm dev

# 5. Start waitlist site (Terminal 4 - optional)
cd apps/waitlist
pnpm dev -- -p 3001
```

### During Development

```bash
# Check Docker logs
docker-compose logs -f postgres
docker-compose logs -f redis

# Access database
docker exec -it reent_postgres psql -U reent_dev -d reent_db

# Access Redis CLI
docker exec -it reent_redis redis-cli -a dev_redis_pass_2024

# View emails (Mailhog)
# Open: http://localhost:8025

# MinIO Console
# Open: http://localhost:9001
```

### Evening (Stop Development)

```bash
# Stop all services (optional, can leave running)
docker-compose down

# Or keep running for next day:
# Just close terminals, containers keep running
```

---

## Troubleshooting

### Docker Issues

```bash
# Containers not starting
docker-compose down
docker system prune -a  # WARNING: Removes all unused containers
docker-compose up -d

# Permission denied on data/ folders
sudo chown -R $USER:$USER data/

# Port already in use
docker-compose down
lsof -ti:5432 | xargs kill -9  # Kill process on port 5432
```

### Backend Issues

```bash
# Python dependencies not installing
python -m pip install --upgrade pip
pip install -r requirements.txt --force-reinstall

# Database connection refused
# Check PostgreSQL is running:
docker ps | grep postgres

# Can't connect to Redis
# Check Redis is running:
docker exec -it reent_redis redis-cli -a dev_redis_pass_2024 ping
```

### Mobile App Issues

```bash
# Expo not starting
npx expo start --clear

# Can't connect to backend from mobile
# Use your machine's IP instead of localhost
# In .env: API_BASE_URL=http://192.168.1.x:8000

# Find your IP:
# Mac/Linux: ifconfig | grep inet
# Windows: ipconfig
```

---

## Cost Summary

| Service | Development Cost | Production Alternative |
|---------|------------------|----------------------|
| PostgreSQL | **$0** (Docker) | Supabase ($25/mo) |
| Redis | **$0** (Docker) | Upstash ($10/mo) |
| Storage | **$0** (MinIO) | Supabase Storage ($5/mo) |
| Email | **$0** (Mailhog) | SendGrid ($15/mo) |
| API Testing | **$0** (Mock) | Youverify (₦150/verification) |
| Payment | **$0** (Mock) | Paystack (1.5% + ₦100) |
| **Total** | **$0/month** | ~$60-85/month at launch |

**Savings during development: $480-680 over 8 weeks**

---

## Next Steps

1. ✅ Complete this local setup
2. ✅ Start Task 1 from `tasks.md`
3. ✅ Deploy waitlist site to Vercel (free, 5 minutes)
4. ✅ Continue building MVP locally ($0 cost)
5. ✅ Deploy to production only when ready (Week 8)

**Status**: Local development environment ready! 🚀

**Total Setup Time**: ~90 minutes  
**Monthly Cost**: $0
# 🚀 Personal Finance Assistant - Setup Guide

## **Prerequisites**
- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Clerk account for authentication
- Google Gemini AI API key

## **Step 1: Environment Variables**

Create a `.env.local` file in the root directory with:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/personal_finance_assistant"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_clerk_publishable_key"
CLERK_SECRET_KEY="sk_test_your_clerk_secret_key"

# Google Gemini AI
GEMINI_API_KEY="your_gemini_api_key"
```

## **Step 2: Install Dependencies**

```bash
# Clear npm cache first
npm cache clean --force

# Install dependencies with legacy peer deps
npm install --legacy-peer-deps
```

## **Step 3: Database Setup**

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

## **Step 4: Run Development Server**

```bash
npm run dev
```

## **Troubleshooting**

### **If npm install fails:**
```bash
# Try with legacy peer deps
npm install --legacy-peer-deps

# Or force install
npm install --force
```

### **If Prisma fails:**
```bash
# Make sure DATABASE_URL is set in .env.local
# Check your PostgreSQL connection
# Try: npx prisma db push --accept-data-loss
```

### **If Next.js not found:**
```bash
# Reinstall Next.js
npm install next@latest
```

## **Database Setup Options**

### **Option 1: Local PostgreSQL**
1. Install PostgreSQL locally
2. Create database: `createdb personal_finance_assistant`
3. Use: `DATABASE_URL="postgresql://username:password@localhost:5432/personal_finance_assistant"`

### **Option 2: Supabase (Recommended)**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings > Database
4. Use that as your DATABASE_URL

### **Option 3: Railway**
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL service
4. Get connection string from Variables tab

## **Authentication Setup (Clerk)**

1. Go to [clerk.com](https://clerk.com)
2. Create new application
3. Get your publishable and secret keys
4. Add them to .env.local

## **AI Setup (Google Gemini)**

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Add to .env.local as GEMINI_API_KEY

## **Verification**

After setup, you should be able to:
1. Visit `http://localhost:3000`
2. See the landing page
3. Sign up/sign in with Clerk
4. Access the dashboard
5. Add transactions
6. View charts and reports

## **Common Issues & Solutions**

| Issue | Solution |
|-------|----------|
| `next` not found | `npm install next@latest` |
| Prisma errors | Check DATABASE_URL in .env.local |
| Clerk errors | Verify Clerk keys are correct |
| AI scanning fails | Check GEMINI_API_KEY |
| Port 3000 in use | Use `npm run dev -- -p 3001` | 
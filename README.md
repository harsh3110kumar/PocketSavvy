# PocketSavvy

Smart Personal Finance Management

---

[🚀 Live Demo on Vercel](https://pocket-savvy.vercel.app/)

---

## Overview

PocketSavvy is a full-stack web application that empowers users to track, categorize, and analyze their income and expenses. With AI-powered receipt scanning, interactive analytics, and robust multi-user support, it makes managing personal finances fast, secure, and insightful.

---

## Features & Assignment Mapping

- **Add, update, delete transactions (income/expense)**  
  _Requirement: Create income/expense entries through the web app_
- **Filter by date, category, and visualize with dynamic charts**  
  _Requirement: List all income/expenses in a time range; show graphs (by category, by date, etc.)_
- **Upload image/PDF receipts to extract transaction data (AI-powered)**  
  _Requirement: Use AI (Google Gemini) for receipt extraction (images, PDFs)_
- **Bulk PDF import & paginated transaction lists**  
  _Bonus: Upload transaction history from tabular PDFs; pagination for list APIs_
- **Clerk-based authentication & multi-user support**  
  _Requirement: Support multiple users (each user’s data is private and secure)_
- **Responsive, themed UI with dark mode toggle**  
  _Quality: Modern, accessible, and user-friendly design_

---

## Technology Stack

### Frontend
- **Next.js 15** with App Router
- **React 19** with Server Components
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Recharts** for data visualization
- **React Hook Form** with Zod validation

### Backend
- **Next.js Server Actions** for API endpoints
- **Prisma ORM** for database management
- **PostgreSQL** database
- **Clerk** for authentication

### AI & External Services
- **Google Gemini AI** for receipt scanning (images and PDFs)
- **File upload** handling for images and PDFs

---

## Project Structure

```
pocketsavvy/
├── actions/                 # Server actions (API endpoints)
│   ├── dashboard.js         # Dashboard data fetching
│   └── transaction.js       # Transaction CRUD operations, AI receipt/PDF parsing
├── app/                     # Next.js App Router pages
│   ├── (auth)/              # Authentication pages (Clerk)
│   ├── (main)/              # Main application pages
│   │   ├── dashboard/       # Dashboard with analytics
│   │   ├── transactions/    # Transaction listing (paginated)
│   │   └── transaction/     # Transaction management (form, receipt scanner)
│   └── globals.css          # Global styles (Tailwind, dark mode)
├── components/              # Reusable UI components (shadcn/ui, custom)
│   ├── ui/                  # Atomic UI components
│   ├── header.jsx           # Responsive navigation
│   ├── hero.jsx             # Landing page hero
│   └── logo.jsx             # App logo
├── data/                    # Static data (categories, landing page)
├── hooks/                   # Custom React hooks (e.g., use-fetch)
├── lib/                     # Utilities, Prisma client, user checks
├── prisma/                  # Database schema and migrations
│   └── schema.prisma        # User & Transaction models
└── public/                  # Static assets
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL
- Clerk account (for authentication)
- Google Gemini API key (for AI receipt parsing)

### Setup

1. **Clone & Install**
   ```bash
   git clone <repo-url>
   cd pocketsavvy
   npm install
   ```
2. **Environment** (`.env.local`)
   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/finance_db"
   CLERK_SECRET_KEY="..."
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..."
   GEMINI_API_KEY="..."
   ```
3. **Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```
4. **Run**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` in your browser.

---

## API Endpoints

_All implemented as Next.js Server Actions (API and business logic are separated from frontend UI)_

- **Dashboard**
  - `getDashboardData()` — Fetch summary & analytics
- **Transactions**
  - `getTransactions({ page, limit })` — Paginated list
  - `getTransaction(id)`
  - `createTransaction(data)`
  - `updateTransaction(id, data)`
  - `deleteTransaction(id)`
- **Receipt Scanning**
  - `scanReceipt(file)` (images)
  - `scanPDFReceipt(file)` (PDF tables)

---

## Database Schema

```prisma
model User {
  id             String   @id @default(uuid())
  clerkUserId    String   @unique
  email          String   @unique
  name           String?
  imageUrl       String?
  transactions   Transaction[]
}

model Transaction {
  id          String   @id @default(uuid())
  type        String   // INCOME or EXPENSE
  amount      Float
  description String?
  date        DateTime
  category    String
  receiptUrl  String?
  userId      String
  user        User     @relation(fields: [userId], references: [id])
}
```

---

## License

This project is MIT‑licensed. See [LICENSE](LICENSE).

---

> 🧑‍💻 Made with ❤️ by Harsh Kumar

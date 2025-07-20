# PocketSavvy

Smart Personal Finance Management

---

[🚀 Live Demo on Vercel](https://pocket-savvy.vercel.app/)

---

## Overview

PocketSavvy is a full-stack web application that empowers users to track, categorize, and analyze their income and expenses. With AI-powered receipt scanning, interactive analytics, and robust multi-user support, it makes managing personal finances fast, secure, and insightful.

---

## Features

- **Add & Edit Transactions**  
  Quickly log your income and expenses with an intuitive form. Edit any transaction to keep your records accurate.

- **Smart Categorization**  
  Assign categories to each transaction for detailed tracking and analysis.

- **Date & Category Filtering**  
  Effortlessly filter your transactions by date range or category to find exactly what you need.

- **AI-Powered Receipt Scanning**  
  Upload images or PDFs of receipts—Google Gemini AI automatically extracts the amount, date, and description, saving you time on manual entry.

- **Bulk PDF Import**  
  Import transaction history from PDF bank statements or POS receipts in tabular format. The app parses and adds multiple transactions at once.

- **Paginated Transaction List**  
  View your transactions in a fast, paginated table—optimized for large histories.

- **Interactive Analytics Dashboard**  
  Visualize your spending and income with dynamic charts, including expenses by category and trends over time.

- **Multi-User Support**  
  Secure authentication with Clerk ensures each user’s data is private and accessible only to them.

- **Modern, Responsive UI**  
  Enjoy a beautiful, mobile-friendly interface with dark mode, built using shadcn/ui and Tailwind CSS.

- **Robust Validation & Error Handling**  
  All forms are validated with Zod, and users receive clear feedback for any errors.

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
   git clone https://github.com/harsh3110kumar/PocketSavvy.git
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

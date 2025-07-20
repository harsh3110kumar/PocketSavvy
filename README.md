# PocketSavvy - Smart Personal Finance Management

A full-stack web application designed to help users track, manage, and understand their financial activities with intelligent insights. Users can log income and expenses, categorize transactions, and view smart summaries of their spending habits.

## Features

### Core Requirements ✅
- **Income/Expense Entry**: Create income and expense entries through the web app
- **Transaction Listing**: List all income/expenses in a time range with filtering and search
- **Visual Analytics**: 
  - Expenses by category (Pie Chart)
  - Expenses by date (Bar Chart)
- **Receipt Scanner**: Extract expenses from uploaded receipt images and PDFs using AI

### Bonus Features 🎯
- **Pagination**: Support for pagination of the list API
- **Multi-user Support**: Multiple users can use the web app with authentication
- **PDF Upload Support**: Upload transaction history from PDF files

## Technology Stack

### Frontend
- **Next.js 15** with App Router
- **React 19** with Server Components
- **Tailwind CSS** for styling
- **Radix UI** components
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

## Project Structure

```
pocketsavvy/
├── actions/                 # Server actions (API endpoints)
│   ├── dashboard.js        # Dashboard data fetching
│   └── transaction.js      # Transaction CRUD operations
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (main)/            # Main application pages
│   │   ├── dashboard/     # Dashboard with analytics
│   │   ├── transactions/  # Transaction listing
│   │   └── transaction/   # Transaction management
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── header.jsx        # Navigation header
│   ├── hero.jsx          # Landing page hero
│   └── logo.jsx          # Application logo
├── data/                 # Static data and configurations
│   ├── categories.js     # Transaction categories
│   └── landing.js        # Landing page data
├── hooks/                # Custom React hooks
│   └── use-fetch.js      # API request hook
├── lib/                  # Utility libraries
│   ├── prisma.js         # Database client
│   ├── utils.js          # Utility functions
│   └── checkUser.js      # User authentication check
├── prisma/               # Database schema and migrations
│   └── schema.prisma     # Database schema
└── public/               # Static assets
```

## Database Schema

### Core Models
```prisma
User {
  id, clerkUserId, email, name, imageUrl
  transactions[]
}

Transaction {
  id, type (INCOME/EXPENSE), amount, description, date
  category, receiptUrl, userId
}
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google Gemini AI API key
- Clerk authentication setup

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pocketsavvy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/finance_db"
   DIRECT_URL="postgresql://username:password@localhost:5432/finance_db"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   GEMINI_API_KEY="your_gemini_api_key"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Server Actions (Next.js App Router)

#### Dashboard
- `getDashboardData()` - Fetch all user transactions

#### Transactions
- `createTransaction(data)` - Create new transaction
- `updateTransaction(id, data)` - Update existing transaction
- `getTransaction(id)` - Get single transaction
- `getTransactions(page, limit)` - Get paginated transactions
- `scanReceipt(file)` - Extract data from receipt image
- `scanPDFReceipt(file)` - Extract data from PDF receipt

## Key Features Implementation

### 1. Transaction Management
- **Form Validation**: Zod schema validation for all inputs
- **Real-time Updates**: Automatic cache invalidation and UI updates
- **Error Handling**: Comprehensive error handling with user feedback

### 2. Receipt Scanning
- **AI Integration**: Google Gemini AI for intelligent data extraction
- **Image Processing**: Support for various image formats
- **PDF Processing**: Support for PDF receipt scanning
- **Auto-population**: Extracted data automatically fills the transaction form

### 3. Analytics & Visualization
- **Interactive Charts**: Recharts library for responsive charts
- **Real-time Data**: Live updates from database
- **Category Analysis**: Expense breakdown by categories
- **Time-based Analysis**: Expense trends over time

### 4. Transaction Listing
- **Advanced Filtering**: Search, type filter, and date range filtering
- **Sorting**: Sort by date, amount, or category
- **Pagination**: Efficient pagination for large datasets
- **Date Range Picker**: Filter transactions by custom date ranges

### 5. User Experience
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Theme support with system preference detection
- **Loading States**: Smooth loading indicators
- **Toast Notifications**: User feedback for actions

## Code Quality Features

### 1. Clean Code
- **Meaningful Names**: Descriptive variable and function names
- **Single Responsibility**: Each function has a clear purpose
- **Consistent Formatting**: ESLint and Prettier configuration

### 2. Modularity
- **Component Separation**: Reusable UI components
- **Service Layer**: Separated business logic
- **Custom Hooks**: Reusable state management

### 3. Error Handling
- **Try-Catch Blocks**: Comprehensive error catching
- **User Feedback**: Toast notifications for errors
- **Validation**: Input validation at multiple levels

### 4. Documentation
- **Inline Comments**: Complex logic explanations
- **README**: Comprehensive setup and usage guide
- **Code Structure**: Self-documenting code organization

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Compatible with Next.js
- **Railway**: Easy PostgreSQL integration
- **Heroku**: Traditional deployment option

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `DIRECT_URL` | Direct PostgreSQL connection | Yes |
| `CLERK_SECRET_KEY` | Clerk authentication secret | Yes |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | Yes |
| `GEMINI_API_KEY` | Google Gemini AI API key | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@pocketsavvy.com or create an issue in the repository.

---

**Note**: PocketSavvy is designed as a modern, intelligent personal finance management solution. It includes all the core requirements for smart financial tracking with additional AI-powered features for enhanced functionality and user experience.

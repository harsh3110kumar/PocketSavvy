import { BarChart3, Receipt, PieChart, Upload } from "lucide-react";

export const featuresData = [
  {
    title: "Track Transactions",
    description: "Easily log your income and expenses with detailed categorization",
    icon: <BarChart3 className="h-6 w-6 text-primary" />,
  },
  {
    title: "Receipt Scanner",
    description: "Upload receipts and let our AI extract transaction details automatically",
    icon: <Receipt className="h-6 w-6 text-primary" />,
  },
  {
    title: "Visual Analytics",
    description: "View your spending patterns with interactive charts and graphs",
    icon: <PieChart className="h-6 w-6 text-primary" />,
  },
  {
    title: "PDF Import",
    description: "Upload transaction history from PDF files for bulk import",
    icon: <Upload className="h-6 w-6 text-primary" />,
  },
];
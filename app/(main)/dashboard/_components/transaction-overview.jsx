"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight, Calendar, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5",
  "#9FA8DA",
  "#FFB347",
  "#87CEEB",
  "#DDA0DD",
  "#98FB98",
  "#F0E68C",
  "#FFA07A",
  "#20B2AA",
  "#FF69B4"
];

const DashboardOverview = ({ transactions }) => {
  // Get recent transactions (last 5)
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Calculate expense breakdown by category
  const expensesByCategory = transactions
    .filter(t => t.type === "EXPENSE")
    .reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += parseFloat(transaction.amount);
      return acc;
    }, {});

  // Format data for pie chart
  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  // Calculate expenses by date (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return format(date, 'yyyy-MM-dd');
  }).reverse();

  const expensesByDate = last7Days.map(date => {
    const dayExpenses = transactions
      .filter(t => t.type === "EXPENSE" && format(new Date(t.date), 'yyyy-MM-dd') === date)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    return {
      date: format(new Date(date), 'MMM dd'),
      expenses: dayExpenses,
    };
  });

  return (
    <div className="space-y-6">
      {/* Recent Transactions Card */}
      <Card className="dark-card hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Recent Transactions
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            Last 5 transactions
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No recent transactions</p>
                <p className="text-sm text-muted-foreground mt-1">Add your first transaction to get started</p>
              </div>
            ) : (
              recentTransactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      transaction.type === "EXPENSE" ? "bg-red-500/10" : "bg-green-500/10"
                    )}>
                      {transaction.type === "EXPENSE" ? (
                        <ArrowDownRight className="h-5 w-5 text-red-500" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {transaction.description || "Untitled Transaction"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "text-sm font-semibold",
                      transaction.type === "EXPENSE" ? "text-red-500" : "text-green-500"
                    )}>
                      {transaction.type === "EXPENSE" ? "-" : "+"}₹{parseFloat(transaction.amount).toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {transaction.category}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Expense Breakdown Card */}
        <Card className="dark-card hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Expenses by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pb-6">
            {pieChartData.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No expenses recorded</p>
                <p className="text-sm text-muted-foreground mt-1">Add some expenses to see the breakdown</p>
              </div>
            ) : (
              <div className="h-[300px] px-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ₹${value.toFixed(2)}`}
                      labelLine={false}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`₹${value.toFixed(2)}`, 'Amount']}
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                        color: "hsl(var(--popover-foreground))",
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value, entry) => [value, entry.payload.value]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expenses by Date Card */}
        <Card className="dark-card hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Expenses by Date (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={expensesByDate}
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${value}`}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip
                    formatter={(value) => [`₹${value}`, 'Expenses']}
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                      color: "hsl(var(--popover-foreground))",
                    }}
                  />
                  <Bar
                    dataKey="expenses"
                    name="Expenses"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
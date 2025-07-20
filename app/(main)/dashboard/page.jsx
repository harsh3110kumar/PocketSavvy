import React, { Suspense } from 'react'
import { getDashboardData } from '@/actions/dashboard';
import DashboardOverview from './_components/transaction-overview';
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function DashboardPage () {
  const transactions = await getDashboardData();

  // Calculate summary statistics
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const netAmount = totalIncome - totalExpenses;
  const transactionCount = transactions.length;

  return (
    <div className='space-y-8' key={`dashboard-${Date.now()}`}>
      {/* Header Section */}
      <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between'>
        <div>
          <h1 className='text-4xl sm:text-5xl font-bold tracking-tight gradient-title' id="dashboard-main-heading">
            Dashboard
          </h1>
          <p className='text-muted-foreground mt-2'>
            Track your finances and spending patterns
          </p>
        </div>
        <Link href='/transaction/create'>
          <button className='flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200 shadow-lg hover:shadow-xl'>
            <Plus className='h-5 w-5' />
            Add Transaction
          </button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card className='dark-card hover:shadow-lg transition-all duration-300'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Total Income
            </CardTitle>
            <TrendingUp className='h-4 w-4 text-green-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-500'>
              ₹{totalIncome.toFixed(2)}
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              All time income
            </p>
          </CardContent>
        </Card>

        <Card className='dark-card hover:shadow-lg transition-all duration-300'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Total Expenses
            </CardTitle>
            <TrendingDown className='h-4 w-4 text-red-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-500'>
              ₹{totalExpenses.toFixed(2)}
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              All time expenses
            </p>
          </CardContent>
        </Card>

        <Card className='dark-card hover:shadow-lg transition-all duration-300'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Net Amount
            </CardTitle>
            <DollarSign className='h-4 w-4 text-primary' />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netAmount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ₹{netAmount.toFixed(2)}
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              Current balance
            </p>
          </CardContent>
        </Card>

        <Card className='dark-card hover:shadow-lg transition-all duration-300'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Total Transactions
            </CardTitle>
            <Calendar className='h-4 w-4 text-blue-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-blue-500'>
              {transactionCount}
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              All transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <Suspense fallback={
        <div className='grid gap-6 md:grid-cols-2'>
          <Card className='dark-card'>
            <CardContent className='p-6'>
              <div className='animate-pulse'>
                <div className='h-4 bg-muted rounded w-1/3 mb-4'></div>
                <div className='h-64 bg-muted rounded'></div>
              </div>
            </CardContent>
          </Card>
          <Card className='dark-card'>
            <CardContent className='p-6'>
              <div className='animate-pulse'>
                <div className='h-4 bg-muted rounded w-1/3 mb-4'></div>
                <div className='h-64 bg-muted rounded'></div>
              </div>
            </CardContent>
          </Card>
        </div>
      }>
        <DashboardOverview transactions={transactions || []} />
      </Suspense>
    </div>
  )
}

export default DashboardPage

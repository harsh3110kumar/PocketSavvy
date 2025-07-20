import React, { Suspense } from 'react'
import { getTransactions } from '@/actions/transaction';
import TransactionTable from './_components/transaction-table';
import { Button } from '@/components/ui/button';
import { Upload, Plus } from 'lucide-react';
import Link from 'next/link';

const TransactionsPage = async () => {
  const { transactions, total } = await getTransactions(1, 50);
  
  return (
    <div className='space-y-8'>
      {/* Header Section */}
      <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between'>
        <div>
          <h1 className='text-4xl sm:text-5xl font-bold tracking-tight gradient-title'>
            Transactions
          </h1>
          <p className='text-muted-foreground mt-2'>
            View and manage all your income and expense transactions
          </p>
        </div>
        <div className='flex gap-2'>
          <Link href='/transaction/create'>
            <Button className='bg-primary hover:bg-primary/90 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200'>
              <Plus className='h-4 w-4' />
              Add Transaction
            </Button>
          </Link>
          <Button variant='outline' className='flex items-center gap-2'>
            <Upload className='h-4 w-4' />
            Import PDF
          </Button>
        </div>
      </div>

      {/* Statistics Summary */}
      <div className='flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/40'>
        <div className='text-sm text-muted-foreground'>
          Showing <span className='font-semibold text-foreground'>{transactions?.length || 0}</span> of <span className='font-semibold text-foreground'>{total || 0}</span> transactions
        </div>
        <div className='text-sm text-muted-foreground'>
          Total records in database
        </div>
      </div>

      {/* Transaction Table */}
      <Suspense fallback={
        <div className='space-y-4'>
          <div className='animate-pulse'>
            <div className='h-10 bg-muted rounded mb-4'></div>
            <div className='space-y-2'>
              {[...Array(5)].map((_, i) => (
                <div key={i} className='h-16 bg-muted rounded'></div>
              ))}
            </div>
          </div>
        </div>
      }>
        <TransactionTable transactions={transactions}/>
      </Suspense>
    </div>
  )
}

export default TransactionsPage 
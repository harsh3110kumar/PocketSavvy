import { defaultCategories } from '@/data/categories';
import React from 'react'
import AddTransactionForm from '../_components/transaction-form';
import { getTransaction } from '@/actions/transaction';

const AddTransaction = async ({ searchParams }) => {
  const params = await searchParams;
  const editId = params?.edit;
  let initialData = null;

  if (editId) {
    initialData = await getTransaction(editId);
  }

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-4xl sm:text-5xl font-bold tracking-tight gradient-title'>
          {editId ? 'Edit Transaction' : 'Add Transaction'}
        </h1>
        <p className='text-muted-foreground mt-2'>
          {editId ? 'Update your transaction details' : 'Record a new income or expense'}
        </p>
      </div>
      <AddTransactionForm 
        categories={defaultCategories}
        editMode={!!editId}
        initialData={initialData}
      />
    </div>
  )
}

export default AddTransaction

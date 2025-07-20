"use client";

import React, { useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema } from "@/app/lib/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2, Receipt, DollarSign, Tag, CalendarDays, FileText } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { createTransaction, updateTransaction } from "@/actions/transaction";
import { ReceiptScanner } from './receipt-scanner';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AddTransactionForm = ({
  categories,
  editMode = false,
  initialData = null,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues:
      editMode && initialData
        ? {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description,
            category: initialData.category,
            date: new Date(initialData.date),
          }
        : {
            type: "EXPENSE",
            amount: "",
            description: "",
            date: new Date(),
          },
  });

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = useFetch(editMode ? updateTransaction : createTransaction);

  const type = watch("type");
  const date = watch("date");
  const category = watch("category");

  // Memoize filtered categories to prevent unnecessary re-computations
  const filteredCategories = useMemo(() => 
    categories.filter((cat) => cat.type === type), 
    [categories, type]
  );

  const onSubmit = useCallback((data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    };

    if (editMode) {
      transactionFn(editId, formData);
    } else {
      transactionFn(formData);
    }
  }, [editMode, editId, transactionFn]);

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      const message = editMode 
        ? "Transaction updated successfully! 🎉" 
        : "Transaction created successfully! 🎉";
      toast.success(message, {
        description: "Your transaction has been saved to the database.",
        duration: 4000,
      });
      reset();
      router.push('/dashboard');
    } else if (transactionResult?.error && !transactionLoading) {
      toast.error("Failed to save transaction", {
        description: transactionResult.error,
        duration: 4000,
      });
    }
  }, [transactionResult, transactionLoading, editMode, reset, router]);

  // Memoize the callback to prevent infinite loops
  const handleScanComplete = useCallback((scannedData) => {
    if (scannedData) {
      setValue("amount", scannedData.amount.toString());
      setValue("date", new Date(scannedData.date));
      if (scannedData.description) {
        setValue("description", scannedData.description);
      }
      if (scannedData.category) {
        // Map the scanned category to the correct category ID
        const categoryMapping = {
          'housing': 'housing',
          'transportation': 'transportation',
          'groceries': 'groceries',
          'utilities': 'utilities',
          'entertainment': 'entertainment',
          'food': 'food',
          'shopping': 'shopping',
          'healthcare': 'healthcare',
          'education': 'education',
          'personal': 'personal',
          'travel': 'travel',
          'insurance': 'insurance',
          'gifts': 'gifts',
          'bills': 'bills',
          'other-expense': 'other-expense'
        };
        
        const mappedCategory = categoryMapping[scannedData.category.toLowerCase()];
        if (mappedCategory) {
          setValue("category", mappedCategory);
        }
      }
    }
  }, [setValue]);

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="dark-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Transaction Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
            {/* AI Receipt Scanner */}
            {!editMode && (
              <div className="mb-6">
                <ReceiptScanner onScanComplete={handleScanComplete} />
              </div>
            )}

            {/* Type and Amount Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type */}
              <div>
                <label className='block text-sm font-medium mb-2 flex items-center gap-2'>
                  <Tag className="h-4 w-4 text-primary" />
                  Transaction Type
                </label>
                <Select
                  onValueChange={(value) => setValue("type", value)}
                  value={type}
                >
                  <SelectTrigger className="dark-input">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                    <SelectItem value="INCOME">Income</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className='text-sm text-red-500 mt-1'>{errors.type.message}</p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className='block text-sm font-medium mb-2 flex items-center gap-2'>
                  <DollarSign className="h-4 w-4 text-primary" />
                  Amount
                </label>
                <Input
                  type='number'
                  step='0.01'
                  placeholder='0.00'
                  className="dark-input"
                  {...register('amount')}
                />
                {errors.amount && (
                  <p className='text-sm text-red-500 mt-1'>{errors.amount.message}</p>
                )}
              </div>
            </div>

            {/* Category and Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className='block text-sm font-medium mb-2 flex items-center gap-2'>
                  <Tag className="h-4 w-4 text-primary" />
                  Category
                </label>
                <Select
                  onValueChange={(value) => setValue('category', value)}
                  value={category}
                >
                  <SelectTrigger className="dark-input">
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className='text-sm text-red-500 mt-1'>{errors.category.message}</p>
                )}
              </div>

              {/* Date */}
              <div>
                <label className='block text-sm font-medium mb-2 flex items-center gap-2'>
                  <CalendarDays className="h-4 w-4 text-primary" />
                  Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant='outline' className='w-full pl-3 text-left font-normal dark-input'>
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={date}
                      onSelect={(date) => setValue('date', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className='text-sm text-red-500 mt-1'>{errors.date.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className='block text-sm font-medium mb-2 flex items-center gap-2'>
                <FileText className="h-4 w-4 text-primary" />
                Description
              </label>
              <Input
                placeholder='Enter description (optional)'
                className="dark-input"
                {...register('description')}
              />
              {errors.description && (
                <p className='text-sm text-red-500 mt-1'>{errors.description.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type='submit'
              className='w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200'
              disabled={transactionLoading}
            >
              {transactionLoading ? (
                <>
                  <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                  {editMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editMode ? 'Update Transaction' : 'Create Transaction'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTransactionForm;

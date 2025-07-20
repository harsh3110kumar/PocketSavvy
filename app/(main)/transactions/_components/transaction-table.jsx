"use client"

import React, { useMemo, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns';
import { categoryColors } from '@/data/categories';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Search, Calendar, Edit, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent } from '@/components/ui/card';

const ITEMS_PER_PAGE = 10;

const TransactionTable = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((transaction) =>
        transaction.description?.toLowerCase().includes(searchLower) ||
        transaction.category?.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    // Apply date range filter
    if (dateRange.from && dateRange.to) {
      result = result.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= dateRange.from && transactionDate <= dateRange.to;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          comparison = parseFloat(a.amount) - parseFloat(b.amount);
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, searchTerm, typeFilter, dateRange, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedTransactions, currentPage]);

  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction: current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setDateRange({ from: null, to: null });
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleEdit = (transactionId) => {
    // Navigate to edit page
    window.location.href = `/transaction/create?edit=${transactionId}`;
  };

  const handleDelete = (transactionId) => {
    // TODO: Implement delete functionality
    console.log('Delete transaction:', transactionId);
  };

  return (
    <div className='space-y-6'>
      {/* Filters Card */}
      <Card className="dark-card">
        <CardContent className="p-6">
          <div className='space-y-4'>
            {/* Search and Filters Row */}
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='relative flex-1'>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 dark-input"
                />
              </div>

              <div className="flex gap-2">
                <Select
                  value={typeFilter}
                  onValueChange={(value) => {
                    setTypeFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[130px] dark-input">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INCOME">Income</SelectItem>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                  </SelectContent>
                </Select>

                {/* Date Range Picker */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[200px] justify-start text-left font-normal dark-input">
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={(range) => {
                        setDateRange(range || { from: null, to: null });
                        setCurrentPage(1);
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>

                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="px-4 dark-input"
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Showing {paginatedTransactions.length} of {filteredAndSortedTransactions.length} transactions
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Table Card */}
      <Card className="dark-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40">
                  <TableHead className="font-semibold">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("date")}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Date
                      {sortConfig.field === "date" ? (
                        sortConfig.direction === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )
                      ) : null}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                  <TableHead className="font-semibold">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("category")}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Category
                      {sortConfig.field === "category" ? (
                        sortConfig.direction === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )
                      ) : null}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("amount")}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Amount
                      {sortConfig.field === "amount" ? (
                        sortConfig.direction === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )
                      ) : null}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="space-y-2">
                        <div className="w-16 h-16 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
                          <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground font-medium">No transactions found</p>
                        <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="hover:bg-muted/30 transition-colors duration-200">
                      <TableCell className="font-medium">
                        {format(new Date(transaction.date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium max-w-xs truncate">
                          {transaction.description || "No description"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: categoryColors[transaction.category] || "#94a3b8",
                            color: "white",
                          }}
                          className="capitalize"
                        >
                          {transaction.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className={cn(
                          "flex items-center font-semibold",
                          transaction.type === "EXPENSE" ? "text-red-500" : "text-green-500"
                        )}>
                          {transaction.type === "EXPENSE" ? (
                            <ArrowDownRight className="mr-1 h-4 w-4" />
                          ) : (
                            <ArrowUpRight className="mr-1 h-4 w-4" />
                          )}
                          ₹{parseFloat(transaction.amount).toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={transaction.type === "INCOME" ? "default" : "destructive"}
                          className="capitalize"
                        >
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(transaction.id)}
                            className="h-8 w-8 p-0 hover:bg-primary/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(transaction.id)}
                            className="h-8 w-8 p-0 hover:bg-red-500/10 text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="dark-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="dark-input"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="dark-input"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TransactionTable; 
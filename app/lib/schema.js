// Importing the 'z' object from the 'zod' library, which is used for schema validation.
import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.string().min(1, "Amount is required"),
  description: z.string().optional(),
  date: z.date({ required_error: "Date is required" }),
  category: z.string().min(1, "Category is required"),
});

"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import { unstable_cache } from 'next/cache';

const serializeTransaction = (obj) => {
  const serialized = { ...obj };
  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }
  return serialized;
};

// Cache the user lookup to avoid repeated database calls
const getUser = unstable_cache(
  async (clerkUserId) => {
    return await db.user.findUnique({
      where: { clerkUserId },
    });
  },
  ['user'],
  { revalidate: 300 } // Cache for 5 minutes
);

export async function getDashboardData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await getUser(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Get recent transactions with limit for better performance
  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    take: 100, // Limit to last 100 transactions for dashboard
  });

  return transactions.map(serializeTransaction);
}



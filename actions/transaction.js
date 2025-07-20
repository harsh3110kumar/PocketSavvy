"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { unstable_cache } from 'next/cache';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const serializeAmount = (obj) => ({
  ...obj,
  amount: obj.amount.toNumber(),
});

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

export async function createTransaction(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const transaction = await db.transaction.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    // Only revalidate the necessary paths
    revalidatePath("/dashboard");
    revalidatePath("/transactions");

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function scanReceipt(file) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Convert ArrayBuffer to Base64
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number, no currency symbol)
      - Date (in ISO format YYYY-MM-DD)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (must be exactly one of these: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense)
      
      Category mapping guide:
      - housing: rent, mortgage, property tax, home maintenance
      - transportation: fuel, public transport, car maintenance, parking
      - groceries: supermarket, food items, household items
      - utilities: electricity, water, gas, internet, phone bills
      - entertainment: movies, games, streaming, recreation
      - food: restaurants, cafes, takeout, dining out
      - shopping: clothing, electronics, general shopping
      - healthcare: medical, dental, pharmacy, health insurance
      - education: tuition, books, courses, training
      - personal: haircut, gym, beauty, personal care
      - travel: flights, hotels, vacation expenses
      - insurance: life, home, vehicle insurance
      - gifts: gifts, donations, charity
      - bills: bank fees, late fees, service charges
      - other-expense: anything else not covered above
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "YYYY-MM-DD",
        "description": "string",
        "merchantName": "string",
        "category": "exact_category_name_from_list"
      }

      If its not a receipt, return an empty object
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();

    // Clean this text by removing parts from start and end
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    try {
      const data = JSON.parse(cleanedText);
      return {
        amount: parseFloat(data.amount),
        date: new Date(data.date),
        description: data.description,
        category: data.category,
        merchantName: data.merchantName,
      };
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Invalid response format from Gemini");
    }
  } catch (error) {
    console.error("Error scanning receipt:", error);
    throw new Error("Failed to scan receipt");
  }
}

export async function scanPDFReceipt(file) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Convert ArrayBuffer to Base64
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `
      Analyze this PDF receipt and extract the following information in JSON format:
      - Total amount (just the number, no currency symbol)
      - Date (in ISO format YYYY-MM-DD)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (must be exactly one of these: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense)
      
      Category mapping guide:
      - housing: rent, mortgage, property tax, home maintenance
      - transportation: fuel, public transport, car maintenance, parking
      - groceries: supermarket, food items, household items
      - utilities: electricity, water, gas, internet, phone bills
      - entertainment: movies, games, streaming, recreation
      - food: restaurants, cafes, takeout, dining out
      - shopping: clothing, electronics, general shopping
      - healthcare: medical, dental, pharmacy, health insurance
      - education: tuition, books, courses, training
      - personal: haircut, gym, beauty, personal care
      - travel: flights, hotels, vacation expenses
      - insurance: life, home, vehicle insurance
      - gifts: gifts, donations, charity
      - bills: bank fees, late fees, service charges
      - other-expense: anything else not covered above
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "YYYY-MM-DD",
        "description": "string",
        "merchantName": "string",
        "category": "exact_category_name_from_list"
      }

      If its not a receipt, return an empty object
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();

    // Clean this text by removing parts from start and end
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    try {
      const data = JSON.parse(cleanedText);
      return {
        amount: parseFloat(data.amount),
        date: new Date(data.date),
        description: data.description,
        category: data.category,
        merchantName: data.merchantName,
      };
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Invalid response format from Gemini");
    }
  } catch (error) {
    console.error("Error scanning PDF receipt:", error);
    throw new Error("Failed to scan PDF receipt");
  }
}

export async function getTransaction(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await getUser(userId);
  if (!user) throw new Error("User not found");

  const transaction = await db.transaction.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!transaction) throw new Error("Transaction not found");

  return serializeAmount(transaction);
}

export async function updateTransaction(id, data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await getUser(userId);
    if (!user) throw new Error("User not found");

    const transaction = await db.transaction.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        ...data,
      },
    });

    // Only revalidate the necessary paths
    revalidatePath("/dashboard");
    revalidatePath("/transactions");

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getTransactions(page = 1, limit = 50) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await getUser(userId);
  if (!user) throw new Error("User not found");

  const skip = (page - 1) * limit;

  // Get transactions with pagination
  const [transactions, total] = await Promise.all([
    db.transaction.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      skip,
      take: limit,
    }),
    db.transaction.count({
      where: { userId: user.id },
    }),
  ]);

  return {
    transactions: transactions.map(serializeAmount),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
  

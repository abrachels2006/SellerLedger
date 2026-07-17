import { Router } from "express"
import { z } from "zod"
import { prisma } from "../lib/prisma.js"

export const expenseRouter = Router()

const createExpenseSchema = z.object({
  description: z.string().trim().min(1, "Description is required"),
  category: z.string().trim().min(1, "Category is required"),
  amount: z.coerce.number().positive(),
  expenseDate: z.coerce.date().optional(),
})

expenseRouter.get("/", async (_req, res, next) => {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { expenseDate: "desc" },
    })

    return res.json(expenses)
  } catch (error) {
    next(error)
  }
})

expenseRouter.post("/", async (req, res, next) => {
  try {
    const body = createExpenseSchema.parse(req.body)

    const expense = await prisma.expense.create({
      data: {
        description: body.description,
        category: body.category,
        amount: body.amount,
        ...(body.expenseDate !== undefined
          ? { expenseDate: body.expenseDate }
          : {}),
      },
    })

    return res.status(201).json(expense)
  } catch (error) {
    next(error)
  }
})

// After this file exists, add near the top of server.ts:
// import { expenseRouter } from "./routes/expenses.js"

// Add after the inventory route and before the error handler:
// app.use("/api/expenses", expenseRouter)
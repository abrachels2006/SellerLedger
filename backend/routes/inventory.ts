import { Router } from "express"
import { z } from "zod"
import { prisma } from "../lib/prisma.js"

export const inventoryRouter = Router()

const createInventoryItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  sku: z.string().trim().optional(),
  category: z.string().trim().optional(),
  brand: z.string().trim().optional(),
  size: z.string().trim().optional(),
  purchasePrice: z.coerce.number().positive(),
  listingPrice: z.coerce.number().positive().optional(),
  status: z.enum(["ACQUIRED", "LISTED", "SOLD", "SHIPPED"]).optional(),
})

function nonBlank(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

inventoryRouter.get("/", async (_req, res, next) => {
  try {
    const items = await prisma.inventoryItem.findMany({
      orderBy: { createdAt: "desc" },
    })

    return res.json(items)
  } catch (error) {
    next(error)
  }
})

inventoryRouter.post("/", async (req, res, next) => {
  try {
    const body = createInventoryItemSchema.parse(req.body)
    const sku = nonBlank(body.sku)
    const category = nonBlank(body.category)
    const brand = nonBlank(body.brand)
    const size = nonBlank(body.size)

    const item = await prisma.inventoryItem.create({
      data: {
        title: body.title,
        purchasePrice: body.purchasePrice,
        status: body.status ?? "ACQUIRED",
        ...(sku !== undefined ? { sku } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(brand !== undefined ? { brand } : {}),
        ...(size !== undefined ? { size } : {}),
        ...(body.listingPrice !== undefined
          ? { listingPrice: body.listingPrice }
          : {}),
      },
    })

    return res.status(201).json(item)
  } catch (error) {
    next(error)
  }
})

// After this file exists, add near the top of server.ts:
// import { inventoryRouter } from "./routes/inventory.js"

// Add after the /health route and before the error handler:
// app.use("/api/inventory", inventoryRouter)
import { Router } from "express"
import { z } from "zod"
import { prisma } from "../lib/prisma.js"
 
export const inventoryRouter = Router()
 
const inventoryStatusSchema = z.enum(["ACQUIRED", "LISTED", "SOLD", "SHIPPED"])
 
const createInventoryItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  sku: z.string().trim().optional(),
  category: z.string().trim().optional(),
  brand: z.string().trim().optional(),
  size: z.string().trim().optional(),
  purchasePrice: z.coerce.number().positive(),
  listingPrice: z.coerce.number().positive().optional(),
  status: inventoryStatusSchema.optional(),
})
 
const updateInventoryStatusSchema = z.object({
  status: inventoryStatusSchema,
})
 
function nonBlank(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}
 
function parseId(value: string | undefined): number | undefined {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : undefined
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
 
inventoryRouter.patch("/:id/status", async (req, res, next) => {
  try {
    const id = parseId(req.params.id)
 
    if (id === undefined) {
      return res.status(400).json({ message: "Invalid inventory item id" })
    }
 
    const body = updateInventoryStatusSchema.parse(req.body)
 
    const existingItem = await prisma.inventoryItem.findUnique({
      where: { id },
    })
 
    if (!existingItem) {
      return res.status(404).json({ message: "Inventory item not found" })
    }
 
    const item = await prisma.inventoryItem.update({
      where: { id },
      data: { status: body.status },
    })
 
    return res.json(item)
  } catch (error) {
    next(error)
  }
})
 
inventoryRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = parseId(req.params.id)
 
    if (id === undefined) {
      return res.status(400).json({ message: "Invalid inventory item id" })
    }
 
    const existingItem = await prisma.inventoryItem.findUnique({
      where: { id },
      include: { sales: true },
    })
 
    if (!existingItem) {
      return res.status(404).json({ message: "Inventory item not found" })
    }
 
    if (existingItem.sales.length > 0) {
      return res.status(409).json({
        message: "Items with sales history should not be deleted",
      })
    }
 
    await prisma.inventoryItem.delete({
      where: { id },
    })
 
    return res.status(204).send()
  } catch (error) {
    next(error)
  }
})

import { Router } from "express"
import { z } from "zod"
import { prisma } from "../lib/prisma.js"

export const saleRouter = Router()

const createSaleSchema = z.object({
  inventoryItemId: z.coerce.number().int().positive(),
  soldPrice: z.coerce.number().positive(),
  platformFee: z.coerce.number().nonnegative(),
  shippingCost: z.coerce.number().nonnegative(),
  soldDate: z.coerce.date().optional(),
})

saleRouter.get("/", async (_req, res, next) => {
  try {
    const sales = await prisma.sale.findMany({
      include: { inventoryItem: true },
      orderBy: { soldDate: "desc" },
    })

    return res.json(sales)
  } catch (error) {
    next(error)
  }
})

saleRouter.post("/", async (req, res, next) => {
  try {
    const body = createSaleSchema.parse(req.body)

    const existingItem = await prisma.inventoryItem.findUnique({
      where: { id: body.inventoryItemId },
    })

    if (!existingItem) {
      return res.status(404).json({ message: "Inventory item not found" })
    }

    if (existingItem.status === "SOLD" || existingItem.status === "SHIPPED") {
      return res.status(409).json({
        message: "This inventory item is already sold or shipped",
      })
    }

    const result = await prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          inventoryItemId: body.inventoryItemId,
          soldPrice: body.soldPrice,
          platformFee: body.platformFee,
          shippingCost: body.shippingCost,
          ...(body.soldDate !== undefined ? { soldDate: body.soldDate } : {}),
        },
      })

      const inventoryItem = await tx.inventoryItem.update({
        where: { id: body.inventoryItemId },
        data: { status: "SOLD" },
      })

      return { sale, inventoryItem }
    })

    return res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

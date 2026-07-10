import { prisma } from "../lib/prisma.js"

async function main() {
  await prisma.sale.deleteMany()
  await prisma.expense.deleteMany()
  await prisma.inventoryItem.deleteMany()

  const denimJacket = await prisma.inventoryItem.create({
    data: {
      title: "Vintage denim jacket",
      sku: "JACKET-001",
      category: "Jackets",
      brand: "Levi's",
      size: "M",
      purchasePrice: "24.00",
      listingPrice: "68.00",
      status: "SOLD",
    },
  })

  await prisma.inventoryItem.create({
    data: {
      title: "Black cargo pants",
      sku: "PANTS-001",
      category: "Pants",
      brand: "Dickies",
      size: "32x30",
      purchasePrice: "18.00",
      listingPrice: "42.00",
      status: "LISTED",
    },
  })

  await prisma.sale.create({
    data: {
      inventoryItemId: denimJacket.id,
      soldPrice: "68.00",
      platformFee: "6.80",
      shippingCost: "7.80",
    },
  })

  await prisma.expense.createMany({
    data: [
      { description: "Polymailers", category: "Shipping supplies", amount: "12.99" },
      { description: "Thermal labels", category: "Shipping supplies", amount: "9.50" },
    ],
  })

  console.log("Seed data created.")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
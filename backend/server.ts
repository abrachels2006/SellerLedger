import "dotenv/config"
import cors from "cors"
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express"
import { inventoryRouter } from "./routes/inventory.js"
import { expenseRouter } from "./routes/expenses.js"
import { saleRouter } from "./routes/sales.js"
import { ZodError } from "zod"

const app = express()
const PORT = Number(process.env.PORT ?? 4000)

app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())

app.get("/health", (_req, res) => {
  return res.json({ status: "ok", service: "SellerLedger API" })
})

app.use("/api/inventory", inventoryRouter)
app.use("/api/expenses", expenseRouter)
app.use("/api/sales", saleRouter)

app.use(
  (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Invalid request body",
        issues: error.issues,
      })
    }

    console.error(error)

    return res.status(500).json({
      message: "Something went wrong on the server",
    })
  },
)

app.listen(PORT, () => {
  console.log(`SellerLedger API running at http://localhost:${PORT}`)
})
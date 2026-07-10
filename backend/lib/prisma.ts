import "dotenv/config"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient } from "../generated/prisma/client.js" // SER - added .js


function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}

const adapter = new PrismaMariaDb({
  host: requireEnv("DATABASE_HOST"),
  port: Number(process.env.DATABASE_PORT ?? 3306),
  user: requireEnv("DATABASE_USER"),
  password: requireEnv("DATABASE_PASSWORD"),
  database: requireEnv("DATABASE_NAME"),
  connectionLimit: 5,
  allowPublicKeyRetrieval: true,
})

export const prisma = new PrismaClient({ adapter })
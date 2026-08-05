import { Router } from "express"
import bcrypt from "bcryptjs"
import { z } from "zod"

import { prisma } from "../lib/prisma.js"
import {
  createAuthToken,
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/auth.js"

const router = Router()

// Zod schemas describe what a valid request body must look like.
// safeParse lets the API return a friendly 400 instead of crashing.
const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({
      error: "Check the registration form fields",
      issues: parsed.error.flatten().fieldErrors,
    })
    return
  }

  const { name, email, password } = parsed.data

  // The email column is unique, so check first and return a clear error.
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    res.status(409).json({ error: "Email is already registered" })
    return
  }

  // Store the hash, never the real password.
  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
    // select controls exactly what leaves the database and goes to the API.
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  })

  const token = await createAuthToken(user)

  res.status(201).json({ user, token })
})

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({
      error: "Check the login form fields",
      issues: parsed.error.flatten().fieldErrors,
    })
    return
  }

  const { email, password } = parsed.data

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    res.status(401).json({ error: "Invalid email or password" })
    return
  }

  // bcrypt.compare checks the submitted password against the stored hash.
  const passwordMatches = await bcrypt.compare(password, user.passwordHash)

  if (!passwordMatches) {
    res.status(401).json({ error: "Invalid email or password" })
    return
  }

  // Build a safe user object so passwordHash is not returned.
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  }

  const token = await createAuthToken(safeUser)

  res.json({ user: safeUser, token })
})

// requireAuth runs before this handler. If the token is bad, this handler
// will not run. If the token is good, req.user will be available.
router.get("/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Authentication required" })
    return
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  })

  if (!user) {
    res.status(404).json({ error: "User not found" })
    return
  }

  res.json({ user })
})

export default router

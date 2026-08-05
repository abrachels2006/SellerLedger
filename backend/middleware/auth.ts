import type { NextFunction, Request, Response } from "express"
import { jwtVerify, SignJWT } from "jose"

// This is the small, safe identity object the API needs after login.
// Notice that it does not include passwordHash.
export type AuthUser = {
  id: number
  email: string
  name: string
}

// Express Request does not normally have req.user.
// This type lets protected routes safely read req.user after requireAuth runs.
export type AuthenticatedRequest = Request & {
  user?: AuthUser
}

// jose signs HS256 tokens with bytes, so TextEncoder converts the secret
// string from .env into the byte format jose expects.
const encoder = new TextEncoder()

function getJwtSecret() {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error("JWT_SECRET is missing from the backend .env file")
  }

  return encoder.encode(secret)
}

export async function createAuthToken(user: AuthUser) {
  // The token carries only safe identity claims.
  // The user id goes in subject, which is the token's "who is this?" field.
  return await new SignJWT({
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(getJwtSecret())
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  // Postman or the frontend will send: Authorization: Bearer <token>
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing bearer token" })
    return
  }

  // Remove the "Bearer " label so only the token remains.
  const token = authHeader.slice("Bearer ".length)

  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    })

    const userId = Number(payload.sub)

    if (!Number.isInteger(userId)) {
      res.status(401).json({ error: "Invalid token subject" })
      return
    }

    // Attach the verified identity to the request for the next route handler.
    req.user = {
      id: userId,
      email: String(payload.email ?? ""),
      name: String(payload.name ?? ""),
    }

    // Continue to the protected route.
    next()
  } catch {
    res.status(401).json({ error: "Invalid or expired token" })
  }
}

const API_BASE_URL = "http://localhost:4000"
const TOKEN_STORAGE_KEY = "sellerledger.authToken"
 
export type User = {
  id: number
  name: string
  email: string
  createdAt: string
}
 
export type AuthResponse = {
  user: User
  token: string
}
 
export type LoginInput = {
  email: string
  password: string
}
 
export type RegisterInput = {
  name: string
  email: string
  password: string
}
 
export type InventoryStatus = "ACQUIRED" | "LISTED" | "SOLD" | "SHIPPED"
 
export type InventoryItem = {
  id: number
  title: string
  sku: string | null
  category: string | null
  brand: string | null
  size: string | null
  purchasePrice: string | number
  listingPrice: string | number | null
  status: InventoryStatus
  createdAt: string
  updatedAt: string
}
 
export type CreateInventoryItemInput = {
  title: string
  sku?: string
  category?: string
  brand?: string
  size?: string
  purchasePrice: number
  listingPrice?: number
  status?: InventoryStatus
}
 
export type Sale = {
  id: number
  inventoryItemId: number
  soldPrice: string | number
  platformFee: string | number
  shippingCost: string | number
  soldDate: string
  createdAt: string
  inventoryItem: InventoryItem
}
 
export type CreateSaleInput = {
  inventoryItemId: number
  soldPrice: number
  platformFee: number
  shippingCost: number
}
 
export type CreateSaleResponse = {
  sale: Sale
  inventoryItem: InventoryItem
}
 
// localStorage stores strings for the current website.
// This learning project stores only the token, never the password.
export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}
 
export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}
 
export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}
 
// One helper handles all frontend HTTP requests.
// If a token exists, the helper adds Authorization: Bearer <token>.
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken()
  const headers = new Headers(options.headers)
 
  // Only set Content-Type when we are sending a body.
  // GET requests do not need a JSON Content-Type header.
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }
 
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }
 
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })
 
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`
 
    try {
      const body = (await response.json()) as {
        error?: string
        message?: string
      }
 
      message = body.error ?? body.message ?? message
    } catch {
      // If the server does not return JSON, keep the generic message.
    }
 
    throw new Error(message)
  }
 
  if (response.status === 204) {
    return undefined as T
  }
 
  return response.json() as Promise<T>
}
 
export function registerUser(input: RegisterInput): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  })
}
 
export function loginUser(input: LoginInput): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  })
}
 
export function getCurrentUser(): Promise<{ user: User }> {
  return request<{ user: User }>("/api/auth/me")
}
 
export function getInventoryItems(): Promise<InventoryItem[]> {
  return request<InventoryItem[]>("/api/inventory")
}
 
export function createInventoryItem(
  input: CreateInventoryItemInput,
): Promise<InventoryItem> {
  return request<InventoryItem>("/api/inventory", {
    method: "POST",
    body: JSON.stringify(input),
  })
}
 
export function updateInventoryStatus(
  id: number,
  status: InventoryStatus,
): Promise<InventoryItem> {
  return request<InventoryItem>(`/api/inventory/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}
 
export function deleteInventoryItem(id: number): Promise<void> {
  return request<void>(`/api/inventory/${id}`, {
    method: "DELETE",
  })
}
 
export function getSales(): Promise<Sale[]> {
  return request<Sale[]>("/api/sales")
}
 
export function createSale(input: CreateSaleInput): Promise<CreateSaleResponse> {
  return request<CreateSaleResponse>("/api/sales", {
    method: "POST",
    body: JSON.stringify(input),
  })
}
 
export function deleteSale(id: number): Promise<void> {
  return request<void>(`/api/sales/${id}`, {
    method: "DELETE",
  })
}


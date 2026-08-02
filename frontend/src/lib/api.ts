const API_BASE_URL = "http://localhost:4000"
 
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
 
// One helper handles all frontend HTTP requests.
// It turns non-OK API responses into JavaScript errors the UI can display.
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  })
 
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`
 
    try {
      const body = (await response.json()) as { message?: string }
      if (body.message) {
        message = body.message
      }
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

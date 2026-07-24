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
 
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
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
      // If the response is not JSON, keep the generic message.
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

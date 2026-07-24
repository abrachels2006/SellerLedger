import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState, type FormEvent } from "react"
import {
  createInventoryItem,
  deleteInventoryItem,
  getInventoryItems,
  updateInventoryStatus,
  type CreateInventoryItemInput,
  type InventoryStatus,
} from "../lib/api"
 
const statusOptions: { value: InventoryStatus; label: string }[] = [
  { value: "ACQUIRED", label: "Acquired" },
  { value: "LISTED", label: "Listed" },
  { value: "SOLD", label: "Sold" },
  { value: "SHIPPED", label: "Shipped" },
]
 
type InventoryFormState = {
  title: string
  sku: string
  category: string
  brand: string
  size: string
  purchasePrice: string
  listingPrice: string
  status: InventoryStatus
}
 
const emptyForm: InventoryFormState = {
  title: "",
  sku: "",
  category: "",
  brand: "",
  size: "",
  purchasePrice: "",
  listingPrice: "",
  status: "ACQUIRED",
}
 
const inputClasses =
  "mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
 
function formatMoney(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "—"
  }
 
  const numberValue = Number(value)
 
  if (Number.isNaN(numberValue)) {
    return "—"
  }
 
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numberValue)
}
 
function statusLabel(status: InventoryStatus): string {
  return statusOptions.find((option) => option.value === status)?.label ?? status
}
 
function statusBadgeClasses(status: InventoryStatus): string {
  const styles: Record<InventoryStatus, string> = {
    ACQUIRED: "bg-slate-100 text-slate-700",
    LISTED: "bg-blue-100 text-blue-700",
    SOLD: "bg-emerald-100 text-emerald-700",
    SHIPPED: "bg-purple-100 text-purple-700",
  }
 
  return `rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`
}
 
function optionalText(value: string): string | undefined {
  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
}
 
export default function Inventory() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<InventoryFormState>(emptyForm)
 
  const inventoryQuery = useQuery({
    queryKey: ["inventory"],
    queryFn: getInventoryItems,
  })
 
  const createItemMutation = useMutation({
    mutationFn: createInventoryItem,
    onSuccess: () => {
      setForm(emptyForm)
      queryClient.invalidateQueries({ queryKey: ["inventory"] })
    },
  })
 
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: InventoryStatus }) =>
      updateInventoryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] })
    },
  })
 
  const deleteItemMutation = useMutation({
    mutationFn: deleteInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] })
    },
  })
 
  const items = inventoryQuery.data ?? []
  const actionError =
    inventoryQuery.error ??
    createItemMutation.error ??
    updateStatusMutation.error ??
    deleteItemMutation.error
 
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
 
    const input: CreateInventoryItemInput = {
      title: form.title.trim(),
      purchasePrice: Number(form.purchasePrice),
      status: form.status,
      ...(optionalText(form.sku) ? { sku: optionalText(form.sku) } : {}),
      ...(optionalText(form.category)
        ? { category: optionalText(form.category) }
        : {}),
      ...(optionalText(form.brand) ? { brand: optionalText(form.brand) } : {}),
      ...(optionalText(form.size) ? { size: optionalText(form.size) } : {}),
      ...(form.listingPrice.trim()
        ? { listingPrice: Number(form.listingPrice) }
        : {}),
    }
 
    createItemMutation.mutate(input)
  }
 
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          Inventory module
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Inventory</h1>
        <p className="mt-2 text-slate-600">
          Add, review, and update items for a small seller business.
        </p>
      </div>
 
      {actionError instanceof Error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {actionError.message}
        </div>
      ) : null}
 
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-slate-900">Add inventory item</h2>
          <p className="text-sm text-slate-600">
            Start with the basic details. More advanced editing comes later.
          </p>
        </div>
 
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Title
            <input
              className={inputClasses}
              required
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              placeholder="Vintage denim jacket"
            />
          </label>
 
          <label className="text-sm font-medium text-slate-700">
            SKU
            <input
              className={inputClasses}
              value={form.sku}
              onChange={(event) =>
                setForm({ ...form, sku: event.target.value })
              }
              placeholder="JACKET-001"
            />
          </label>
 
          <label className="text-sm font-medium text-slate-700">
            Category
            <input
              className={inputClasses}
              value={form.category}
              onChange={(event) =>
                setForm({ ...form, category: event.target.value })
              }
              placeholder="Jackets"
            />
          </label>
 
          <label className="text-sm font-medium text-slate-700">
            Brand
            <input
              className={inputClasses}
              value={form.brand}
              onChange={(event) =>
                setForm({ ...form, brand: event.target.value })
              }
              placeholder="Levi's"
            />
          </label>
 
          <label className="text-sm font-medium text-slate-700">
            Size
            <input
              className={inputClasses}
              value={form.size}
              onChange={(event) =>
                setForm({ ...form, size: event.target.value })
              }
              placeholder="M"
            />
          </label>
 
          <label className="text-sm font-medium text-slate-700">
            Status
            <select
              className={inputClasses}
              value={form.status}
              onChange={(event) =>
                setForm({
                  ...form,
                  status: event.target.value as InventoryStatus,
                })
              }
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
 
          <label className="text-sm font-medium text-slate-700">
            Purchase price
            <input
              className={inputClasses}
              required
              min="0.01"
              step="0.01"
              type="number"
              value={form.purchasePrice}
              onChange={(event) =>
                setForm({ ...form, purchasePrice: event.target.value })
              }
              placeholder="24.00"
            />
          </label>
 
          <label className="text-sm font-medium text-slate-700">
            Listing price
            <input
              className={inputClasses}
              min="0.01"
              step="0.01"
              type="number"
              value={form.listingPrice}
              onChange={(event) =>
                setForm({ ...form, listingPrice: event.target.value })
              }
              placeholder="68.00"
            />
          </label>
        </div>
 
        <button
          className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={createItemMutation.isPending}
          type="submit"
        >
          {createItemMutation.isPending ? "Adding item..." : "Add item"}
        </button>
      </form>
 
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Current inventory</h2>
          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
            {items.length} items
          </span>
        </div>
 
        {inventoryQuery.isPending ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-600 shadow-sm">
            Loading inventory...
          </div>
        ) : null}
 
        {!inventoryQuery.isPending && items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
            <p className="font-semibold text-slate-900">No inventory yet</p>
            <p className="mt-2 text-sm text-slate-600">
              Add the first item above to start building SellerLedger.
            </p>
          </div>
        ) : null}
 
        <div className="grid gap-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-lg font-semibold text-slate-900">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.brand ?? "No brand"} • {item.size ?? "No size"} • {item.category ?? "No category"}
                  </p>
                </div>
 
                <span className={statusBadgeClasses(item.status)}>
                  {statusLabel(item.status)}
                </span>
              </div>
 
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <dt className="text-slate-500">Purchase</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {formatMoney(item.purchasePrice)}
                  </dd>
                </div>
 
                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <dt className="text-slate-500">Listing</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {formatMoney(item.listingPrice)}
                  </dd>
                </div>
 
                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <dt className="text-slate-500">SKU</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {item.sku ?? "—"}
                  </dd>
                </div>
              </dl>
 
              <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <label className="text-sm font-medium text-slate-700">
                  Update status
                  <select
                    className="ml-0 mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:ml-3 sm:mt-0 sm:w-auto"
                    value={item.status}
                    onChange={(event) =>
                      updateStatusMutation.mutate({
                        id: item.id,
                        status: event.target.value as InventoryStatus,
                      })
                    }
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
 
                <button
                  className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:text-slate-400"
                  disabled={deleteItemMutation.isPending}
                  onClick={() => deleteItemMutation.mutate(item.id)}
                  type="button"
                >
                  Delete unsold item
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

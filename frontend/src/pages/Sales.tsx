import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState, type FormEvent } from "react"
import {
  createSale,
  deleteSale,
  getInventoryItems,
  getSales,
  type CreateSaleInput,
  type InventoryItem,
} from "../lib/api"
 
type SaleFormState = {
  inventoryItemId: string
  soldPrice: string
  platformFee: string
  shippingCost: string
}
 
const emptyForm: SaleFormState = {
  inventoryItemId: "",
  soldPrice: "",
  platformFee: "",
  shippingCost: "",
}
 
const inputClasses =
  "mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
 
function formatMoney(value: string | number | null | undefined): string {
  const numberValue = Number(value)
 
  if (value === null || value === undefined || Number.isNaN(numberValue)) {
    return "—"
  }
 
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numberValue)
}
 
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong"
}
 
function itemLabel(item: InventoryItem): string {
  const price = item.listingPrice ? formatMoney(item.listingPrice) : "No list price"
  return `${item.title} — ${price}`
}
 
export default function Sales() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<SaleFormState>(emptyForm)
 
  // Server state: TanStack Query loads sales and inventory from the API.
  const salesQuery = useQuery({
    queryKey: ["sales"],
    queryFn: getSales,
  })
 
  const inventoryQuery = useQuery({
    queryKey: ["inventory"],
    queryFn: getInventoryItems,
  })
 
  // Only show items that can still be sold.
  const availableItems =
    inventoryQuery.data?.filter(
      (item) => item.status !== "SOLD" && item.status !== "SHIPPED",
    ) ?? []
 
  // Mutation: POST a new sale, then refresh both sales and inventory.
  const createSaleMutation = useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      setForm(emptyForm)
      queryClient.invalidateQueries({ queryKey: ["sales"] })
      queryClient.invalidateQueries({ queryKey: ["inventory"] })
    },
  })
 
  const deleteSaleMutation = useMutation({
    mutationFn: deleteSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] })
      queryClient.invalidateQueries({ queryKey: ["inventory"] })
    },
  })
 
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
 
    const input: CreateSaleInput = {
      inventoryItemId: Number(form.inventoryItemId),
      soldPrice: Number(form.soldPrice),
      platformFee: Number(form.platformFee),
      shippingCost: Number(form.shippingCost),
    }
 
    createSaleMutation.mutate(input)
  }
 
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          Week 3 workflow
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Sales</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Record a sale, save it to MySQL through the API, and automatically
          move the inventory item to SOLD.
        </p>
      </div>
 
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900">Record sale</h2>
          <p className="mt-1 text-sm text-slate-600">
            Choose an unsold inventory item and enter the sale details.
          </p>
 
          <div className="mt-5 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Inventory item
              <select
                className={inputClasses}
                required
                value={form.inventoryItemId}
                onChange={(event) =>
                  setForm({ ...form, inventoryItemId: event.target.value })
                }
              >
                <option value="">Select an item</option>
                {availableItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {itemLabel(item)}
                  </option>
                ))}
              </select>
            </label>
 
            <label className="block text-sm font-medium text-slate-700">
              Sold price
              <input
                className={inputClasses}
                min="0.01"
                required
                step="0.01"
                type="number"
                value={form.soldPrice}
                onChange={(event) =>
                  setForm({ ...form, soldPrice: event.target.value })
                }
              />
            </label>
 
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Platform fee
                <input
                  className={inputClasses}
                  min="0"
                  required
                  step="0.01"
                  type="number"
                  value={form.platformFee}
                  onChange={(event) =>
                    setForm({ ...form, platformFee: event.target.value })
                  }
                />
              </label>
 
              <label className="block text-sm font-medium text-slate-700">
                Shipping cost
                <input
                  className={inputClasses}
                  min="0"
                  required
                  step="0.01"
                  type="number"
                  value={form.shippingCost}
                  onChange={(event) =>
                    setForm({ ...form, shippingCost: event.target.value })
                  }
                />
              </label>
            </div>
          </div>
 
          {createSaleMutation.isError ? (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {getErrorMessage(createSaleMutation.error)}
            </p>
          ) : null}
 
          <button
            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={createSaleMutation.isPending}
            type="submit"
          >
            {createSaleMutation.isPending ? "Recording..." : "Record sale"}
          </button>
        </form>
 
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Sales history
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Recent sales returned by the Express API.
              </p>
            </div>
          </div>
 
          {salesQuery.isLoading ? (
            <p className="mt-6 text-sm text-slate-600">Loading sales...</p>
          ) : null}
 
          {salesQuery.isError ? (
            <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {getErrorMessage(salesQuery.error)}
            </p>
          ) : null}
 
          {salesQuery.data?.length === 0 ? (
            <p className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              No sales recorded yet. Sell something responsibly.
            </p>
          ) : null}
 
          <div className="mt-5 space-y-3">
            {salesQuery.data?.map((sale) => (
              <div
                key={sale.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {sale.inventoryItem.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Sold {new Date(sale.soldDate).toLocaleDateString()}
                    </p>
                  </div>
 
                  <p className="text-lg font-bold text-slate-900">
                    {formatMoney(sale.soldPrice)}
                  </p>
                </div>
 
                <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                  <p>Platform fee: {formatMoney(sale.platformFee)}</p>
                  <p>Shipping: {formatMoney(sale.shippingCost)}</p>
                </div>
 
                <button
                  className="mt-4 text-sm font-medium text-red-600 hover:text-red-700"
                  disabled={deleteSaleMutation.isPending}
                  onClick={() => deleteSaleMutation.mutate(sale.id)}
                  type="button"
                >
                  Delete test sale
                </button>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}

const metrics = [
  {
    label: "Estimated revenue",
    value: "$2,840",
    detail: "+12% from last month",
  },
  {
    label: "Active listings",
    value: "37",
    detail: "8 need photos",
  },
  {
    label: "Items sold",
    value: "14",
    detail: "This month",
  },
  {
    label: "Estimated profit",
    value: "$1,126",
    detail: "After fees and shipping",
  },
]

export default function Dashboard() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          Week 1 shell
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          A clean overview for a Depop seller business.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">
              {metric.label}
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {metric.value}
            </p>

            <p className="mt-1 text-xs font-medium text-blue-600">
              {metric.detail}
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Recent activity
          </h2>

          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>Sold vintage denim jacket — $68</li>
            <li>Added shipping expense — $7.80</li>
            <li>Listed black cargo pants — $42</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Inventory status
          </h2>

          <div className="mt-4 grid gap-3 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="font-medium text-slate-600">Available</span>
              <span className="font-bold text-slate-900">21</span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="font-medium text-slate-600">Listed</span>
              <span className="font-bold text-slate-900">37</span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="font-medium text-slate-600">Sold</span>
              <span className="font-bold text-slate-900">14</span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="font-medium text-slate-600">Shipped</span>
              <span className="font-bold text-slate-900">11</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

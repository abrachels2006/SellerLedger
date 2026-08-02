const metrics = [
  { label: "Estimated revenue", value: "$2,840", detail: "+12% from last month" },
  { label: "Active listings", value: "37", detail: "8 need photos" },
  { label: "Items sold", value: "14", detail: "This month" },
  { label: "Estimated profit", value: "$1,126", detail: "After fees and shipping" },
]
 
export default function Dashboard() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          Week 3 shell
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Dashboard</h1>
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
            <p className="text-sm font-medium text-slate-500">{metric.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {metric.value}
            </p>
            <p className="mt-1 text-xs font-medium text-blue-600">
              {metric.detail}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

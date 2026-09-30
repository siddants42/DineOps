import { useEffect, useState } from "react"
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Package,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Users,
} from "lucide-react"

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

import { useDashboard } from "../../hooks/useDashboard"

const chartColors = ["#10b981", "#f59e0b"]

function Dashboard() {
  const { data, loading, error, refresh } = useDashboard()

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      void refresh()
    }, 30000)

    return () => window.clearInterval(timer)
  }, [refresh])

  const formatCurrency = (value: number) =>
    `₹${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })

  const stats = [
    {
      title: "Total Revenue",
      value: data ? formatCurrency(data.total_sales) : "₹0.00",
      icon: IndianRupee,
      description: "Recorded sales value",
      accent: "emerald",
    },
    {
      title: "Total Orders",
      value: data?.total_orders ?? 0,
      icon: ShoppingBag,
      description: "All sales orders",
      accent: "blue",
    },
    {
      title: "Customers",
      value: data?.total_customers ?? 0,
      icon: Users,
      description: "Registered customers",
      accent: "violet",
    },
    {
      title: "Products",
      value: data?.total_products ?? 0,
      icon: Package,
      description: "Products in catalog",
      accent: "amber",
    },
  ]

  const orderData = data
    ? [
        {
          name: "Completed",
          value: Math.max(
            data.total_orders - data.pending_orders,
            0
          ),
        },
        {
          name: "Pending",
          value: data.pending_orders,
        },
      ].filter((item) => item.value > 0)
    : []

  return (
    <>
      <style>
        {`
          @keyframes dashboardFadeUp {
            from {
              opacity: 0;
              transform: translateY(18px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes dashboardScale {
            from {
              opacity: 0;
              transform: scale(.97);
            }

            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes dashboardFloat {
            0%, 100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-5px);
            }
          }

          @keyframes dashboardPulse {
            0%, 100% {
              opacity: .45;
              transform: scale(1);
            }

            50% {
              opacity: .9;
              transform: scale(1.08);
            }
          }
        `}
      </style>

      <div className="min-h-full space-y-7 pb-10">

        {/* ================= HERO ================= */}

        <section
          className="
            relative overflow-hidden rounded-3xl
            border border-emerald-100
            bg-gradient-to-br
            from-emerald-50
            via-white
            to-teal-50
            px-6 py-7
            shadow-sm
            dark:border-emerald-900/40
            dark:from-emerald-950/40
            dark:via-slate-900
            dark:to-teal-950/30
            lg:px-8
          "
          style={{
            animation: "dashboardFadeUp .55s ease-out both",
          }}
        >
          {/* Decorative background */}
          <div
            className="
              pointer-events-none absolute
              -right-20 -top-20
              h-64 w-64
              rounded-full
              bg-emerald-300/20
              blur-3xl
              dark:bg-emerald-500/10
            "
          />

          <div
            className="
              pointer-events-none absolute
              -bottom-24 left-1/3
              h-56 w-56
              rounded-full
              bg-teal-300/20
              blur-3xl
              dark:bg-teal-500/10
            "
          />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

            {/* Left */}
            <div>
              <div className="mb-3 flex items-center gap-2">

                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                  Live Overview
                </span>

              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white lg:text-4xl">
                Dashboard
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Monitor your restaurant operations, sales and
                customer activity from one place.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">

                <div
                  className="
                    inline-flex items-center gap-2
                    rounded-xl
                    border border-white/80
                    bg-white/80
                    px-3.5 py-2
                    shadow-sm
                    backdrop-blur
                    dark:border-slate-700
                    dark:bg-slate-900/70
                  "
                >
                  <Clock3
                    size={16}
                    className="text-emerald-500"
                  />

                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">
                      {formatTime(currentTime)}
                    </p>

                    <p className="text-[10px] text-slate-400">
                      {formatDate(currentTime)}
                    </p>
                  </div>
                </div>

                <div
                  className="
                    inline-flex items-center gap-2
                    rounded-xl
                    border border-emerald-100
                    bg-emerald-50/80
                    px-3.5 py-2
                    text-xs font-semibold
                    text-emerald-700
                    dark:border-emerald-900/50
                    dark:bg-emerald-950/40
                    dark:text-emerald-400
                  "
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Backend Connected
                </div>

              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">

              <div
                className="
                  hidden
                  h-16 w-16
                  items-center justify-center
                  rounded-2xl
                  bg-white/80
                  text-emerald-500
                  shadow-sm
                  backdrop-blur
                  dark:bg-slate-900/70
                  sm:flex
                "
                style={{
                  animation: "dashboardFloat 4s ease-in-out infinite",
                }}
              >
                <Sparkles size={28} />
              </div>

              <button
                type="button"
                onClick={() => void refresh()}
                disabled={loading}
                className="
                  group inline-flex
                  items-center justify-center gap-2
                  rounded-xl
                  bg-slate-950
                  px-5 py-3
                  text-sm font-semibold
                  text-white
                  shadow-lg
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:bg-emerald-600
                  hover:shadow-emerald-200
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  dark:bg-white
                  dark:text-slate-900
                  dark:hover:bg-emerald-400
                "
              >
                <RefreshCw
                  size={16}
                  className={
                    loading
                      ? "animate-spin"
                      : "transition-transform duration-500 group-hover:rotate-180"
                  }
                />

                {loading ? "Refreshing..." : "Refresh"}
              </button>

            </div>

          </div>
        </section>

        {/* ================= ERROR ================= */}

        {error && (
          <div
            className="
              flex items-center gap-3
              rounded-2xl
              border border-red-100
              bg-red-50
              px-4 py-3
              text-sm text-red-600
              dark:border-red-900/50
              dark:bg-red-950/30
            "
          >
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        {/* ================= KPI CARDS ================= */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {stats.map((stat, index) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.title}
                className="
                  group relative overflow-hidden
                  rounded-2xl
                  border border-slate-200/80
                  bg-white
                  p-5
                  shadow-sm
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:shadow-xl
                  dark:border-slate-800
                  dark:bg-slate-900
                "
                style={{
                  animation: "dashboardFadeUp .55s ease-out both",
                  animationDelay: `${index * 90}ms`,
                }}
              >

                <div
                  className="
                    pointer-events-none absolute
                    -right-10 -top-10
                    h-32 w-32
                    rounded-full
                    bg-emerald-100/70
                    blur-3xl
                    transition-transform duration-500
                    group-hover:scale-150
                    dark:bg-emerald-950/50
                  "
                />

                <div className="relative flex items-start justify-between">

                  <div
                    className="
                      flex h-12 w-12
                      items-center justify-center
                      rounded-2xl
                      bg-emerald-50
                      text-emerald-600
                      transition-all duration-300
                      group-hover:scale-110
                      dark:bg-emerald-950/60
                      dark:text-emerald-400
                    "
                  >
                    <Icon size={22} />
                  </div>

                  <span
                    className="
                      inline-flex items-center gap-1.5
                      rounded-full
                      border border-emerald-100
                      bg-emerald-50
                      px-2.5 py-1
                      text-[10px]
                      font-bold
                      tracking-wide
                      text-emerald-600
                      dark:border-emerald-900
                      dark:bg-emerald-950/60
                      dark:text-emerald-400
                    "
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    LIVE
                  </span>

                </div>

                <p className="relative mt-5 text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stat.title}
                </p>

                <h2 className="relative mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {loading ? (
                    <span className="inline-block h-8 w-28 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
                  ) : (
                    stat.value
                  )}
                </h2>

                <p className="relative mt-1.5 text-xs text-slate-400">
                  {stat.description}
                </p>

              </div>
            )
          })}

        </div>

        {/* ================= ANALYTICS ================= */}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

          {/* BUSINESS OVERVIEW */}

          <div
            className="
              relative overflow-hidden
              rounded-2xl
              border border-slate-200/80
              bg-white
              p-6
              shadow-sm
              transition-all duration-300
              hover:shadow-lg
              lg:col-span-2
              dark:border-slate-800
              dark:bg-slate-900
            "
            style={{
              animation: "dashboardFadeUp .6s ease-out both",
              animationDelay: "380ms",
            }}
          >

            <div
              className="
                pointer-events-none absolute
                right-0 top-0
                h-40 w-40
                rounded-full
                bg-emerald-100/40
                blur-3xl
                dark:bg-emerald-950/30
              "
            />

            <div className="relative flex items-start justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">
                  Performance
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                  Business Overview
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Current metrics from your FastAPI backend.
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <IndianRupee size={20} />
              </div>

            </div>

            <div className="relative mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* Revenue */}

              <div
                className="
                  group rounded-2xl
                  border border-emerald-100
                  bg-gradient-to-br
                  from-emerald-50
                  via-white
                  to-white
                  p-5
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:shadow-md
                  dark:border-emerald-900/40
                  dark:from-emerald-950/30
                  dark:via-slate-900
                  dark:to-slate-900
                "
              >

                <div className="flex items-center justify-between">

                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Total Revenue
                  </p>

                  <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                    <IndianRupee size={16} />
                  </div>

                </div>

                <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {loading ? (
                    <span className="inline-block h-9 w-32 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
                  ) : (
                    formatCurrency(data?.total_sales ?? 0)
                  )}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={17} />
                  Recorded from sales orders
                </div>

              </div>

              {/* Catalog */}

              <div
                className="
                  group rounded-2xl
                  border border-blue-100
                  bg-gradient-to-br
                  from-blue-50
                  via-white
                  to-white
                  p-5
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:shadow-md
                  dark:border-blue-900/40
                  dark:from-blue-950/30
                  dark:via-slate-900
                  dark:to-slate-900
                "
              >

                <div className="flex items-center justify-between">

                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Catalog & Customers
                  </p>

                  <div className="rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                    <Package size={16} />
                  </div>

                </div>

                <div className="mt-4 flex items-end gap-3">

                  <span className="text-3xl font-bold text-slate-900 dark:text-white">
                    {loading ? "..." : data?.total_products ?? 0}
                  </span>

                  <span className="pb-1 text-sm text-slate-400">
                    products
                  </span>

                </div>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {loading ? "..." : data?.total_customers ?? 0} registered customers
                </p>

              </div>

            </div>

            {/* Progress */}

            <div className="relative mt-5 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/40">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Order completion
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {data?.total_orders
                      ? Math.round(
                          ((data.total_orders - data.pending_orders) /
                            data.total_orders) *
                            100
                        )
                      : 0}
                    % completed
                  </p>
                </div>

                <CheckCircle2
                  size={19}
                  className="text-emerald-500"
                />

              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                  style={{
                    width: `${
                      data?.total_orders
                        ? Math.round(
                            ((data.total_orders -
                              data.pending_orders) /
                              data.total_orders) *
                              100
                          )
                        : 0
                    }%`,
                  }}
                />

              </div>

            </div>

          </div>

          {/* ORDER STATUS */}

          <div
            className="
              rounded-2xl
              border border-slate-200/80
              bg-white
              p-6
              shadow-sm
              transition-all duration-300
              hover:shadow-lg
              dark:border-slate-800
              dark:bg-slate-900
            "
            style={{
              animation: "dashboardScale .6s ease-out both",
              animationDelay: "480ms",
            }}
          >

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">
                Orders
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                Order Status
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Current order distribution.
              </p>
            </div>

            <div className="mt-3 h-52">

              {loading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="h-32 w-32 animate-pulse rounded-full border-[18px] border-slate-100 dark:border-slate-800" />
                </div>
              ) : orderData.length ? (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>

                    <Pie
                      data={orderData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={78}
                      paddingAngle={4}
                      animationDuration={900}
                      animationBegin={200}
                    >
                      {orderData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={
                            chartColors[
                              index % chartColors.length
                            ]
                          }
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                        boxShadow:
                          "0 10px 30px rgba(0,0,0,0.08)",
                      }}
                    />

                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  No orders yet
                </div>
              )}

            </div>

            <div className="space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">

              <div className="flex items-center justify-between text-sm">

                <span className="flex items-center gap-2 text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Total orders
                </span>

                <span className="font-bold text-slate-900 dark:text-white">
                  {loading ? "..." : data?.total_orders ?? 0}
                </span>

              </div>

              <div className="flex items-center justify-between text-sm">

                <span className="flex items-center gap-2 text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Pending
                </span>

                <span className="font-bold text-amber-600">
                  {loading ? "..." : data?.pending_orders ?? 0}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* ================= QUICK OPERATIONS ================= */}

        <div
          className="
            overflow-hidden
            rounded-2xl
            border border-slate-200/80
            bg-white
            p-6
            shadow-sm
            dark:border-slate-800
            dark:bg-slate-900
          "
          style={{
            animation: "dashboardFadeUp .6s ease-out both",
            animationDelay: "560ms",
          }}
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">
                Quick Access
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                Operations
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Quickly access important areas.
              </p>

            </div>

            <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 sm:flex dark:bg-emerald-950/60 dark:text-emerald-400">
              <ShoppingBag size={19} />
            </div>

          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">

            {/* Pending Orders */}

            <a
              href="/sales-orders"
              className="
                group relative overflow-hidden
                rounded-2xl
                border border-amber-100
                bg-gradient-to-br
                from-amber-50
                to-white
                p-5
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-lg
                dark:border-amber-900/40
                dark:from-amber-950/20
                dark:to-slate-900
              "
            >

              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-amber-200/30 blur-2xl" />

              <div className="relative">

                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Pending Orders
                </p>

                <p className="mt-2 text-3xl font-bold text-amber-600">
                  {loading ? "..." : data?.pending_orders ?? 0}
                </p>

                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  View orders
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>

              </div>

            </a>

            {/* Inventory */}

            <a
              href="/inventory"
              className="
                group relative overflow-hidden
                rounded-2xl
                border border-blue-100
                bg-gradient-to-br
                from-blue-50
                to-white
                p-5
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-lg
                dark:border-blue-900/40
                dark:from-blue-950/20
                dark:to-slate-900
              "
            >

              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-200/30 blur-2xl" />

              <div className="relative">

                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Product Catalog
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {loading ? "..." : data?.total_products ?? 0}
                </p>

                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  Open inventory
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>

              </div>

            </a>

            {/* Customers */}

            <a
              href="/customers"
              className="
                group relative overflow-hidden
                rounded-2xl
                border border-violet-100
                bg-gradient-to-br
                from-violet-50
                to-white
                p-5
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-lg
                dark:border-violet-900/40
                dark:from-violet-950/20
                dark:to-slate-900
              "
            >

              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-violet-200/30 blur-2xl" />

              <div className="relative">

                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Customers
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {loading ? "..." : data?.total_customers ?? 0}
                </p>

                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  View customers
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>

              </div>

            </a>

          </div>

        </div>

      </div>
    </>
  )
}

export default Dashboard
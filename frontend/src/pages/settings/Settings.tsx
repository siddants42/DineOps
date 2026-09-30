import { useState } from "react"
import {
  Building2,
  User,
  Bell,
  Palette,
  Save,
  Check,
} from "lucide-react"

export default function Settings() {
  const [saved, setSaved] = useState(false)

  const [restaurant, setRestaurant] = useState({
    name: "DineOps Restaurant",
    email: "restaurant@dineops.com",
    phone: "",
    address: "",
  })

  const [preferences, setPreferences] = useState({
    currency: "INR",
    timezone: "Asia/Kolkata",
    notifications: true,
  })

  function handleSave() {
    localStorage.setItem(
      "dineops_restaurant_settings",
      JSON.stringify(restaurant),
    )

    localStorage.setItem(
      "dineops_preferences",
      JSON.stringify(preferences),
    )

    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 2500)
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <p className="text-sm font-medium text-emerald-600">
          System
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>

        <p className="mt-1 text-gray-500">
          Manage your restaurant, account and ERP preferences.
        </p>
      </div>

      {/* Saved message */}
      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <Check size={18} />
          Settings saved successfully.
        </div>
      )}

      {/* Restaurant Information */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Building2 size={21} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">
              Restaurant Information
            </h2>

            <p className="text-sm text-gray-400">
              Basic information about your restaurant.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Restaurant Name
            </label>

            <input
              value={restaurant.name}
              onChange={(e) =>
                setRestaurant({
                  ...restaurant,
                  name: e.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>

            <input
              type="email"
              value={restaurant.email}
              onChange={(e) =>
                setRestaurant({
                  ...restaurant,
                  email: e.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone
            </label>

            <input
              value={restaurant.phone}
              onChange={(e) =>
                setRestaurant({
                  ...restaurant,
                  phone: e.target.value,
                })
              }
              placeholder="+91 XXXXX XXXXX"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Address
            </label>

            <input
              value={restaurant.address}
              onChange={(e) =>
                setRestaurant({
                  ...restaurant,
                  address: e.target.value,
                })
              }
              placeholder="Restaurant address"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

        </div>
      </section>

      {/* Preferences */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Palette size={21} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">
              Preferences
            </h2>

            <p className="text-sm text-gray-400">
              Configure your ERP preferences.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Currency
            </label>

            <select
              value={preferences.currency}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  currency: e.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="INR">₹ INR - Indian Rupee</option>
              <option value="USD">$ USD - US Dollar</option>
              <option value="EUR">€ EUR - Euro</option>
              <option value="GBP">£ GBP - Pound</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Timezone
            </label>

            <select
              value={preferences.timezone}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  timezone: e.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="Asia/Kolkata">
                Asia/Kolkata
              </option>

              <option value="UTC">
                UTC
              </option>
            </select>
          </div>

        </div>

        <div className="mt-6 flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-800">

          <div className="flex items-center gap-3">
            <Bell size={19} className="text-gray-500" />

            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Notifications
              </p>

              <p className="text-xs text-gray-400">
                Receive ERP notifications and alerts.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setPreferences({
                ...preferences,
                notifications: !preferences.notifications,
              })
            }
            className={`relative h-6 w-11 rounded-full transition ${
              preferences.notifications
                ? "bg-emerald-500"
                : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                preferences.notifications
                  ? "left-6"
                  : "left-1"
              }`}
            />
          </button>

        </div>
      </section>

      {/* Account */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <User size={21} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">
              Account
            </h2>

            <p className="text-sm text-gray-400">
              Your current DineOps account.
            </p>
          </div>

        </div>

        <div className="mt-5 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Account security
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Your account is protected using JWT authentication
            and role-based access control.
          </p>
        </div>

      </section>

      {/* Save */}
      <div className="flex justify-end">

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
        >
          <Save size={18} />
          Save Settings
        </button>

      </div>

    </div>
  )
}
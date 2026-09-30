import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export default function ErrorState({
  message = "Something went wrong.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
      <AlertTriangle className="mx-auto text-red-500" size={24} />
      <p className="mt-3 font-semibold text-red-700">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-red-100"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      )}
    </div>
  )
}

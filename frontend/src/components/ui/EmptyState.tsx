import { Inbox } from "lucide-react"

interface EmptyStateProps {
  title?: string
  message?: string
}

export default function EmptyState({
  title = "Nothing here yet",
  message = "There is no data to display.",
}: EmptyStateProps) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
        <Inbox size={22} />
      </div>
      <p className="mt-3 font-semibold text-gray-700">{title}</p>
      <p className="mt-1 text-sm text-gray-400">{message}</p>
    </div>
  )
}

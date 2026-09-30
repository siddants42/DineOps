import { LoaderCircle } from "lucide-react"

interface LoadingStateProps {
  label?: string
}

export default function LoadingState({ label = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-3 text-sm text-gray-500">
      <LoaderCircle size={20} className="animate-spin text-emerald-500" />
      {label}
    </div>
  )
}

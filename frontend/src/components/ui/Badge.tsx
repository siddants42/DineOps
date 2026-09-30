import type { ReactNode } from "react"

interface BadgeProps {
  children: ReactNode
  tone?: "green" | "amber" | "red" | "blue" | "gray"
}

const tones = {
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  blue: "bg-blue-50 text-blue-700",
  gray: "bg-gray-100 text-gray-600",
}

export default function Badge({ children, tone = "gray" }: BadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  )
}

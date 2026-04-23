import { CrownIcon, Target } from "lucide-react"

// Simple logo component for the navbar
export const Logo = ({ href = '/', className, size = "sm" }: { href?: string, className?: string, size?: "sm" | "md" | "lg" }) => {
  return (
    <a href={href} className={`flex items-center gap-2 ${className}`}>
      <div className={`w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md ${size === "sm" ? "w-4 h-4 text-sm" : size === "md" ? "w-12 h-12 text-base" : "w-16 h-16 text-lg"}`}>
        <CrownIcon />
      </div>
      <span className={`font-bold text-primary ${size === "sm" ? "text-sm" : size === "md" ? "text-base" : "text-lg"}`}>Branda</span>
    </a>
  )
}

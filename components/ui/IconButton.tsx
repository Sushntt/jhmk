"use client"

import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react"

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  badge?: number
  variant?: "default" | "ghost"
}

/** Hover and press feedback in CSS - see Button for the reasoning. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, children, badge, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative p-2 rounded-full transition-[background-color,transform] duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2",
          "[@media(hover:hover)]:hover:scale-110 active:scale-90",
          variant === "default" && "hover:bg-brand-100 text-brand-900",
          variant === "ghost" && "hover:bg-surface/10 text-white",
          className
        )}
        {...props}
      >
        {children}
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-badge-pop">
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </button>
    )
  }
)

IconButton.displayName = "IconButton"

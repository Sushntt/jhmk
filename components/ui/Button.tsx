"use client"

import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { ReactNode, ButtonHTMLAttributes, forwardRef } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  asChild?: boolean
  children: ReactNode
}

/**
 * Hover and press feedback are CSS transforms rather than Framer Motion.
 *
 * Every button on the site used to be a motion component, which meant dozens of
 * React-driven animations on a page. CSS does the same job on the compositor.
 * It also removed the need to omit conflicting drag/animation event types,
 * so the props type is now just the native button interface.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, asChild, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium tracking-wide transition-[background-color,color,border-color,transform] duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed " +
      // Hover scale only on real pointer devices, so a tap can't leave it stuck
      "[@media(hover:hover)]:hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 disabled:active:scale-100"

    const variants = {
      primary: "bg-brand-900 text-white hover:bg-brand-800 focus:ring-brand-900",
      secondary: "bg-brand-100 text-brand-900 hover:bg-brand-200 focus:ring-brand-400",
      outline: "border-2 border-brand-900 text-brand-900 hover:bg-brand-900 hover:text-white focus:ring-brand-900",
      ghost: "text-brand-900 hover:bg-brand-100 focus:ring-brand-400",
      gold: "bg-gold-500 text-white hover:bg-gold-600 focus:ring-gold-500",
    }

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    }

    const content = isLoading ? (
      <span className="flex items-center gap-2">
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Loading...
      </span>
    ) : (
      children
    )

    const classes = cn(baseStyles, variants[variant], sizes[size], className)

    // asChild wraps the child element (e.g. a Link) instead of rendering a real
    // <button>, so we never produce an anchor nested inside a button.
    if (asChild) {
      return (
        <Slot ref={ref} className={classes} {...props}>
          {content}
        </Slot>
      )
    }

    return (
      <button ref={ref} className={classes} disabled={disabled || isLoading} {...props}>
        {content}
      </button>
    )
  }
)

Button.displayName = "Button"

"use client"

import { motion } from "framer-motion"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { ReactNode, ButtonHTMLAttributes, forwardRef } from "react"

// Omit native event handlers whose signatures conflict with framer-motion's
// MotionProps (onDrag, onAnimationStart, etc.) — combining motion.* with
// ButtonHTMLAttributes directly is a known TS friction point that can pass
// or fail depending on the exact TypeScript patch version resolved at install time.
type ConflictingHandlers =
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragExit"
  | "onDragLeave"
  | "onDragOver"
  | "onDrop"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, ConflictingHandlers> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  asChild?: boolean
  children: ReactNode
}

// motion-enabled Slot so asChild buttons (e.g. wrapping a <Link>) still get
// the same hover/tap animation as a real <button>
const MotionSlot = motion(Slot)

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, asChild, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

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

    // asChild: render the animated wrapper around the child element (e.g. Link)
    // instead of a real <button>, so it doesn't produce invalid nested buttons/anchors.
    if (asChild) {
      return (
        <MotionSlot
          ref={ref}
          className={cn(baseStyles, variants[variant], sizes[size], className)}
          whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
          whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
          {...props}
        >
          {content}
        </MotionSlot>
      )
    }

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        disabled={disabled || isLoading}
        {...props}
      >
        {content}
      </motion.button>
    )
  }
)

Button.displayName = "Button"

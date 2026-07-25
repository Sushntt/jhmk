"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react"

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

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, ConflictingHandlers> {
  children: ReactNode
  badge?: number
  variant?: "default" | "ghost"
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, children, badge, variant = "default", ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
          variant === "default" && "hover:bg-brand-100 text-brand-900",
          variant === "ghost" && "hover:bg-white/10 text-white",
          className
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        {...props}
      >
        {children}
        {badge !== undefined && badge > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
          >
            {badge > 9 ? "9+" : badge}
          </motion.span>
        )}
      </motion.button>
    )
  }
)

IconButton.displayName = "IconButton"

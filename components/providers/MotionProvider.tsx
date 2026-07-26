"use client"

import { MotionConfig } from "framer-motion"

// CSS media queries can't reach Framer Motion's JS-driven animations, so the
// preference has to be wired in here too. "user" makes Framer respect the
// operating system's reduce-motion setting: transform and layout animations are
// skipped, opacity and colour still animate, so the interface keeps its sense
// of responsiveness without moving things around the screen.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

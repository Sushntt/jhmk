"use client"

import { useEffect, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react"
import { useBackToClose } from "@/hooks/useBackToClose"

export interface LightboxMedia {
  type: "image" | "video"
  url: string
  poster?: string
}

interface Props {
  media: LightboxMedia[]
  index: number
  alt: string
  onClose: () => void
  onIndexChange: (i: number) => void
}

export function ImageLightbox({ media, index, alt, onClose, onIndexChange }: Props) {
  // The lightbox only renders when open, so it is always "open" here
  useBackToClose(true, onClose)

  const next = useCallback(
    () => onIndexChange((index + 1) % media.length),
    [index, media.length, onIndexChange]
  )
  const prev = useCallback(
    () => onIndexChange((index - 1 + media.length) % media.length),
    [index, media.length, onIndexChange]
  )

  // Keyboard control, and lock body scroll so the page behind doesn't move
  // while the overlay is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") next()
      if (e.key === "ArrowLeft") prev()
    }
    window.addEventListener("keydown", onKey)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose, next, prev])

  const multiple = media.length > 1
  const current = media[index]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="fixed inset-0 z-[100] bg-brand-950/95 backdrop-blur-sm flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label={`${alt} — enlarged view`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 flex-shrink-0">
          <span className="text-sm text-white/60 tabular-nums">
            {multiple ? `${index + 1} / ${media.length}` : ""}
          </span>
          <button
            onClick={onClose}
            aria-label="Close enlarged view"
            className="p-3 -m-1 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Image. Clicking the backdrop closes; clicking the image itself does
            not, so a mis-tap while looking closely doesn't dismiss it. */}
        <div className="flex-1 min-h-0 relative flex items-center justify-center px-4 pb-4" onClick={onClose}>
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            drag={multiple && current?.type !== "video" ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) next()
              else if (info.offset.x > 80) prev()
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full h-full max-w-4xl cursor-grab active:cursor-grabbing"
          >
            {current?.type === "video" ? (
              <video
                key={current.url}
                src={current.url}
                poster={current.poster}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            ) : (
              <Image
                src={current?.url || ""}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, 900px"
                className="object-contain select-none"
                draggable={false}
                priority
              />
            )}
          </motion.div>

          {multiple && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prev()
                }}
                aria-label="Previous image"
                className="absolute left-2 sm:left-6 p-3 rounded-full bg-black/30 text-white/80 hover:text-white hover:bg-black/50 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  next()
                }}
                aria-label="Next image"
                className="absolute right-2 sm:right-6 p-3 rounded-full bg-black/30 text-white/80 hover:text-white hover:bg-black/50 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {multiple && (
          <div className="flex-shrink-0 px-4 pb-6">
            <div className="flex gap-2 justify-start sm:justify-center overflow-x-auto scrollbar-hide">
              {media.map((m, i) => (
                <button
                  key={i}
                  onClick={() => onIndexChange(i)}
                  aria-label={m.type === "video" ? `Play video ${i + 1}` : `View image ${i + 1}`}
                  className={`relative w-14 h-14 rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    i === index ? "border-gold-400" : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  {m.type === "video" ? (
                    <>
                      {m.poster && (
                        <Image src={m.poster} alt="" fill sizes="56px" className="object-cover opacity-60" />
                      )}
                      <span className="absolute inset-0 grid place-items-center">
                        <Play className="w-4 h-4 text-white" />
                      </span>
                    </>
                  ) : (
                    <Image src={m.url} alt="" fill sizes="56px" className="object-cover" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

import React from "react"

/**
 * Renders a product description written in Airtable's long-text field.
 *
 * Handles three shapes, because the client pastes from Word and Google Docs:
 *
 *  1. Real markdown bullets ("- item", "* item", "1. item"). These appear when
 *     the Airtable field has "Rich text formatting" switched on, which is the
 *     recommended setup.
 *  2. **bold** markdown, also produced by rich text.
 *  3. Bare lines under a heading like "Highlights:". Word and Docs bullets are
 *     visual formatting, not characters, so pasting into a PLAIN text field
 *     silently drops them and leaves bare lines. Those are detected and shown
 *     as a list, which is clearly what was intended.
 *
 * Deliberately not rendering raw HTML: the description is a field the client
 * edits freely, and injecting markup from there would be an XSS hole.
 */

type Block = { type: "p" | "ul"; items: string[] }

const EXPLICIT_BULLET = /^\s*(?:[-*•]|\d+[.)])\s+(.*)$/

/** A bare line that looks like a list item rather than a sentence. */
function looksLikeListItem(line: string): boolean {
  if (line.length > 60) return false
  if (/[.!?]$/.test(line)) return false
  if (/:$/.test(line)) return false
  return line.split(/\s+/).length <= 9
}

export function parseDescription(text: string): Block[] {
  const lines = text.replace(/\r\n/g, "\n").split("\n")
  const blocks: Block[] = []

  // A heading ending in ":" opens a run where bare lines count as list items
  let inBareList = false

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) {
      inBareList = false
      continue
    }

    const explicit = line.match(EXPLICIT_BULLET)
    if (explicit) {
      const content = explicit[1].trim()
      const last = blocks[blocks.length - 1]
      if (last && last.type === "ul") last.items.push(content)
      else blocks.push({ type: "ul", items: [content] })
      inBareList = false
      continue
    }

    if (inBareList && looksLikeListItem(line)) {
      const last = blocks[blocks.length - 1]
      if (last && last.type === "ul") last.items.push(line)
      else blocks.push({ type: "ul", items: [line] })
      continue
    }

    blocks.push({ type: "p", items: [line] })
    // "Highlights:" / "Features:" opens a bare-list run
    inBareList = /:$/.test(line)
  }

  return blocks
}

/** Renders **bold** without dangerouslySetInnerHTML. */
function withBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
      <strong key={i} className="font-medium text-brand-900">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  )
}

export function ProductDescription({
  text,
  className = "",
}: {
  text?: string
  className?: string
}) {
  if (!text?.trim()) return null
  const blocks = parseDescription(text)

  return (
    <div className={`space-y-3 ${className}`}>
      {blocks.map((block, i) =>
        block.type === "ul" ? (
          <ul key={i} className="space-y-1.5">
            {block.items.map((item, j) => (
              <li key={j} className="flex gap-2.5">
                <span className="text-gold-500 mt-[0.45em] flex-shrink-0 text-[0.5em] leading-none">
                  ●
                </span>
                <span>{withBold(item)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p key={i}>{withBold(block.items[0])}</p>
        )
      )}
    </div>
  )
}

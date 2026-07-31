import React from "react"

/**
 * Renders a product description written in Airtable's long-text field.
 *
 * Airtable stores line breaks, but HTML collapses them, so pasted content was
 * arriving on the site as one solid paragraph. This splits the text back into
 * paragraphs and turns lines beginning with -, *, • or a number into real
 * lists, which is what people actually paste from a document.
 *
 * Deliberately not rendering HTML: the description comes from a field the
 * client edits freely, and injecting raw markup from there would be an XSS
 * hole. Everything here is plain text placed into elements we control.
 */
export function ProductDescription({
  text,
  className = "",
}: {
  text?: string
  className?: string
}) {
  if (!text?.trim()) return null

  const lines = text.replace(/\r\n/g, "\n").split("\n")

  // Group consecutive bullet lines so they become a single <ul>
  const blocks: { type: "p" | "ul"; items: string[] }[] = []

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue

    const bulletMatch = line.match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)$/)

    if (bulletMatch) {
      const content = bulletMatch[1].trim()
      const last = blocks[blocks.length - 1]
      if (last && last.type === "ul") last.items.push(content)
      else blocks.push({ type: "ul", items: [content] })
    } else {
      blocks.push({ type: "p", items: [line] })
    }
  }

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
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p key={i}>{block.items[0]}</p>
        )
      )}
    </div>
  )
}

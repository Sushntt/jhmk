import { Reveal } from "@/components/animations/Reveal"

export function PolicyLayout({
  title,
  intro,
  children,
}: {
  title: string
  intro?: string
  children: React.ReactNode
}) {
  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <h1 className="text-3xl md:text-4xl font-serif text-brand-900 mb-4">{title}</h1>
          {intro && <p className="text-brand-600 leading-relaxed mb-10">{intro}</p>}
        </Reveal>
        <Reveal delay={0.1}>
          <div className="policy-body space-y-8 text-brand-600 leading-relaxed">{children}</div>
        </Reveal>
      </div>
    </div>
  )
}

export function PolicySection({
  heading,
  children,
}: {
  heading?: string
  children: React.ReactNode
}) {
  return (
    <section>
      {heading && (
        <h2 className="text-xl font-serif text-brand-900 mb-4">{heading}</h2>
      )}
      <div className="space-y-3">{children}</div>
    </section>
  )
}

export function PolicyList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="text-gold-500 mt-1.5 flex-shrink-0 text-xs">◆</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

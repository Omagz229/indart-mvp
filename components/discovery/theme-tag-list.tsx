"use client"

import { ThemeTag, ThemeRef } from "./theme-tag"

export type { ThemeRef }

interface Props {
  themes: ThemeRef[]
  size?: "sm" | "md"
  max?: number
  style?: React.CSSProperties
}

export function ThemeTagList({ themes, size = "sm", max, style }: Props) {
  if (themes.length === 0) return null
  const visible = max !== undefined ? themes.slice(0, max) : themes
  return (
    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" as const, ...style }}>
      {visible.map((t) => (
        <ThemeTag key={t.slug} name={t.name} slug={t.slug} color={t.color} size={size} />
      ))}
    </div>
  )
}

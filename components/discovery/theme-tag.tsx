"use client"

import React from "react"
import Link from "next/link"
import { GOLD, GOLD_D } from "@/lib/indart-tokens"
import { FONT_UI } from "@/lib/typography"

export interface ThemeRef {
  name: string
  slug: string
  color?: string
}

interface Props {
  name: string
  slug: string
  color?: string
  size?: "sm" | "md"
}

export function ThemeTag({ name, slug, color, size = "sm" }: Props) {
  const [hovered, setHovered] = React.useState(false)
  const accent = color ?? GOLD
  const fontSize = size === "sm" ? "9px" : "10px"
  const padding  = size === "sm" ? "4px 10px" : "5px 13px"
  return (
    <Link
      href={`/themes/${slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-block",
        position: "relative" as const,
        fontFamily: FONT_UI,
        fontSize,
        letterSpacing: "0.18em",
        color: hovered ? accent : GOLD_D,
        textTransform: "uppercase" as const,
        textDecoration: "none",
        padding,
        border: `1px solid ${hovered ? accent : "rgba(181,131,44,0.18)"}`,
        transition: "color 0.35s ease, border-color 0.35s ease",
        whiteSpace: "nowrap" as const,
      }}
    >
      <span aria-hidden style={{ position: "absolute" as const, inset: "-10px 0" }} />
      {name}
    </Link>
  )
}

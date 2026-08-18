"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@mvp/kernel/lib/cn"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

function pageWindow(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | "…")[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) pages.push("…")
  for (let p = start; p <= end; p++) pages.push(p)
  if (end < total - 1) pages.push("…")
  pages.push(total)
  return pages
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const btn =
    "inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-border px-2 text-sm text-foreground transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-40"

  return (
    <nav
      className={cn("flex items-center justify-center gap-1", className)}
      aria-label="Pagination"
    >
      <button
        type="button"
        className={btn}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </button>

      {pageWindow(currentPage, totalPages).map((p, i) =>
        p === "…" ? (
          <span
            key={`gap-${i}`}
            className="px-1 text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className={cn(
              btn,
              p === currentPage &&
                "border-primary bg-primary/10 text-primary hover:bg-primary/10",
            )}
            onClick={() => onPageChange(p)}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        className={btn}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  )
}

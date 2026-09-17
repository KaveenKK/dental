'use client'

import { useCallback, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type ComparisonSliderProps = {
  image: string
  alt: string
  projectionLabel?: string
}

export function ComparisonSlider({
  image,
  alt,
  projectionLabel = 'PROJECTION',
}: ComparisonSliderProps) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(100, Math.max(0, pct)))
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    updateFromClientX(e.clientX)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return
    updateFromClientX(e.clientX)
  }
  const onPointerUp = () => {
    draggingRef.current = false
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setPosition((p) => Math.max(0, p - 4))
    if (e.key === 'ArrowRight') setPosition((p) => Math.min(100, p + 4))
  }

  return (
    <div
      ref={containerRef}
      className="group relative aspect-[3/4] w-full select-none overflow-hidden rounded-2xl bg-[#aebac2] ring-1 ring-black/5"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* Base ("before") image */}
      <img
        src={image || '/placeholder.svg'}
        alt={alt}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Projection side — enhanced treatment via subtle grading */}
      <div
        className="absolute inset-0 h-full w-full overflow-hidden"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      >
        <img
          src={image || '/placeholder.svg'}
          alt=""
          aria-hidden
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            filter:
              'brightness(1.06) contrast(1.05) saturate(1.08) drop-shadow(0 0 0 rgba(0,0,0,0))',
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 via-transparent to-black/10" />
      </div>

      {/* Corner labels */}
      <span className="absolute left-4 top-4 font-mono text-[11px] font-medium tracking-[0.2em] text-white/85">
        BEFORE
      </span>
      <span className="absolute right-4 top-4 font-mono text-[11px] font-medium tracking-[0.2em] text-white/85">
        {projectionLabel}
      </span>

      {/* Divider line */}
      <div
        className="pointer-events-none absolute inset-y-0 z-10 w-px bg-white/90 shadow-[0_0_12px_rgba(0,0,0,0.35)]"
        style={{ left: `${position}%` }}
      />

      {/* Handle */}
      <button
        type="button"
        aria-label="Drag to compare before and projection"
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={100}
        role="slider"
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        className="absolute top-1/2 z-20 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-white/70 bg-white/15 text-white backdrop-blur-md transition-transform group-hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        style={{ left: `${position}%` }}
      >
        <ChevronLeft className="h-4 w-4 -mr-1" strokeWidth={2} />
        <ChevronRight className="h-4 w-4 -ml-1" strokeWidth={2} />
      </button>
    </div>
  )
}

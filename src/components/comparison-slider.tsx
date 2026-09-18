'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type ComparisonSliderProps = {
  image: string
  projectionImage?: string
  projectionScale?: number
  projectionOffsetX?: number
  projectionOffsetY?: number
  projectionOrigin?: string
  projectionBackdrop?: string
  alt: string
  projectionLabel?: string
}

export function ComparisonSlider({
  image,
  projectionImage,
  projectionScale = 1,
  projectionOffsetX = 0,
  projectionOffsetY = 0,
  projectionOrigin = '50% 50%',
  projectionBackdrop,
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
    if (rect.width <= 0) return
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(100, Math.max(0, pct)))
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const setWidthVar = () => {
      el.style.setProperty('--slider-w', `${el.clientWidth}px`)
    }
    setWidthVar()
    const observer = new ResizeObserver(setWidthVar)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      draggingRef.current = true
      el.setPointerCapture?.(e.pointerId)
      updateFromClientX(e.clientX)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return
      updateFromClientX(e.clientX)
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!draggingRef.current) return
      const touch = e.touches[0]
      if (!touch) return
      e.preventDefault()
      updateFromClientX(touch.clientX)
    }

    const stopDragging = () => {
      draggingRef.current = false
    }

    el.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', stopDragging)
    window.addEventListener('pointercancel', stopDragging)
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', stopDragging)
    window.addEventListener('touchcancel', stopDragging)

    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', stopDragging)
      window.removeEventListener('pointercancel', stopDragging)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', stopDragging)
      window.removeEventListener('touchcancel', stopDragging)
    }
  }, [updateFromClientX])

  return (
    <div
      ref={containerRef}
      className="group relative aspect-[3/4] w-full select-none touch-none"
    >
      <div className="absolute inset-0 overflow-hidden rounded-2xl bg-[#aebac2] ring-1 ring-black/5">
        <img
          src={image || '/placeholder.svg'}
          alt={alt}
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />

        <div
          className="pointer-events-none absolute inset-y-0 right-0 overflow-hidden"
          style={{
            width: `${100 - position}%`,
            background: projectionBackdrop,
          }}
        >
          {projectionImage && projectionScale < 1 && !projectionBackdrop && (
            <img
              src={projectionImage}
              alt=""
              aria-hidden
              draggable={false}
              className="absolute right-0 top-0 h-full max-w-none scale-110 object-cover blur-md"
              style={{ width: 'var(--slider-w)' }}
            />
          )}
          <img
            src={projectionImage || image || '/placeholder.svg'}
            alt=""
            aria-hidden
            draggable={false}
            className="absolute right-0 top-0 h-full max-w-none object-cover"
            style={{
              width: 'var(--slider-w)',
              transform: `translate(${projectionOffsetX}%, ${projectionOffsetY}%) scale(${projectionScale})`,
              transformOrigin: projectionOrigin,
              filter: projectionImage
                ? undefined
                : 'brightness(1.06) contrast(1.05) saturate(1.08)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-transparent to-black/10" />
        </div>

        <span className="pointer-events-none absolute left-3 top-3 font-mono text-[10px] font-medium tracking-[0.2em] text-white/85 sm:left-4 sm:top-4 sm:text-[11px]">
          BEFORE
        </span>
        <span className="pointer-events-none absolute right-3 top-3 font-mono text-[10px] font-medium tracking-[0.2em] text-white/85 sm:right-4 sm:top-4 sm:text-[11px]">
          {projectionLabel}
        </span>

        <div
          className="pointer-events-none absolute inset-y-0 z-10 w-px bg-white/90 shadow-[0_0_12px_rgba(0,0,0,0.35)]"
          style={{ left: `${position}%` }}
        />
      </div>

      <div
        className="pointer-events-none absolute top-1/2 z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/20 text-white shadow-[0_8px_20px_rgba(0,0,0,0.25)] backdrop-blur-md sm:h-11 sm:w-11"
        style={{ left: `${position}%` }}
      >
        <ChevronLeft className="h-4 w-4 -mr-1" strokeWidth={2} />
        <ChevronRight className="h-4 w-4 -ml-1" strokeWidth={2} />
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(position)}
        aria-label="Drag to compare before and projection"
        onChange={(e) => setPosition(Number(e.currentTarget.value))}
        className="sr-only"
      />
    </div>
  )
}

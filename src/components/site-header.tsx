'use client'

import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Logo } from './logo'

const links = [
  { label: 'Why Nevengi', href: '#why' },
  { label: 'How it works', href: '#how' },
  { label: 'Results', href: '#results' },
  { label: 'FAQ', href: '#faq' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-300 sm:px-5 ${
          scrolled
            ? 'border-black/5 bg-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl'
            : 'border-white/10 bg-white/50 backdrop-blur-md'
        }`}
      >
        <a href="#top" className="text-foreground">
          <Logo />
          <span className="sr-only">Nevengi home</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href="#login"
            className="rounded-full px-4 py-2 text-sm text-foreground/80 transition-colors hover:text-foreground"
          >
            Login
          </a>
          <a
          href="#analyze"
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Get my analysis
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="mx-auto mt-2 max-w-6xl rounded-3xl border border-black/5 bg-white/90 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl md:hidden">
          <div className="flex flex-col">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm text-foreground/80 hover:bg-secondary"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              <a
                href="#login"
                onClick={() => setOpen(false)}
                className="rounded-full px-4 py-2.5 text-center text-sm text-foreground/80"
              >
                Login
              </a>
              <a
                href="#analyze"
                onClick={() => setOpen(false)}
                className="rounded-full bg-brand px-5 py-3 text-center text-sm font-medium text-primary-foreground"
              >
                Get my analysis
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

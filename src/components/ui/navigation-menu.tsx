"use client";

import * as React from 'react';
import { Menu, Navigation, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', href: '#top' },
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Contact', href: '#contact' },
];

const EXPAND_SCROLL_THRESHOLD = 80;

export function AnimatedNavFramer() {
  const [isExpanded, setExpanded] = React.useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const lastScrollY = React.useRef(0);
  const collapsedAtScroll = React.useRef(0);
  const isExpandedRef = React.useRef(true);

  React.useEffect(() => {
    isExpandedRef.current = isExpanded;
  }, [isExpanded]);

  React.useEffect(() => {
    let frame = 0;

    const evaluate = () => {
      frame = 0;

      const latest = window.scrollY;
      const previous = lastScrollY.current;
      const scrollingDown = latest > previous + 1;
      const scrollingUp = latest < previous - 1;
      const expanded = isExpandedRef.current;

      if (latest < 24) {
        if (!expanded) {
          setExpanded(true);
        }
        collapsedAtScroll.current = 0;
        setMobileMenuOpen(false);
      } else if (expanded && scrollingDown && latest > 120) {
        setExpanded(false);
        setMobileMenuOpen(false);
        collapsedAtScroll.current = latest;
      } else if (!expanded && scrollingUp && collapsedAtScroll.current - latest > EXPAND_SCROLL_THRESHOLD) {
        setExpanded(true);
      }

      lastScrollY.current = latest;
    };

    const onScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(evaluate);
      }
    };

    evaluate();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  React.useEffect(() => {
    if (!isMobileMenuOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const shellWidth = isExpanded ? 'min(1120px, calc(100vw - 1.5rem))' : '3.5rem';

  return (
    <div
      className="fixed inset-x-0 z-[60] px-3 sm:px-4"
      style={{ top: 'calc(env(safe-area-inset-top) + 0.9rem)' }}
    >
      <div className="mx-auto flex w-full justify-center">
        <nav
          aria-label="Main navigation"
          aria-expanded={isExpanded}
          className={cn(
            'relative flex min-h-14 items-center border text-[#f1f0eb] shadow-[0_20px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl',
            'transition-[width,padding,border-radius,background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(.22,1,.36,1)]',
            isExpanded ? 'bg-[rgba(10,15,16,0.84)] border-white/10' : 'bg-[rgba(10,15,16,0.9)] border-white/15'
          )}
          style={{
            width: shellWidth,
            padding: isExpanded ? '10px 12px' : '4px',
            borderRadius: isExpanded ? '28px' : '999px',
          }}
        >
          <div
            className={cn(
              'flex w-full items-center gap-3 transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(.22,1,.36,1)]',
              isExpanded
                ? 'relative translate-y-0 scale-100 opacity-100 visible pointer-events-auto'
                : 'absolute inset-0 translate-y-1 scale-[0.98] opacity-0 invisible pointer-events-none'
            )}
          >
            <a href="#top" className="flex items-center gap-2 text-[#f1f0eb]">
              <span className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-gradient-to-b from-[#ffab5e]/20 to-[#ff8c3d]/10 text-[#ff8c3d] shadow-[0_0_0_1px_rgba(255,140,61,0.12),0_0_18px_rgba(255,140,61,0.14)]">
                <Navigation className="h-4 w-4" strokeWidth={2.2} />
              </span>
              <span className="hidden text-[11px] font-semibold tracking-[0.22em] sm:inline">CONSTRUIX</span>
            </a>

            <div className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]',
                    'text-[#a0a0a0] transition-colors duration-200 hover:bg-white/5 hover:text-[#f1f0eb]'
                  )}
                >
                  {item.name}
                </a>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <a
                href="#contact"
                className={cn(
                  'hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em]',
                  'text-[#f1f0eb] transition-colors duration-200 hover:border-[#ff8c3d]/30 hover:bg-[#ff4b12]/10 hover:text-white sm:inline-flex'
                )}
              >
                Start a project
              </a>

              <button
                type="button"
                className={cn(
                  'inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#f1f0eb] md:hidden',
                  'transition-colors duration-200 hover:border-[#ff8c3d]/30 hover:bg-[#ff4b12]/10'
                )}
                aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav-panel"
                onClick={() => setMobileMenuOpen((current) => !current)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" strokeWidth={2.2} /> : <Menu className="h-5 w-5" strokeWidth={2.2} />}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setExpanded(true)}
            className={cn(
              'absolute inset-1 flex items-center justify-center rounded-full border bg-[rgba(10,15,16,0.9)] text-[#ff8c3d]',
              'transition-[opacity,transform,visibility,background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(.22,1,.36,1)]',
              isExpanded
                ? 'pointer-events-none opacity-0 scale-75 rotate-[-16deg] invisible'
                : 'pointer-events-auto opacity-100 scale-100 rotate-0 visible border-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.24)] backdrop-blur-xl hover:border-[#ff8c3d]/30 hover:bg-[#ff4b12]/10'
            )}
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6" strokeWidth={2.2} />
          </button>

          <div
          id="mobile-nav-panel"
          className={cn(
              'absolute left-0 right-0 top-full mt-3 md:hidden transition-[opacity,transform,visibility] duration-300 ease-out',
              isExpanded && isMobileMenuOpen
                ? 'translate-y-0 opacity-100 visible pointer-events-auto'
                : 'pointer-events-none -translate-y-2 opacity-0 invisible'
            )}
        >
            <div className="grid gap-2 rounded-[24px] border border-white/10 bg-[#0a0f10]/96 p-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f1f0eb] transition-colors duration-200 hover:bg-white/5"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

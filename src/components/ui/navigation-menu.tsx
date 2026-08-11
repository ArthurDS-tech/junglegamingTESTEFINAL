"use client";

import * as React from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', href: '#top' },
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Contact', href: '#contact' },
];

const EXPAND_SCROLL_THRESHOLD = 80;

const containerVariants = {
  expanded: {
    opacity: 1,
    backgroundColor: 'rgba(10, 15, 16, 0.74)',
    borderColor: 'rgba(255, 171, 94, 0.18)',
    boxShadow: '0 20px 46px rgba(0, 0, 0, 0.22)',
    transition: {
      type: 'spring',
      damping: 18,
      stiffness: 240,
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
  collapsed: {
    opacity: 1,
    backgroundColor: 'rgba(10, 15, 16, 0.88)',
    borderColor: 'rgba(255, 171, 94, 0.24)',
    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.22)',
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 260,
      when: 'afterChildren',
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

const logoVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: 'spring', damping: 16, stiffness: 260 },
  },
  collapsed: {
    opacity: 0,
    x: -18,
    scale: 0.9,
    transition: { duration: 0.16 },
  },
};

const itemVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: 'spring', damping: 16, stiffness: 260 },
  },
  collapsed: {
    opacity: 0,
    x: -14,
    scale: 0.96,
    transition: { duration: 0.14 },
  },
};

const collapsedIconVariants = {
  expanded: {
    opacity: 0,
    scale: 0.8,
    rotate: -18,
    transition: { duration: 0.16 },
  },
  collapsed: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      damping: 16,
      stiffness: 300,
      delay: 0.08,
    },
  },
};

export function AnimatedNavFramer() {
  const [isExpanded, setExpanded] = React.useState(true);
  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);
  const scrollPositionOnCollapse = React.useRef(0);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = lastScrollY.current;
    const scrollingDown = latest > previous;
    const scrollingUp = latest < previous;

    if (latest < 20) {
      if (!isExpanded) {
        setExpanded(true);
      }
      scrollPositionOnCollapse.current = 0;
    } else if (isExpanded && scrollingDown && latest > 120) {
      setExpanded(false);
      scrollPositionOnCollapse.current = latest;
    } else if (!isExpanded && scrollingUp && scrollPositionOnCollapse.current - latest > EXPAND_SCROLL_THRESHOLD) {
      setExpanded(true);
    }

    lastScrollY.current = latest;
  });

  const handleNavClick = (event: React.MouseEvent) => {
    if (!isExpanded) {
      event.preventDefault();
      setExpanded(true);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isExpanded && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      setExpanded(true);
    }
  };

  return (
    <div className="fixed left-1/2 top-3 z-[60] w-full -translate-x-1/2 px-2 sm:top-4 sm:px-4">
      <motion.nav
        initial={{ y: -36, opacity: 0, scale: 0.98 }}
        animate={isExpanded ? 'expanded' : 'collapsed'}
        variants={containerVariants}
        aria-label={isExpanded ? 'Main navigation' : 'Expand navigation'}
        aria-expanded={isExpanded}
        role={isExpanded ? undefined : 'button'}
        tabIndex={isExpanded ? -1 : 0}
        onClick={handleNavClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative mx-auto flex h-12 items-center overflow-hidden rounded-full border backdrop-blur-xl',
          'text-[#f1f0eb] will-change-transform',
          isExpanded ? 'w-fit cursor-default justify-between gap-2 px-2.5 sm:px-3' : 'w-12 cursor-pointer justify-center px-0'
        )}
        style={{ maxWidth: 'min(calc(100vw - 1rem), 980px)' }}
      >
        <AnimatePresence initial={false}>
          {isExpanded ? (
            <motion.div
              key="expanded-nav"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex items-center gap-1 sm:gap-2"
            >
              <motion.a
                href="#top"
                variants={logoVariants}
                className="flex items-center gap-2 pl-1.5 pr-1 text-[#f1f0eb]"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-gradient-to-b from-[#ffab5e]/20 to-[#ff8c3d]/10 text-[#ff8c3d] shadow-[0_0_0_1px_rgba(255,140,61,0.12),0_0_18px_rgba(255,140,61,0.14)]">
                  <Navigation className="h-4 w-4" strokeWidth={2.2} />
                </span>
                <span className="hidden text-[11px] font-semibold tracking-[0.22em] sm:inline">CONSTRUIX</span>
              </motion.a>

              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  variants={itemVariants}
                  className={cn(
                    'rounded-full px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em]',
                    'text-[#a0a0a0] transition-colors duration-200 hover:bg-white/5 hover:text-[#f1f0eb] sm:px-3 sm:text-[11px]'
                  )}
                >
                  {item.name}
                </motion.a>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <motion.div
          variants={collapsedIconVariants}
          animate={isExpanded ? 'expanded' : 'collapsed'}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-[#0b1011]/90 text-[#ff8c3d] shadow-[0_0_0_1px_rgba(255,140,61,0.16),0_0_20px_rgba(255,140,61,0.14)]">
            <Menu className="h-5 w-5" strokeWidth={2.1} />
          </div>
        </motion.div>
      </motion.nav>
    </div>
  );
}

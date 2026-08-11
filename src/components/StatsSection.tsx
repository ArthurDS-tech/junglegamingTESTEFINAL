import { useEffect, useMemo, useRef, useState } from 'react';

type StatItem = {
  value: string;
  label: string;
};

type StatsSectionProps = {
  items: StatItem[];
};

type ParsedStatValue = {
  prefix: string;
  numericValue: number;
  suffix: string;
  decimals: number;
  targetDisplay: string;
};

function parseStatValue(value: string): ParsedStatValue {
  const match = value.match(/^([^\d-]*)(-?\d+(?:\.\d+)?)(.*)$/);

  if (!match) {
    return {
      prefix: '',
      numericValue: Number.NaN,
      suffix: value,
      decimals: 0,
      targetDisplay: value,
    };
  }

  const numericText = match[2] ?? '0';
  const decimals = numericText.includes('.') ? numericText.split('.')[1].length : 0;

  return {
    prefix: match[1] ?? '',
    numericValue: Number(numericText),
    suffix: match[3] ?? '',
    decimals,
    targetDisplay: numericText,
  };
}

function formatAnimatedValue(value: number, decimals: number) {
  if (decimals > 0) {
    return value.toFixed(decimals);
  }

  return Math.round(value).toLocaleString('en-US');
}

function AnimatedStatCard({ item, start }: { item: StatItem; start: boolean }) {
  const parsed = useMemo(() => parseStatValue(item.value), [item.value]);
  const [displayValue, setDisplayValue] = useState(parsed.decimals > 0 ? `0.${'0'.repeat(parsed.decimals)}` : '0');
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!start || hasAnimated.current) return undefined;
    hasAnimated.current = true;

    if (Number.isNaN(parsed.numericValue) || typeof window === 'undefined') {
      setDisplayValue(parsed.targetDisplay);
      return undefined;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setDisplayValue(parsed.targetDisplay);
      return undefined;
    }

    const duration = 1200;
    const easeOutCubic = (progress: number) => 1 - Math.pow(1 - progress, 3);
    let startTime = 0;
    let rafId = 0;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = easeOutCubic(progress);
      const currentValue = parsed.numericValue * eased;
      setDisplayValue(formatAnimatedValue(currentValue, parsed.decimals));

      if (progress < 1) {
        rafId = window.requestAnimationFrame(animate);
      } else {
        setDisplayValue(parsed.targetDisplay);
      }
    };

    rafId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(rafId);
  }, [parsed.decimals, parsed.numericValue, parsed.targetDisplay, start]);

  return (
    <article className="stat-card-modern" key={item.label}>
      <strong className="stats-number" aria-label={item.value}>
        {parsed.prefix}
        <span aria-hidden="true">{displayValue}</span>
        {parsed.suffix}
      </strong>
      <p className="stats-label">{item.label}</p>
    </article>
  );
}

export function StatsSection({ items }: StatsSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      });
    }, {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.18,
    });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats-section" id="projects" data-reveal ref={sectionRef}>
      <div className="stats-grid-modern">
        {items.map((item) => (
          <AnimatedStatCard key={item.label} item={item} start={isVisible} />
        ))}
      </div>
    </section>
  );
}

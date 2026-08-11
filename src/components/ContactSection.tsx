import { ArrowUpRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';

type TypingTextProps = {
  text: string;
  className?: string;
  lineDelay?: number;
  as?: 'span' | 'em' | 'p' | 'div';
};

function TypingText({ text, className, lineDelay = 0, as: Component = 'span' }: TypingTextProps) {
  const chars = useMemo(() => Array.from(text), [text]);

  return (
    <Component
      className={className}
      aria-label={text}
      style={{ '--line-delay': `${lineDelay}ms` } as CSSProperties}
    >
      {chars.map((char, index) => (
        <span
          key={`${text}-${index}`}
          className={`contact-type-char${char === ' ' ? ' is-space' : ''}`}
          style={{ '--char-index': index } as CSSProperties}
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Component>
  );
}

const rotatingPhrases = ['something real.', 'something bold.', 'something lasting.'];

function RotatingText() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const intervalId = window.setInterval(() => {
      setPhraseIndex((current) => (current + 1) % rotatingPhrases.length);
    }, 2000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <span className="contact-rotating-wrap" aria-live="polite" aria-atomic="true">
      <span key={rotatingPhrases[phraseIndex]} className="contact-rotating-text">
        {rotatingPhrases[phraseIndex]}
      </span>
    </span>
  );
}

type ContactSectionProps = {
  onCtaClick: () => void;
};

export function ContactSection({ onCtaClick }: ContactSectionProps) {
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
    <section className={`contact-section${isVisible ? ' is-visible' : ''}`} id="contact" data-reveal ref={sectionRef}>
      <div className="contact-copy">
        <p className="eyebrow contact-typing-line">
          <TypingText text="05 / YOUR NEXT MOVE" />
        </p>
        <h2 className="contact-heading">
          <TypingText as="span" className="contact-heading-line" text="Let's build" lineDelay={140} />
          <span className="contact-heading-line contact-rotating-line">
            <RotatingText />
          </span>
        </h2>
        <p className="contact-subcopy">
          From first sketch to final handoff, we keep the next step simple.
        </p>
      </div>
      <button type="button" className="contact-button" onClick={onCtaClick}>
        Start a project <ArrowUpRight size={18} />
      </button>
    </section>
  );
}

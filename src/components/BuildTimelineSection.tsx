import { useEffect, useRef, useState } from 'react';

export type BuildTimelineStep = {
  title: string;
  duration: string;
  image: string;
  alt: string;
};

type BuildTimelineSectionProps = {
  label: string;
  steps: BuildTimelineStep[];
  initialActiveIndex?: number;
};

export function BuildTimelineSection({ label, steps, initialActiveIndex = 0 }: BuildTimelineSectionProps) {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, Math.max(steps.length - 1, 0)));
  }, [steps.length]);

  useEffect(() => {
    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
    const measure = () => {
      if (viewportRef.current) {
        setViewportWidth(viewportRef.current.clientWidth);
      }
    };

    const updateFromScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const progress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height), 0, 1);

      setScrollProgress(progress);

      if (steps.length > 1) {
        setActiveIndex(Math.round(progress * (steps.length - 1)));
      }
    };

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        measure();
        updateFromScroll();
      });
    };

    measure();
    updateFromScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [steps.length]);

  const maxTranslate = viewportWidth * Math.max(steps.length - 1, 0);

  return (
    <section className="timeline-section" id="services" data-reveal ref={sectionRef}>
      <div className="timeline-shell">
        <p className="section-kicker timeline-kicker">{label}</p>

        <div className="timeline-visual" ref={viewportRef}>
          <div
            className="timeline-track"
            style={{
              transform: `translate3d(-${scrollProgress * maxTranslate}px, 0, 0)`,
            }}
          >
            {steps.map((step, index) => (
              <article className="timeline-slide" key={`${step.title}-${index}`}>
                <img src={step.image} alt={step.alt} loading="lazy" decoding="async" />
                <span className="timeline-label">{label}</span>
                <div className="timeline-overlay">
                  <h2 className="timeline-title">{step.title}</h2>
                  <p className="timeline-duration">{step.duration}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="timeline-progress" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
          {steps.map((step, index) => {
            const state = index < activeIndex ? 'is-complete' : index === activeIndex ? 'is-current' : index === activeIndex + 1 ? 'is-next' : 'is-future';
            return (
              <button
                key={`${step.title}-${index}`}
                className={`timeline-step ${state}`}
                type="button"
                aria-label={`Mostrar etapa: ${step.title}`}
                aria-pressed={index === activeIndex}
                onClick={() => {
                  setActiveIndex(index);
                  setScrollProgress(steps.length > 1 ? index / (steps.length - 1) : 0);
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

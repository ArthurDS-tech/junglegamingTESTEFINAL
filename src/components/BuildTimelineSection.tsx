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
  const [viewportWidth, setViewportWidth] = useState(0);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, Math.max(steps.length - 1, 0)));
  }, [steps.length]);

  useEffect(() => {
    const measure = () => {
      if (viewportRef.current) {
        setViewportWidth(viewportRef.current.clientWidth);
      }
    };

    measure();

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let intervalId = 0;

    if (!reduceMotion && steps.length > 1) {
      intervalId = window.setInterval(() => {
        setActiveIndex((current) => (current + 1) % steps.length);
      }, 3000);
    }

    window.addEventListener('resize', measure);

    return () => {
      if (intervalId) window.clearInterval(intervalId);
      window.removeEventListener('resize', measure);
    };
  }, [steps.length]);

  const translateX = viewportWidth * activeIndex;

  return (
    <section className="timeline-section" id="services" data-reveal>
      <div className="timeline-shell">
        <p className="section-kicker timeline-kicker">{label}</p>

        <div className="timeline-visual" ref={viewportRef}>
          <div
            className="timeline-track"
            style={{
              transform: `translate3d(-${translateX}px, 0, 0)`,
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
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

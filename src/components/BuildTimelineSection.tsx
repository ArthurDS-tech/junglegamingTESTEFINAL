import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type BuildTimelineStep = {
  title: string;
  duration: string;
  image: string;
  alt: string;
  copy?: string;
};

type BuildTimelineSectionProps = {
  label: string;
  steps: BuildTimelineStep[];
  initialActiveIndex?: number;
};

export function BuildTimelineSection({ label, steps, initialActiveIndex = 0 }: BuildTimelineSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const cards = cardRefs.current.filter((card): card is HTMLElement => Boolean(card));

    if (!section || cards.length === 0) return undefined;

    const totalTransitions = Math.max(steps.length - 1, 1);

    const syncCardTransforms = (progress: number) => {
      const activePosition = progress * totalTransitions;

      cards.forEach((card, index) => {
        const distance = index - activePosition;
        const absDistance = Math.abs(distance);
        const depth = Math.min(absDistance, 1);
        const scale = 1 - Math.min(absDistance * 0.12, 0.24);
        const opacity = 1 - Math.min(absDistance * 0.55, 0.82);
        const blur = Math.min(absDistance * 3.5, 3.5);

        gsap.set(card, {
          xPercent: distance * 34,
          yPercent: absDistance * 10,
          z: -absDistance * 240,
          rotateY: distance * -36,
          rotateX: absDistance * 7,
          scale,
          autoAlpha: opacity,
          filter: `blur(${blur}px)`,
          zIndex: 100 - Math.round(depth * 20) - index,
        });
      });
    };

    const clearCardTransforms = () => {
      gsap.set(cards, {
        clearProps: 'transform,opacity,filter,zIndex',
      });
    };

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: reduce)', () => {
      clearCardTransforms();
      scrollTriggerRef.current = null;
      setActiveIndex(initialActiveIndex);
      return undefined;
    });

    mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      syncCardTransforms(0);

      const snapConfig =
        totalTransitions > 0
          ? {
              snapTo: (value: number) => Math.round(value * totalTransitions) / totalTransitions,
              duration: { min: 0.2, max: 0.75 },
              delay: 0.04,
              ease: 'power2.out',
            }
          : undefined;

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${window.innerHeight * steps.length}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: snapConfig,
        onUpdate: (self) => {
          const nextIndex = Math.min(steps.length - 1, Math.max(0, Math.round(self.progress * totalTransitions)));
          setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
          syncCardTransforms(self.progress);
        },
        onRefresh: (self) => {
          syncCardTransforms(self.progress);
        },
      });

      scrollTriggerRef.current = trigger;

      return () => {
        scrollTriggerRef.current = null;
        trigger.kill();
        clearCardTransforms();
      };
    });

    return () => {
      scrollTriggerRef.current = null;
      mm.revert();
    };
  }, [initialActiveIndex, steps.length]);

  const setCardRef = (index: number) => (element: HTMLElement | null) => {
    cardRefs.current[index] = element;
  };

  const scrollToStep = (index: number) => {
    const safeIndex = Math.max(0, Math.min(index, steps.length - 1));
    const trigger = scrollTriggerRef.current;
    setActiveIndex(safeIndex);

    if (!trigger) return;

    const totalTransitions = Math.max(steps.length - 1, 1);
    const targetProgress = totalTransitions === 0 ? 0 : safeIndex / totalTransitions;
    const targetScrollTop = trigger.start + (trigger.end - trigger.start) * targetProgress;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({
      top: targetScrollTop,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <section className="timeline-section" id="services" ref={sectionRef}>
      <div className="timeline-shell" data-reveal>
        <div className="timeline-heading">
          <p className="section-kicker timeline-kicker">{label}</p>
          <p className="timeline-summary">Scroll to snap through the three build phases in a 3D carousel.</p>
        </div>

        <div className="timeline-stage" aria-label="Build timeline">
          {steps.map((step, index) => (
            <article
              className={`timeline-card ${index === activeIndex ? 'is-active' : ''}`}
              key={`${step.title}-${index}`}
              ref={setCardRef(index)}
            >
              <div className="timeline-card-media">
                <img src={step.image} alt={step.alt} loading="lazy" decoding="async" />
                <span className="timeline-card-badge">{String(index + 1).padStart(2, '0')}</span>
              </div>

              <div className="timeline-card-copy">
                <h2 className="timeline-title">{step.title}</h2>
                <p className="timeline-duration">{step.duration}</p>
                {step.copy ? <p className="timeline-copy">{step.copy}</p> : null}
              </div>
            </article>
          ))}
        </div>

        <div className="timeline-progress" role="tablist" aria-label="Timeline steps">
          {steps.map((step, index) => {
            const state =
              index < activeIndex ? 'is-complete' : index === activeIndex ? 'is-current' : index === activeIndex + 1 ? 'is-next' : 'is-future';

            return (
              <button
                key={`${step.title}-${index}`}
                className={`timeline-step ${state}`}
                type="button"
                aria-label={`Mostrar etapa: ${step.title}`}
                aria-pressed={index === activeIndex}
                onClick={() => {
                  scrollToStep(index);
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

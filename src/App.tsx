import { MoveUpRight } from 'lucide-react';
import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { BuildTimelineSection, type BuildTimelineStep } from './components/BuildTimelineSection';
import { ContactSection } from './components/ContactSection';
import { IntroSection } from './components/IntroSection';
import { RegistrationModal } from './components/RegistrationModal';
import { StatsSection } from './components/StatsSection';
import { AnimatedNavFramer } from './components/ui/navigation-menu';

function hideMissingImage(event: SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.style.display = 'none';
}

const introSection = {
  label: '// BROOKLYN BASED',
  imageAlt: 'Canteiro de obras em construcao com estrutura residencial ao fundo',
  imageSrc: '/images/image.png',
  copy: 'CONSTRALIX is a construction company building luxury homes in the area.',
};

const timelineSteps: BuildTimelineStep[] = [
  {
    title: 'Set the foundations',
    duration: '2-4 weeks',
    image: '/images/build-foundations.png',
    alt: 'Fundacao de obra vista de cima com escavadeira e terreno preparado',
    copy: 'We clear the site, pour the slab, and lock the base geometry that everything else depends on.',
  },
  {
    title: 'Raise the structure',
    duration: '4-8 weeks',
    image: '/images/build-structure.png',
    alt: 'Estrutura residencial em construcao com formas e materiais no canteiro',
    copy: 'Frames rise fast, the volume starts to read, and the house gets its final silhouette.',
  },
  {
    title: 'Finish and handoff',
    duration: '1-2 weeks',
    image: '/images/hero-excavator.jpg',
    alt: 'Obra finalizada com acabamento e area externa organizada',
    copy: 'Systems are tuned, the finish is polished, and the last walkthrough turns a build into a home.',
  },
];

const statsItems = [
  { value: '250+', label: 'Projects / Homes Built' },
  { value: '30+', label: 'Years Experience' },
  { value: '4.9/5', label: 'Client Rating' },
  { value: '$120M+', label: 'Built Value' },
];

function App() {
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down');
  const [isReady, setIsReady] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [heroReplayKey, setHeroReplayKey] = useState(0);
  const previousScroll = useRef(0);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const heroHasBeenVisible = useRef(false);
  const heroHasLeftViewport = useRef(false);

  useEffect(() => {
    const readyFrame = window.requestAnimationFrame(() => setIsReady(true));
    let frame = 0;

    const updateParallax = () => {
      frame = 0;
      const scrollY = window.scrollY;
      document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((element) => {
        const speed = Number(element.dataset.parallax ?? 0.08);
        const offset = (scrollY - element.offsetTop) * speed;
        element.style.setProperty('--parallax-offset', `${offset}px`);
      });
    };

    const onScroll = () => {
      const currentScroll = window.scrollY;
      if (Math.abs(currentScroll - previousScroll.current) > 3) {
        setScrollDirection(currentScroll > previousScroll.current ? 'down' : 'up');
        previousScroll.current = currentScroll;
      }
      if (!frame) frame = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.cancelAnimationFrame(readyFrame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const heroSection = heroSectionRef.current;
    if (!heroSection || !('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target !== heroSection) return;

        if (entry.isIntersecting) {
          if ((heroHasBeenVisible.current && heroHasLeftViewport.current) || (!heroHasBeenVisible.current && window.scrollY > 0)) {
            setHeroReplayKey((current) => current + 1);
          }

          heroHasBeenVisible.current = true;
          heroHasLeftViewport.current = false;
        } else if (heroHasBeenVisible.current) {
          heroHasLeftViewport.current = true;
        }
      });
    }, {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.35,
    });

    observer.observe(heroSection);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const revealTargets = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!revealTargets.length) return undefined;
    if (!('IntersectionObserver' in window)) {
      revealTargets.forEach((target) => target.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.16,
    });

    revealTargets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <AnimatedNavFramer />
      <main className={`site-shell is-scrolling-${scrollDirection} ${isReady ? 'is-ready' : ''}`} id="top">
        <div className="scroll-rail" aria-hidden="true"><span /></div>
        <section className="hero" aria-label="Construcao e engenharia" ref={heroSectionRef}>
          <div className="hero-stage" key={heroReplayKey}>
            <div className="hero-backdrop" />
            <div className="hero-vignette" />

            <div className="hero-word" aria-hidden="true">
              {['B', 'U', 'I', 'L', 'D'].map((letter, index) => (
                <span className="hero-letter" key={`${letter}-${index}`}>{letter}</span>
              ))}
            </div>
            <div className="hero-machine-wrap">
              <img className="hero-machine" src="/images/excavator-cutout.png" alt="Escavadeira amarela em uma obra" onError={hideMissingImage} />
            </div>

            <div className="hero-content">
              <div className="cta-card">
                <p>Hire us for your<br />next project.</p>
                <button type="button" className="orange-button" onClick={() => setIsSignupOpen(true)}>
                  <span>Book now</span>
                  <MoveUpRight size={18} strokeWidth={1.8} />
                </button>
              </div>
              <div className="hero-meta"><span>OPERATING SINCE 1912</span><span className="meta-line" /></div>
            </div>
            <div className="hero-bottom">
              <div className="location-lockup"><span className="slashes">///</span><span>BROOKLYN</span></div>
              <a className="scroll-cue" href="#about">SCROLL TO EXPLORE <span>↓</span></a>
            </div>
          </div>
        </section>

        <IntroSection {...introSection} onCtaClick={() => setIsSignupOpen(true)} />
        <BuildTimelineSection label="// TYPICAL BUILD TIMELINE" steps={timelineSteps} />
        <StatsSection items={statsItems} />
        <ContactSection onCtaClick={() => setIsSignupOpen(true)} />
        <footer className="site-footer" data-reveal>
          <a className="brand" href="#top">
            <span className="brand-mark" aria-hidden="true"><span /><span /></span>
            <span>CONSTRUIX</span>
          </a>
          <span>BUILDING WHAT MATTERS / 2024</span>
          <a href="#top">Back to top ↑</a>
        </footer>
      </main>
      <RegistrationModal open={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </>
  );
}

export default App;

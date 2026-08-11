import { MoveUpRight } from 'lucide-react';
import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { ContactSection } from './components/ContactSection';
import { BuildTimelineSection, type BuildTimelineStep } from './components/BuildTimelineSection';
import { IntroSection } from './components/IntroSection';
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
  buttonHref: '/about',
};

const timelineSteps: BuildTimelineStep[] = [
  {
    title: 'Set the foundations',
    duration: '2-4 weeks',
    image: '/images/build-foundations.png',
    alt: 'Fundacao de obra vista de cima com escavadeira e terreno preparado',
  },
  {
    title: 'Raise the structure',
    duration: '4-8 weeks',
    image: '/images/build-structure.png',
    alt: 'Estrutura residencial em construcao com formas e materiais no canteiro',
  },
  {
    title: 'Finish and handoff',
    duration: '1-2 weeks',
    image: '/images/hero-excavator.jpg',
    alt: 'Obra finalizada com acabamento e area externa organizada',
  },
];

const statsItems = [
  { value: '250+', label: 'Projects / Homes Built' },
  { value: '30+', label: 'Years Experience' },
  { value: '4.9★', label: 'Client Rating' },
  { value: '$120M+', label: 'Built Value' },
];

function App() {
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down');
  const [isReady, setIsReady] = useState(false);
  const previousScroll = useRef(0);

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
        <section className="hero" aria-label="Construcao e engenharia">
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
              <a className="orange-button" href="#contact"><span>Book now</span><MoveUpRight size={18} strokeWidth={1.8} /></a>
            </div>
            <div className="hero-meta"><span>OPERATING SINCE 1912</span><span className="meta-line" /></div>
          </div>
          <div className="hero-bottom">
            <div className="location-lockup"><span className="slashes">///</span><span>BROOKLYN</span></div>
            <a className="scroll-cue" href="#about">SCROLL TO EXPLORE <span>↓</span></a>
          </div>
        </section>

        <IntroSection {...introSection} />
        <BuildTimelineSection label="// TYPICAL BUILD TIMELINE" steps={timelineSteps} />
        <StatsSection items={statsItems} />
        <ContactSection />
        <footer className="site-footer" data-reveal>
          <a className="brand" href="#top">
            <span className="brand-mark" aria-hidden="true"><span /><span /></span>
            <span>CONSTRUIX</span>
          </a>
          <span>BUILDING WHAT MATTERS / 2024</span>
          <a href="#top">Back to top ↑</a>
        </footer>
      </main>
    </>
  );
}

export default App;

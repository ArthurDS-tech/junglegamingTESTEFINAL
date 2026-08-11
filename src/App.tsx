import { ArrowUpRight, Menu, MoveUpRight, X } from 'lucide-react';
import { useEffect, useRef, useState, type SyntheticEvent } from 'react';

function hideMissingImage(event: SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.style.display = 'none';
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down');
  const previousScroll = useRef(0);

  useEffect(() => {
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
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className={`site-shell is-scrolling-${scrollDirection}`} id="top">
      <div className="scroll-rail" aria-hidden="true"><span /></div>
      <section className="hero" aria-label="Construção e engenharia">
        <div className="hero-backdrop" />
        <div className="hero-vignette" />

        <header className="site-header">
          <a className="brand" href="#top" aria-label="Construix início">
            <span className="brand-mark" aria-hidden="true"><span /><span /></span>
            <span>CONSTRUIX</span>
          </a>

          <nav className="main-nav" aria-label="Navegação principal">
            <a className="nav-link active" href="#top">Home</a>
            <a className="nav-link" href="#projects">Projects</a>
            <a className="nav-link" href="#services">Services</a>
            <a className="nav-link" href="#about">About</a>
          </nav>

          <a className="start-link" href="#contact">
            <span>Start a project</span><ArrowUpRight size={15} strokeWidth={2.2} />
          </a>
          <button className="menu-button" type="button" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={22} strokeWidth={1.7} /> : <Menu size={22} strokeWidth={1.7} />}
          </button>
          <nav className={`mobile-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Menu mobile">
            <a href="#top" onClick={closeMenu}>Home</a>
            <a href="#projects" onClick={closeMenu}>Projects</a>
            <a href="#services" onClick={closeMenu}>Services</a>
            <a href="#about" onClick={closeMenu}>About</a>
            <a href="#contact" onClick={closeMenu}>Start a project <ArrowUpRight size={15} /></a>
          </nav>
        </header>

        <div className="hero-word" aria-hidden="true">BUILD</div>
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

      <section className="manifesto section-grid" id="about">
        <div className="section-label"><span>///</span><small>ABOUT<br />CONSTRUIX</small></div>
        <div className="manifesto-copy reveal-up">
          <p className="eyebrow">02 / THE FAST LANE</p>
          <h1>Probably the<br /><strong>fastest builders</strong><br />on the planet.</h1>
          <a className="dark-button" href="#services">About us <ArrowUpRight size={13} /></a>
        </div>
        <div className="manifesto-image image-frame" data-parallax="0.09" aria-label="Obra em construção">
          <div className="image-glow" />
          <span className="image-tag">LIVE SITE / 04</span>
        </div>
      </section>

      <section className="foundation-section" id="services">
        <div className="foundation-image" data-parallax="0.06"><div className="foundation-shade" /></div>
        <div className="foundation-content">
          <p className="eyebrow light">03 / FROM THE GROUND UP</p>
          <h2>Set the<br /><em>foundations.</em></h2>
          <p className="foundation-copy">We turn ambitious plans into solid ground, smart structures and places built to last.</p>
          <a className="outline-button" href="#projects">Explore services <ArrowUpRight size={15} /></a>
        </div>
        <div className="vertical-note">/// &nbsp; CONCRETE / STEEL / PURPOSE</div>
      </section>

      <section className="proof-section" id="projects">
        <div className="proof-header"><p className="eyebrow">04 / THE NUMBERS</p><p>Measured in more than metres.</p></div>
        <div className="stats-grid">
          <div className="stat"><strong>250<span>+</span></strong><small>PROJECTS<br />DELIVERED</small></div>
          <div className="stat"><strong>30<span>+</span></strong><small>YEARS OF<br />CRAFT</small></div>
          <div className="stat"><strong>4.9<span>★</span></strong><small>CLIENT<br />RATING</small></div>
          <div className="stat"><strong>$120M<span>+</span></strong><small>VALUE<br />CREATED</small></div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div><p className="eyebrow">05 / YOUR NEXT MOVE</p><h2>Let&apos;s build<br /><em>something real.</em></h2></div>
        <a className="contact-button" href="mailto:hello@construix.co">Start a project <ArrowUpRight size={18} /></a>
      </section>
      <footer className="site-footer"><a className="brand" href="#top"><span className="brand-mark" aria-hidden="true"><span /><span /></span><span>CONSTRUIX</span></a><span>BUILDING WHAT MATTERS / 2024</span><a href="#top">Back to top ↑</a></footer>
    </main>
  );
}

export default App;

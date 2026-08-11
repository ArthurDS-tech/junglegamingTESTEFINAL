import { ArrowUpRight } from 'lucide-react';

type IntroSectionProps = {
  label: string;
  imageAlt: string;
  imageSrc: string;
  copy: string;
  buttonHref: string;
};

export function IntroSection({ label, imageAlt, imageSrc, copy, buttonHref }: IntroSectionProps) {
  return (
    <section className="content-section intro-section" id="about" data-reveal>
      <div className="intro-grid">
        <div className="intro-copy-wrap">
          <p className="section-kicker">{label}</p>
          <h2 className="section-headline">
            Probably the<br />
            <span>fastest builders</span><br />
            on the planet.
          </h2>
          <a className="section-button" href={buttonHref}>
            <span>About us</span>
            <span className="section-button-icon" aria-hidden="true">
              <ArrowUpRight size={15} strokeWidth={2.2} />
            </span>
          </a>
        </div>

        <div className="intro-media">
          <div className="section-media">
            <img src={imageSrc} alt={imageAlt} loading="lazy" decoding="async" />
          </div>
          <p className="section-copy">{copy}</p>
        </div>
      </div>
    </section>
  );
}

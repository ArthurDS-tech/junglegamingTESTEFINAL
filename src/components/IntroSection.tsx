import { ArrowUpRight } from 'lucide-react';

type IntroSectionProps = {
  label: string;
  imageAlt: string;
  imageSrc: string;
  copy: string;
  onCtaClick: () => void;
};

export function IntroSection({ label, imageAlt, imageSrc, copy, onCtaClick }: IntroSectionProps) {
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
          <button type="button" className="section-button" onClick={onCtaClick}>
            <span>Start a project</span>
            <span className="section-button-icon" aria-hidden="true">
              <ArrowUpRight size={15} strokeWidth={2.2} />
            </span>
          </button>
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

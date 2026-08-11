import { ArrowUpRight, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect, useId, useRef, type MouseEvent as ReactMouseEvent } from 'react';

type RegistrationModalProps = {
  open: boolean;
  onClose: () => void;
};

export function RegistrationModal({ open, onClose }: RegistrationModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const projectId = useId();
  const messageId = useId();
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';

    const focusFrame = window.requestAnimationFrame(() => {
      firstFieldRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open]);

  if (!open || typeof document === 'undefined') return null;

  const handleBackdropMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onClose();
  };

  return createPortal(
    <div className="signup-modal" onMouseDown={handleBackdropMouseDown}>
      <div
        className="signup-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <button type="button" className="signup-close" aria-label="Close registration form" onClick={onClose}>
          <X size={18} strokeWidth={2} />
        </button>

        <div className="signup-modal-grid">
          <div className="signup-modal-copy">
            <p className="signup-modal-kicker">Quick registration</p>
            <h2 id={titleId} className="signup-modal-title">Let's get your project moving.</h2>
            <p id={descriptionId}>
              Share a few details and our team will follow up with a tailored next step.
            </p>

            <ul className="signup-modal-points">
              <li>Response in one business day</li>
              <li>Residential and commercial projects</li>
              <li>Clear scope before we start</li>
            </ul>
          </div>

          <form className="signup-modal-form" onSubmit={handleSubmit}>
            <div className="signup-form-grid">
              <div className="signup-field">
                <label htmlFor={nameId}>Name</label>
                <input ref={firstFieldRef} id={nameId} name="name" type="text" autoComplete="name" placeholder="Your name" required />
              </div>

              <div className="signup-field">
                <label htmlFor={emailId}>Email</label>
                <input id={emailId} name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
              </div>

              <div className="signup-field">
                <label htmlFor={phoneId}>Phone</label>
                <input id={phoneId} name="phone" type="tel" autoComplete="tel" placeholder="(00) 00000-0000" />
              </div>

              <div className="signup-field">
                <label htmlFor={projectId}>Project type</label>
                <select id={projectId} name="projectType" defaultValue="residential">
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="renovation">Renovation</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="signup-field signup-field-full">
                <label htmlFor={messageId}>Project notes</label>
                <textarea
                  id={messageId}
                  name="message"
                  placeholder="Tell us what you want to build."
                  rows={4}
                />
              </div>
            </div>

            <div className="signup-modal-actions">
              <button type="submit" className="signup-submit">
                Submit registration <ArrowUpRight size={18} strokeWidth={1.8} />
              </button>
              <p className="signup-note">No spam, just a quick follow-up from the team.</p>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
}

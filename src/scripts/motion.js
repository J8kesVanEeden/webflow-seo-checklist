/*
 * Light, tasteful motion for the SEO checklist (a tool, not a showcase):
 *   1. A one-time hero h1 letter reveal (rise + fade, clean power3.out) — no loops.
 *   2. Subtle fade-up of each content section as it scrolls into view (once).
 *
 * Guardrails: honors prefers-reduced-motion (everything static); NEVER permanently
 * hides content — sections are only hidden when JS is present, revealed on scroll-in
 * via IntersectionObserver, and a safety timer un-hides anything left over. The hero
 * h1 has its own no-flash hide + fallback reveal. Splits words+chars so the heading
 * never breaks mid-word. Scroll reveals are pure CSS (no ScrollTrigger) for weight.
 */
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const h1 = document.querySelector('.hero__heading');

function revealHeading() {
  if (h1) h1.style.visibility = 'visible';
}

// ── 1. Hero heading reveal ───────────────────────────────────────────────────
if (reduce) {
  revealHeading();
} else {
  const runHero = () => {
    if (!h1) return;
    try {
      const split = new SplitText(h1, {
        type: 'words,chars',
        wordsClass: 'sh-word',
        charsClass: 'sh-char',
        aria: 'auto',
      });
      revealHeading();
      gsap.from(split.chars, {
        yPercent: 120, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.018,
      });
    } catch (e) {
      revealHeading();
    }
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(runHero);
  else runHero();
}

// ── 2. Section fade-ups (IntersectionObserver + CSS, bulletproof) ────────────
if (!reduce) {
  const sections = Array.from(document.querySelectorAll('main > section:not(.hero)'));
  const targets = sections.map((s) => s.querySelector(':scope > .container') || s);

  // Hide only now that JS is confirmed running (no-JS keeps everything visible).
  targets.forEach((t) => t.classList.add('pre-reveal'));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.remove('pre-reveal');
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  targets.forEach((t) => io.observe(t));

  // Safety net: never leave anything hidden, whatever happens.
  setTimeout(() => {
    document.querySelectorAll('.pre-reveal').forEach((el) => el.classList.remove('pre-reveal'));
  }, 4000);
}

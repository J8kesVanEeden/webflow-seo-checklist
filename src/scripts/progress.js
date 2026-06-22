/**
 * Progress tracking — progressive enhancement.
 *
 * Checkboxes are real <input>s and work without this script. Here we add:
 *   - persistence in localStorage (survives refresh + return visits)
 *   - overall % (ring + bar + count) and per-phase counts
 *   - a reset button
 *
 * Storage key is versioned so we can change the data shape later without
 * corrupting anyone's saved progress.
 */
const KEY = 'wsac:v1:progress';
const RING_CIRCUMFERENCE = 87.96; // 2 * pi * r, r = 14

function load() {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) || '[]'));
  } catch {
    return new Set();
  }
}

function save(set) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...set]));
  } catch {
    /* storage blocked (private mode) — progress just won't persist */
  }
}

function init() {
  const checked = load();
  const boxes = Array.from(document.querySelectorAll('.js-item'));
  const total = boxes.length;
  if (!total) return;

  const ring = document.querySelector('.js-ring');
  const pctEl = document.querySelector('.js-pct');
  const doneEl = document.querySelector('.js-done');
  const fillEl = document.querySelector('.js-fill');
  const resetBtn = document.querySelector('.js-reset');

  // Map each phase id -> its checkboxes (for per-phase counts).
  const phaseGroups = Array.from(document.querySelectorAll('[data-phase-group]')).map((group) => ({
    id: group.getAttribute('data-phase-group'),
    boxes: Array.from(group.querySelectorAll('.js-item')),
  }));

  function render() {
    let done = 0;
    for (const box of boxes) {
      const on = checked.has(box.dataset.id);
      box.checked = on;
      const article = box.closest('[data-item-id]');
      if (article) article.classList.toggle('is-done', on);
      if (on) done++;
    }

    const ratio = done / total;
    const pct = Math.round(ratio * 100);
    if (ring) ring.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - ratio));
    if (pctEl) pctEl.textContent = pct + '%';
    if (doneEl) doneEl.textContent = String(done);
    if (fillEl) fillEl.style.width = pct + '%';

    for (const phase of phaseGroups) {
      const pdone = phase.boxes.filter((b) => checked.has(b.dataset.id)).length;
      const complete = pdone === phase.boxes.length && phase.boxes.length > 0;
      document
        .querySelectorAll(`[data-phase-progress="${phase.id}"]`)
        .forEach((el) => (el.textContent = `${pdone}/${phase.boxes.length}`));
      document
        .querySelectorAll(`[data-phase-link="${phase.id}"]`)
        .forEach((el) => el.classList.toggle('is-complete', complete));
    }
  }

  for (const box of boxes) {
    box.addEventListener('change', () => {
      if (box.checked) checked.add(box.dataset.id);
      else checked.delete(box.dataset.id);
      save(checked);
      render();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (checked.size === 0) return;
      if (confirm('Reset all progress? This clears every checkbox on the list.')) {
        checked.clear();
        save(checked);
        render();
      }
    });
  }

  render();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

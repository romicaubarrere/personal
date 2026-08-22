(() => {
  const notes = new Map([
    ['fisica', 'acá hubo caos'],
    ['habitar', 'muchas horas acá']
  ]);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeNote = null;
  let hideTimer = null;
  let lastTrigger = { key: '', at: 0 };

  function projectTrigger(target) {
    if (!(target instanceof Element)) return null;
    const button = target.closest('.spine[data-book], .project-brief[data-book]');
    if (!(button instanceof HTMLElement)) return null;
    const id = button.dataset.book ?? '';
    const text = notes.get(id);
    return text ? { button, id, text } : null;
  }

  function removeNote() {
    if (hideTimer) window.clearTimeout(hideTimer);
    activeNote?.remove();
    activeNote = null;
    hideTimer = null;
  }

  function placeNote(note, anchor, inModal) {
    const rect = anchor.getBoundingClientRect();
    const width = Math.min(210, Math.max(140, window.innerWidth - 28));
    const preferredLeft = inModal ? rect.left + 18 : rect.left + (rect.width / 2) - (width / 2);
    const preferredTop = inModal ? rect.top + 18 : rect.top - 52;
    const left = Math.max(14, Math.min(preferredLeft, window.innerWidth - width - 14));
    const top = Math.max(68, Math.min(preferredTop, window.innerHeight - 70));

    note.style.left = `${left}px`;
    note.style.top = `${top}px`;
    note.style.width = `${width}px`;
  }

  function showNote(anchor, text, inModal = false) {
    if (reduceMotion.matches || !(anchor instanceof HTMLElement)) return;
    removeNote();

    const note = document.createElement('span');
    note.className = 'context-scribble';
    note.setAttribute('aria-hidden', 'true');
    note.textContent = text;
    note.style.cssText = [
      'position:fixed',
      'z-index:210',
      'pointer-events:none',
      'padding:5px 10px 6px',
      'background:rgba(250,243,228,.94)',
      'color:#974629',
      'font-family:Caveat,cursive',
      'font-size:19px',
      'line-height:1.05',
      'text-align:center',
      'box-shadow:2px 4px 0 rgba(36,31,24,.18)',
      'transform:rotate(-2deg)'
    ].join(';');
    document.body.append(note);
    activeNote = note;
    placeNote(note, anchor, inModal);
    note.animate(
      [
        { opacity: 0, translate: '0 5px', scale: .96 },
        { opacity: 1, translate: '0 0', scale: 1, offset: .12 },
        { opacity: 1, translate: '0 0', scale: 1, offset: .72 },
        { opacity: 0, translate: '0 -3px', scale: .98 }
      ],
      { duration: 1100, easing: 'ease', fill: 'both' }
    );

    hideTimer = window.setTimeout(removeNote, 1100);
  }

  function recentlyTriggered(key) {
    const now = performance.now();
    const repeated = lastTrigger.key === key && now - lastTrigger.at < 320;
    lastTrigger = { key, at: now };
    return repeated;
  }

  document.addEventListener('focusin', (event) => {
    const match = projectTrigger(event.target);
    if (!match || recentlyTriggered(`focus:${match.id}`)) return;
    showNote(match.button, match.text);
  });

  document.addEventListener('pointerover', (event) => {
    if (event.pointerType && event.pointerType !== 'mouse') return;
    const match = projectTrigger(event.target);
    if (!match || match.button.contains(event.relatedTarget) || recentlyTriggered(`hover:${match.id}`)) return;
    showNote(match.button, match.text);
  });

  document.addEventListener('click', (event) => {
    const match = projectTrigger(event.target);
    if (!match) return;

    window.setTimeout(() => {
      const frame = document.querySelector('.bookmodal.open .bookframe');
      showNote(frame instanceof HTMLElement ? frame : match.button, match.text, frame instanceof HTMLElement);
    }, 0);
  });

  reduceMotion.addEventListener?.('change', (event) => {
    if (event.matches) removeNote();
  });
})();

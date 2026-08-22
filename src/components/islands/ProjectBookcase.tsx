import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent
} from 'react';
import {
  PROJECTS,
  pagesFor,
  projectById,
  type ProjectBook,
  type ProjectPage
} from '../../data/projects';

type TurnDirection = 'next' | 'prev';

function projectFromUrl(): { project: ProjectBook; page: number } | null {
  if (!window.location.hash.startsWith('#project=')) return null;

  const params = new URLSearchParams(window.location.hash.slice(1));
  const project = projectById(params.get('project'));
  if (!project) return null;

  const parsedPage = Number.parseInt(params.get('page') ?? '0', 10);
  return { project, page: Number.isFinite(parsedPage) ? parsedPage : 0 };
}

function projectUrl(projectId: string, page: number): string {
  return `${window.location.pathname}${window.location.search}#project=${encodeURIComponent(projectId)}&page=${page}`;
}

function Page({ page, project }: { page: ProjectPage | null; project: ProjectBook }) {
  if (!page) {
    return <div className="pgc"><div className="pfoot">❦</div></div>;
  }

  if (page.kind === 'cover') {
    return (
      <div className="pgc cover" style={{ '--bc': project.color } as CSSProperties}>
        <div className="emblem">✦</div>
        <div className="ctag">{project.tag}</div>
        <h3>{page.title}</h3>
        <div className="kbig">{page.subtitle}</div>
      </div>
    );
  }

  return (
    <div className="pgc">
      <div className="kbig">{page.title}</div>
      <div className="pbody" dangerouslySetInnerHTML={{ __html: page.html }} />
      <div className="pfoot">❧</div>
    </div>
  );
}

export default function ProjectBookcase() {
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  // El HTML inicial conserva el estante desplazable en el orden de foco para móvil.
  // Al hidratar, desktop retira ese tab stop redundante sin ocultar sus botones.
  const [isMobile, setIsMobile] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [turn, setTurn] = useState<TurnDirection | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const openedFromPageRef = useRef(false);

  const project = useMemo(() => projectById(currentId) ?? null, [currentId]);
  const pages = useMemo(() => project ? pagesFor(project) : [], [project]);
  const paddedPages = useMemo(() => pages.length % 2 ? [...pages, null] : pages, [pages]);
  const spread = Math.floor(pageIndex / 2);
  const spreadCount = Math.ceil(paddedPages.length / 2);
  const isOpen = project !== null;

  const replaceProjectUrl = useCallback((id: string, page: number) => {
    window.history.replaceState(
      { portfolioProject: true },
      '',
      projectUrl(id, page)
    );
  }, []);

  const openBook = useCallback((
    nextProject: ProjectBook,
    trigger: HTMLElement | null,
    options: { page?: number; history?: boolean; focus?: boolean } = {}
  ) => {
    const pageCount = pagesFor(nextProject).length;
    const nextPage = Math.max(0, Math.min(options.page ?? 0, pageCount - 1));

    lastFocusRef.current = trigger ?? (document.activeElement as HTMLElement | null);
    openedFromPageRef.current = options.history !== false;
    setTurn(null);
    setCurrentId(nextProject.id);
    setPageIndex(nextPage);

    if (options.history !== false) {
      window.history.pushState(
        { portfolioProject: true },
        '',
        projectUrl(nextProject.id, nextPage)
      );
    }

    if (options.focus !== false) {
      window.requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }));
    }
  }, []);

  const closeBook = useCallback((options: { history?: boolean } = {}) => {
    setTurn(null);
    setCurrentId(null);
    document.body.classList.remove('modal-open');

    const lastFocus = lastFocusRef.current;
    if (lastFocus?.isConnected) {
      window.requestAnimationFrame(() => lastFocus.focus({ preventScroll: true }));
    }
    lastFocusRef.current = null;

    if (options.history !== false) {
      if (openedFromPageRef.current) window.history.back();
      else window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
    openedFromPageRef.current = false;
  }, []);

  const syncProjectFromUrl = useCallback(() => {
    const target = projectFromUrl();
    if (!target) {
      closeBook({ history: false });
      return;
    }

    const targetPages = pagesFor(target.project);
    const nextPage = Math.max(0, Math.min(target.page, targetPages.length - 1));
    openedFromPageRef.current = false;
    setTurn(null);
    setCurrentId(target.project.id);
    setPageIndex(nextPage);
  }, [closeBook]);

  const finishTurn = useCallback(() => {
    if (!turn || !project) return;
    const nextPage = turn === 'next' ? pageIndex + 2 : pageIndex - 2;
    const boundedPage = Math.max(0, Math.min(nextPage, pages.length - 1));
    setTurn(null);
    setPageIndex(boundedPage);
    replaceProjectUrl(project.id, boundedPage);
  }, [pageIndex, pages.length, project, replaceProjectUrl, turn]);

  const changePage = useCallback((direction: TurnDirection) => {
    if (!project || turn) return;

    if (isMobile) {
      const delta = direction === 'next' ? 1 : -1;
      const nextPage = Math.max(0, Math.min(pageIndex + delta, pages.length - 1));
      if (nextPage === pageIndex) return;
      setPageIndex(nextPage);
      replaceProjectUrl(project.id, nextPage);
      return;
    }

    const nextSpread = spread + (direction === 'next' ? 1 : -1);
    if (nextSpread < 0 || nextSpread >= spreadCount) return;

    if (reducedMotion) {
      const nextPage = Math.min(nextSpread * 2, pages.length - 1);
      setPageIndex(nextPage);
      replaceProjectUrl(project.id, nextPage);
      return;
    }

    setTurn(direction);
  }, [isMobile, pageIndex, pages.length, project, reducedMotion, replaceProjectUrl, spread, spreadCount, turn]);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 720px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMobile = () => setIsMobile(mobileQuery.matches);
    const updateMotion = () => setReducedMotion(motionQuery.matches);

    updateMobile();
    updateMotion();
    mobileQuery.addEventListener?.('change', updateMobile);
    motionQuery.addEventListener?.('change', updateMotion);
    window.addEventListener('popstate', syncProjectFromUrl);
    window.addEventListener('hashchange', syncProjectFromUrl);
    syncProjectFromUrl();

    return () => {
      mobileQuery.removeEventListener?.('change', updateMobile);
      motionQuery.removeEventListener?.('change', updateMotion);
      window.removeEventListener('popstate', syncProjectFromUrl);
      window.removeEventListener('hashchange', syncProjectFromUrl);
    };
  }, [syncProjectFromUrl]);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const island = modal.closest('astro-island');
    const bodyElements = Array.from(document.body.children).filter(
      (element): element is HTMLElement => element instanceof HTMLElement && element.tagName !== 'SCRIPT'
    );
    const islandElements = island
      ? Array.from(island.children).filter(
          (element): element is HTMLElement => element instanceof HTMLElement && element !== modal
        )
      : [];

    for (const element of bodyElements) {
      if (element !== island) element.inert = isOpen;
    }
    for (const element of islandElements) element.inert = isOpen;
    document.body.classList.toggle('modal-open', isOpen);

    return () => {
      for (const element of bodyElements) element.inert = false;
      for (const element of islandElements) element.inert = false;
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeBook();
      else if (event.key === 'ArrowRight') changePage('next');
      else if (event.key === 'ArrowLeft') changePage('prev');
      else if (event.key === 'Tab') {
        const modal = modalRef.current;
        if (!modal) return;
        const focusable = Array.from(
          modal.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')
        ).filter((element) => element.offsetParent !== null);
        if (!focusable.length) {
          event.preventDefault();
          modal.focus();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && (document.activeElement === first || !modal.contains(document.activeElement))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [changePage, closeBook, isOpen]);

  const handleModalKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && event.target === event.currentTarget) closeBook();
  };

  const previousDisabled = isMobile ? pageIndex <= 0 : spread <= 0;
  const nextDisabled = isMobile ? pageIndex + 1 >= pages.length : spread + 1 >= spreadCount;
  const visibleLeftIndex = turn === 'prev' ? (spread - 1) * 2 : spread * 2;
  const visibleRightIndex = turn === 'next' ? (spread + 1) * 2 + 1 : spread * 2 + 1;
  const leftPage = project ? paddedPages[visibleLeftIndex] ?? null : null;
  const rightPage = project ? paddedPages[visibleRightIndex] ?? null : null;
  const turnFront = project && turn === 'next'
    ? paddedPages[spread * 2 + 1] ?? null
    : project && turn === 'prev'
      ? paddedPages[(spread - 1) * 2 + 1] ?? null
      : null;
  const turnBack = project && turn === 'next'
    ? paddedPages[spread * 2 + 2] ?? null
    : project && turn === 'prev'
      ? paddedPages[spread * 2] ?? null
      : null;

  return (
    <>
      <section className="shelfsec" id="proyectos">
        <div className="hd reveal">
          <h2>Mi <em>estante</em> de proyectos</h2>
          <p>tocá un libro para abrirlo y pasar sus páginas →</p>
        </div>
        <div className="bookshelf">
          <div className="shelf-scroll" role="region" aria-label="Estante de proyectos desplazable" tabIndex={isMobile ? 0 : -1}>
            <div className="shelf-track">
              <div className="plank top" />
              <div className="books">
                {PROJECTS.map((book) => (
                  <button
                    className={`spine ${book.spineClass}`}
                    type="button"
                    data-book={book.id}
                    aria-haspopup="dialog"
                    aria-label={book.ariaLabel}
                    key={book.id}
                    onClick={(event) => openBook(book, event.currentTarget)}
                  >
                    <span className="band" />
                    {book.bands === 2 && <span className="band b" />}
                    <span className="t">{book.spineLabel}</span>
                  </button>
                ))}
              </div>
              <div className="plank" />
            </div>
          </div>
          <svg className="potplant" viewBox="0 0 120 150" aria-hidden="true" focusable="false">
            <use href="#pot" />
          </svg>
        </div>
        <ul className="project-summaries" aria-label="Resumen de proyectos">
          {PROJECTS.filter((book) => book.summary).map((book) => (
            <li key={book.id}>
              <article
                className="project-summary"
                style={{ '--summary-color': book.color } as CSSProperties}
              >
                <span className="tag">{book.tag}</span>
                <h3>{book.title}</h3>
                <p>{book.summary}</p>
                <button
                  className="project-brief"
                  type="button"
                  data-book={book.id}
                  aria-haspopup="dialog"
                  aria-label={`Abrir caso de proyecto: ${book.title}`}
                  onClick={(event) => openBook(book, event.currentTarget)}
                >
                  Abrir caso <span aria-hidden="true">→</span>
                </button>
              </article>
            </li>
          ))}
        </ul>
        <div className="shelfhint hand">todavía queda lugar en el estante</div>
      </section>

      <div
        className={`bookmodal${isOpen ? ' open' : ''}`}
        id="bookmodal"
        role="dialog"
        aria-modal="true"
        aria-hidden={isOpen ? 'false' : 'true'}
        aria-labelledby="bookDialogTitle"
        inert={isOpen ? undefined : true}
        tabIndex={-1}
        ref={modalRef}
        onKeyDown={handleModalKeyDown}
      >
        <div className="bm-backdrop" data-close onClick={() => closeBook()} />
        <div className="bookframe">
          <h2 className="sr-only" id="bookDialogTitle">{project ? `Proyecto: ${project.title}` : 'Proyecto'}</h2>
          <button className="bm-close" data-close aria-label="Cerrar proyecto" ref={closeRef} onClick={() => closeBook()}>×</button>
          <div className="bk">
            <div className="pg pg-left">{project && <Page page={leftPage} project={project} />}</div>
            <div className="pg pg-right">{project && <Page page={rightPage} project={project} />}</div>
            {project && turn && (
              <div
                className={`leaf turn-${turn}`}
                onAnimationEnd={(event) => {
                  if (event.currentTarget === event.target) finishTurn();
                }}
              >
                <div className="lf front"><Page page={turnFront} project={project} /></div>
                <div className="lf back"><Page page={turnBack} project={project} /></div>
              </div>
            )}
          </div>
          <button className="bm-nav prev" aria-label="anterior" disabled={previousDisabled || Boolean(turn)} onClick={() => changePage('prev')}>‹</button>
          <button className="bm-nav next" aria-label="siguiente" disabled={nextDisabled || Boolean(turn)} onClick={() => changePage('next')}>›</button>
          <div className="bm-foot">
            <span>{isMobile ? `${pageIndex + 1} / ${pages.length}` : `${spread + 1} / ${spreadCount}`}</span> · tocá las flechas o ← →
          </div>
        </div>
      </div>
    </>
  );
}

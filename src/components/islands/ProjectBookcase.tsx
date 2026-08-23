import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type TouchEvent as ReactTouchEvent
} from 'react';
import type { ProjectBook, ProjectPage, ProjectSectionKey } from '../../data/projects';

type TurnDirection = 'next' | 'prev';

type ProjectUrlState =
  | { kind: 'none' }
  | { kind: 'invalid' }
  | { kind: 'valid'; project: ProjectBook; page: number; rawPage: string | null };

const PAGE_KEYS: ProjectSectionKey[] = ['context', 'challenge', 'role', 'team', 'decisions', 'results', 'learnings'];
const PAGE_TITLES = {
  es: ['Contexto', 'Desafío', 'Rol de Romina', 'Equipo y stakeholders', 'Decisiones y acciones', 'Resultados', 'Aprendizajes'],
  en: ['Context', 'Challenge', "Romina's role", 'Team and stakeholders', 'Decisions and actions', 'Outcomes', 'Learnings'],
  pt: ['Contexto', 'Desafio', 'Papel da Romina', 'Equipe e stakeholders', 'Decisões e ações', 'Resultados', 'Aprendizados']
} as const;

function pagesFor(project: ProjectBook, lang: 'es' | 'en' | 'pt'): ProjectPage[] {
  const pages: ProjectPage[] = [{ kind: 'cover', title: project.title, subtitle: project.subtitle }];
  PAGE_KEYS.forEach((key, index) => {
    const html = project.sections[key];
    if (html) pages.push({ kind: 'content', title: PAGE_TITLES[lang][index], html });
  });
  return pages;
}

function projectFromUrl(projects: ProjectBook[]): ProjectUrlState {
  if (!window.location.hash.startsWith('#project=')) return { kind: 'none' };
  const params = new URLSearchParams(window.location.hash.slice(1));
  const project = projects.find((candidate) => candidate.id === params.get('project'));
  if (!project) return { kind: 'invalid' };
  const rawPage = params.get('page');
  const parsedPage = Number.parseInt(rawPage ?? '0', 10);
  return { kind: 'valid', project, page: Number.isFinite(parsedPage) ? parsedPage : 0, rawPage };
}

function projectUrl(projectId: string, page: number): string {
  return `${window.location.pathname}${window.location.search}#project=${encodeURIComponent(projectId)}&page=${page}`;
}

function Page({ page, project }: { page: ProjectPage | null; project: ProjectBook }) {
  if (!page) return <div className="pgc"><div className="pfoot">❦</div></div>;

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

export default function ProjectBookcase({ lang = 'es', projects }: { lang?: 'es' | 'en' | 'pt'; projects: ProjectBook[] }) {
  const copy = lang === 'en' ? {
    title: <>My project <em>bookshelf</em></>, hint: 'open a book and turn its pages →', region: 'Scrollable project bookshelf', summaries: 'Project summaries', open: 'Open case study', shelf: 'there is still room on the shelf', project: 'Project', close: 'Close project', previous: 'previous', next: 'next', arrows: 'use the arrows or ← →'
  } : lang === 'pt' ? {
    title: <>Minha <em>estante</em> de projetos</>, hint: 'abra um livro e folheie suas páginas →', region: 'Estante de projetos rolável', summaries: 'Resumo dos projetos', open: 'Abrir caso', shelf: 'ainda há espaço na estante', project: 'Projeto', close: 'Fechar projeto', previous: 'anterior', next: 'próxima', arrows: 'use as setas ou ← →'
  } : {
    title: <>Mi <em>estante</em> de proyectos</>, hint: 'tocá un libro para abrirlo y pasar sus páginas →', region: 'Estante de proyectos desplazable', summaries: 'Resumen de proyectos', open: 'Abrir caso', shelf: 'todavía queda lugar en el estante', project: 'Proyecto', close: 'Cerrar proyecto', previous: 'anterior', next: 'siguiente', arrows: 'tocá las flechas o ← →'
  };
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [turn, setTurn] = useState<TurnDirection | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const mobileCloseRef = useRef<HTMLButtonElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const openedFromPageRef = useRef(false);
  const touchStartRef = useRef<number | null>(null);

  const project = useMemo(() => projects.find((candidate) => candidate.id === currentId) ?? null, [currentId, projects]);
  const pages = useMemo(() => project ? pagesFor(project, lang) : [], [lang, project]);
  const paddedPages = useMemo(() => pages.length % 2 ? [...pages, null] : pages, [pages]);
  const spread = Math.floor(pageIndex / 2);
  const spreadCount = Math.ceil(paddedPages.length / 2);
  const isOpen = project !== null;

  const normalizedPage = useCallback((page: number, pageCount: number) => {
    return Math.max(0, Math.min(page, Math.max(0, pageCount - 1)));
  }, []);

  const replaceProjectUrl = useCallback((id: string, page: number) => {
    window.history.replaceState({ portfolioProject: true }, '', projectUrl(id, page));
  }, []);

  const focusCloseControl = useCallback(() => {
    const target = isMobile ? mobileCloseRef.current : closeRef.current;
    target?.focus({ preventScroll: true });
  }, [isMobile]);

  const openBook = useCallback((
    nextProject: ProjectBook,
    trigger: HTMLElement | null,
    options: { page?: number; history?: boolean; focus?: boolean } = {}
  ) => {
    const pageCount = pagesFor(nextProject, lang).length;
    const nextPage = normalizedPage(options.page ?? 0, pageCount);
    lastFocusRef.current = trigger ?? (document.activeElement as HTMLElement | null);
    openedFromPageRef.current = options.history !== false;
    setTurn(null);
    setCurrentId(nextProject.id);
    setPageIndex(nextPage);

    if (options.history !== false) {
      window.history.pushState({ portfolioProject: true }, '', projectUrl(nextProject.id, nextPage));
    }
    if (options.focus !== false) window.requestAnimationFrame(focusCloseControl);
  }, [focusCloseControl, lang, normalizedPage]);

  const closeBook = useCallback((options: { history?: boolean } = {}) => {
    const shouldConsumeProjectEntry = options.history !== false && openedFromPageRef.current;
    setTurn(null);
    setCurrentId(null);
    document.body.classList.remove('modal-open');

    const lastFocus = lastFocusRef.current;
    if (lastFocus?.isConnected) window.requestAnimationFrame(() => lastFocus.focus({ preventScroll: true }));
    lastFocusRef.current = null;
    openedFromPageRef.current = false;

    if (options.history !== false) {
      if (shouldConsumeProjectEntry) window.history.back();
      else window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
  }, []);

  const syncProjectFromUrl = useCallback(() => {
    const target = projectFromUrl(projects);
    if (target.kind !== 'valid') {
      closeBook({ history: false });
      if (target.kind === 'invalid') {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
      }
      return;
    }

    const targetPages = pagesFor(target.project, lang);
    const nextPage = normalizedPage(target.page, targetPages.length);
    openedFromPageRef.current = window.history.state?.portfolioProject === true;
    setTurn(null);
    setCurrentId(target.project.id);
    setPageIndex(nextPage);
    if (target.rawPage !== String(nextPage)) {
      replaceProjectUrl(target.project.id, nextPage);
    }
    window.requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }));
    window.requestAnimationFrame(focusCloseControl);
  }, [closeBook, focusCloseControl, lang, normalizedPage, projects, replaceProjectUrl]);

  const finishTurn = useCallback(() => {
    if (!turn || !project) return;
    const step = isMobile ? 1 : 2;
    const nextPage = turn === 'next' ? pageIndex + step : pageIndex - step;
    const boundedPage = normalizedPage(nextPage, pages.length);
    setTurn(null);
    setPageIndex(boundedPage);
    replaceProjectUrl(project.id, boundedPage);
  }, [isMobile, normalizedPage, pageIndex, pages.length, project, replaceProjectUrl, turn]);

  const changePage = useCallback((direction: TurnDirection) => {
    if (!project || turn) return;
    const delta = direction === 'next' ? 1 : -1;

    if (isMobile) {
      const nextPage = pageIndex + delta;
      if (nextPage < 0 || nextPage >= pages.length) return;
      if (reducedMotion) {
        setPageIndex(nextPage);
        replaceProjectUrl(project.id, nextPage);
        return;
      }
      setTurn(direction);
      return;
    }

    const nextSpread = spread + delta;
    if (nextSpread < 0 || nextSpread >= spreadCount) return;
    if (reducedMotion) {
      const nextPage = Math.min(nextSpread * 2, Math.max(0, pages.length - 1));
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
      if (element !== island && !(island && element.contains(island))) element.inert = isOpen;
    }
    for (const element of islandElements) element.inert = isOpen;
    modal.inert = !isOpen;
    document.body.classList.toggle('modal-open', isOpen);

    return () => {
      for (const element of bodyElements) element.inert = false;
      for (const element of islandElements) element.inert = false;
      modal.inert = true;
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

  const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    touchStartRef.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: ReactTouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    const end = event.changedTouches[0]?.clientX;
    touchStartRef.current = null;
    if (start === null || end === undefined || Math.abs(end - start) < 48) return;
    changePage(end < start ? 'next' : 'prev');
  };

  const previousDisabled = isMobile ? pageIndex <= 0 : spread <= 0;
  const nextDisabled = isMobile ? pageIndex + 1 >= pages.length : spread + 1 >= spreadCount;

  const mobileBaseIndex = turn === 'next'
    ? pageIndex + 1
    : turn === 'prev'
      ? pageIndex - 1
      : pageIndex;
  const visibleLeftIndex = turn === 'prev'
    ? (spread - 1) * 2
    : spread * 2;
  const visibleRightIndex = turn === 'next'
    ? (spread + 1) * 2 + 1
    : spread * 2 + 1;
  const renderedLeftIndex = isMobile ? mobileBaseIndex : visibleLeftIndex;
  const renderedRightIndex = isMobile ? mobileBaseIndex + 1 : visibleRightIndex;

  const leftPage = project ? paddedPages[renderedLeftIndex] ?? null : null;
  const rightPage = project ? paddedPages[renderedRightIndex] ?? null : null;
  const turnFront = project && isMobile && turn
    ? paddedPages[turn === 'next' ? pageIndex + 1 : pageIndex] ?? null
    : project && turn === 'next'
      ? paddedPages[spread * 2 + 1] ?? null
      : project && turn === 'prev'
        ? paddedPages[(spread - 1) * 2 + 1] ?? null
        : null;
  const turnBack = project && isMobile && turn
    ? paddedPages[turn === 'next' ? pageIndex + 1 : pageIndex] ?? null
    : project && turn === 'next'
      ? paddedPages[spread * 2 + 2] ?? null
      : project && turn === 'prev'
        ? paddedPages[spread * 2] ?? null
        : null;

  return (
    <>
      <section className="shelfsec" id="proyectos">
        <div className="hd reveal">
          <h2>{copy.title}</h2>
          <p>{copy.hint}</p>
        </div>
        <div className="bookshelf">
          <div className="shelf-scroll" role="region" aria-label={copy.region} tabIndex={isMobile ? 0 : -1}>
            <div className="shelf-track">
              <div className="plank top" />
              <div className="books">
                {projects.map((book) => (
                  <button
                    className={`spine ${book.spineClass}`}
                    type="button"
                    data-book={book.id}
                    data-analytics-event="project_case_open"
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
          <svg className="potplant" viewBox="0 0 120 150" aria-hidden="true" focusable="false"><use href="#pot" /></svg>
        </div>
        <ul className="project-summaries" aria-label={copy.summaries}>
          {projects.filter((book) => book.summary).map((book) => (
            <li key={book.id}>
              <article className="project-summary" style={{ '--summary-color': book.color } as CSSProperties}>
                <span className="tag">{book.tag}</span>
                <h3>{book.title}</h3>
                <p>{book.summary}</p>
                <button
                  className="project-brief"
                  type="button"
                  data-book={book.id}
                  data-analytics-event="project_case_open"
                  aria-haspopup="dialog"
                  aria-label={`${copy.open}: ${book.title}`}
                  onClick={(event) => openBook(book, event.currentTarget)}
                >
                  {copy.open} <span aria-hidden="true">→</span>
                </button>
              </article>
            </li>
          ))}
        </ul>
        <div className="shelfhint hand">{copy.shelf}</div>
      </section>

      <div
        className={`bookmodal${isOpen ? ' open' : ''}`}
        id="bookmodal"
        role="dialog"
        aria-modal="true"
        aria-hidden={isOpen ? 'false' : 'true'}
        aria-labelledby="bookDialogTitle"
        tabIndex={-1}
        ref={modalRef}
        onKeyDown={handleModalKeyDown}
      >
        <div className="bm-backdrop" data-close onClick={() => closeBook()} />
        <div className="bookframe">
          <h2 className="sr-only" id="bookDialogTitle">{project ? `${copy.project}: ${project.title}` : copy.project}</h2>
          <button className="bm-close" type="button" data-close aria-label={copy.close} ref={closeRef} onClick={() => closeBook()}>×</button>
          <div className="bk" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
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
          <button className="bm-nav prev" type="button" aria-label={copy.previous} disabled={previousDisabled || Boolean(turn)} onClick={() => changePage('prev')}>‹</button>
          <button className="bm-nav next" type="button" aria-label={copy.next} disabled={nextDisabled || Boolean(turn)} onClick={() => changePage('next')}>›</button>
          <div className="bm-foot"><span>{isMobile ? `${pageIndex + 1} / ${pages.length}` : `${spread + 1} / ${spreadCount}`}</span> · {copy.arrows}</div>
          <button className="bm-close-mobile" type="button" aria-label={copy.close} ref={mobileCloseRef} onClick={() => closeBook()}>{copy.close}</button>
        </div>
      </div>
    </>
  );
}

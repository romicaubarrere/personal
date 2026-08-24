import type { ProjectBook, ProjectSectionKey } from './projects';

const SECTION_KEYS: ProjectSectionKey[] = ['context', 'challenge', 'role', 'team', 'decisions', 'results', 'learnings'];

function normalizeSpanish(text: string | undefined): string | undefined {
  return text?.replaceAll('requerimientos', 'requisitos').replaceAll('Requerimientos', 'Requisitos');
}

export function normalizePublishedProjectCopy(projects: ProjectBook[], lang: 'es' | 'en' | 'pt'): ProjectBook[] {
  if (lang !== 'es') return projects;
  return projects.map((project) => ({
    ...project,
    summary: normalizeSpanish(project.summary),
    sections: Object.fromEntries(
      SECTION_KEYS.map((key) => [key, normalizeSpanish(project.sections[key])])
    ) as ProjectBook['sections']
  }));
}

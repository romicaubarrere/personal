export const BIRTH_DATE = Object.freeze({ year: 2003, month: 5, day: 13 });

export const SPECIAL_DATES = Object.freeze([
  Object.freeze({ id: 'birthday', month: 5, day: 13, kind: 'birthday', label: 'Cumpleaños' }),
  Object.freeze({ id: 'patria-19-abril', month: 4, day: 19, kind: 'patriotic', label: 'Fecha patria uruguaya' }),
  Object.freeze({ id: 'patria-18-mayo', month: 5, day: 18, kind: 'patriotic', label: 'Fecha patria uruguaya' }),
  Object.freeze({ id: 'patria-19-junio', month: 6, day: 19, kind: 'patriotic', label: 'Fecha patria uruguaya' }),
  Object.freeze({ id: 'patria-18-julio', month: 7, day: 18, kind: 'patriotic', label: 'Fecha patria uruguaya' }),
  Object.freeze({ id: 'patria-25-agosto', month: 8, day: 25, kind: 'patriotic', label: 'Fecha patria uruguaya' }),
  Object.freeze({ id: 'halloween', month: 10, day: 31, kind: 'halloween', label: 'Halloween' })
]);

export function calculateAge({ year, month, day }, birthDate = BIRTH_DATE) {
  let age = year - birthDate.year;
  if (month < birthDate.month || (month === birthDate.month && day < birthDate.day)) age -= 1;
  return age;
}

export function getMontevideoDateParts(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Montevideo',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }).formatToParts(date).reduce((parts, part) => {
    if (part.type !== 'literal') parts[part.type] = Number(part.value);
    return parts;
  }, {});
}

export function resolveSpecialDate(parts, simulatedId = null) {
  if (simulatedId) return SPECIAL_DATES.find((event) => event.id === simulatedId) ?? null;
  return SPECIAL_DATES.find((event) => event.month === parts.month && event.day === parts.day) ?? null;
}

export function getSimulationId(locationLike) {
  const params = new URLSearchParams(locationLike.search || '');
  const requested = params.get('special');
  if (requested) return requested;

  // Compatibilidad con el preview original de WEB-081.
  if (params.get('preview') === 'birthday' || locationLike.hash === '#birthday-preview') return 'birthday';
  return null;
}

function fillCelebrationParticles(holder, eventKind) {
  if (!holder) return;
  holder.replaceChildren();

  const count = eventKind === 'birthday' ? 34 : 18;
  for (let index = 0; index < count; index += 1) {
    const particle = document.createElement('i');
    particle.className = `celebration-particle celebration-particle-${eventKind}`;
    particle.style.left = `${(index * 37) % 101}%`;
    particle.style.setProperty('--fall-time', `${5 + (index % 6) * 0.7}s`);
    particle.style.setProperty('--fall-delay', `${-index * 0.31}s`);
    particle.style.setProperty('--drift', `${(index % 2 ? 1 : -1) * (12 + (index % 5) * 7)}px`);
    holder.appendChild(particle);
  }
}

export function initSpecialDates({ date = new Date(), locationLike = window.location } = {}) {
  const parts = getMontevideoDateParts(date);
  const age = calculateAge(parts);
  document.querySelectorAll('[data-age]').forEach((element) => {
    element.textContent = String(age);
  });

  const simulatedId = getSimulationId(locationLike);
  const event = resolveSpecialDate(parts, simulatedId);
  if (!event) return { age, event: null, simulated: false };

  const simulated = Boolean(simulatedId) && !(event.month === parts.month && event.day === parts.day);
  document.body.classList.add(`is-${event.kind}`);
  document.body.dataset.specialDate = event.id;
  if (simulated) document.body.dataset.specialPreview = 'true';

  const badge = document.getElementById('specialDateBadge');
  if (badge) {
    badge.hidden = false;
    badge.dataset.kind = event.kind;
    if (event.kind === 'birthday') {
      badge.innerHTML = `${simulated ? 'Vista previa · ' : ''}Hoy cumplo <span data-age>${age}</span> años`;
    } else if (event.kind === 'halloween') {
      badge.textContent = `${simulated ? 'Vista previa · ' : ''}Hoy el estudio se embruja`;
    } else {
      badge.textContent = `${simulated ? 'Vista previa · ' : ''}${event.label}`;
    }
  }

  fillCelebrationParticles(document.getElementById('celebrationParticles'), event.kind);
  return { age, event, simulated };
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') initSpecialDates();

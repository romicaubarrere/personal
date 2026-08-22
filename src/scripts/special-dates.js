const MONTEVIDEO_TIME_ZONE = 'America/Montevideo';

export const BIRTH_DATE = Object.freeze({ year: 2003, month: 5, day: 13 });

export const SPECIAL_DATES = Object.freeze([
  Object.freeze({ id: 'new-year', month: 1, day: 1, kind: 'new-year' }),
  Object.freeze({ id: 'birthday', month: 5, day: 13, kind: 'birthday' }),
  Object.freeze({ id: 'halloween', month: 10, day: 31, kind: 'halloween' }),
  Object.freeze({ id: 'patriotic-04-19', month: 4, day: 19, kind: 'patriotic' }),
  Object.freeze({ id: 'patriotic-05-18', month: 5, day: 18, kind: 'patriotic' }),
  Object.freeze({ id: 'patriotic-06-19', month: 6, day: 19, kind: 'patriotic' }),
  Object.freeze({ id: 'patriotic-07-18', month: 7, day: 18, kind: 'patriotic' }),
  Object.freeze({ id: 'patriotic-08-25', month: 8, day: 25, kind: 'patriotic' }),
  Object.freeze({ id: 'hearts-december', month: 12, day: 1, kind: 'hearts' }),
  Object.freeze({ id: 'christmas', month: 12, day: 25, kind: 'christmas' })
]);

export const EASTER_EVENT = Object.freeze({ id: 'easter', kind: 'easter' });

const SPECIAL_DATE_BY_ID = new Map(SPECIAL_DATES.map((specialDate) => [specialDate.id, specialDate]));
const SEASONAL_KINDS = new Set(['new-year', 'easter', 'hearts', 'christmas']);

export function getMontevideoDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: MONTEVIDEO_TIME_ZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }).formatToParts(date).reduce((parts, part) => {
    if (part.type !== 'literal') parts[part.type] = Number(part.value);
    return parts;
  }, {});
}

export function calculateAge(dateParts, birthDate = BIRTH_DATE) {
  let age = dateParts.year - birthDate.year;
  const birthdayHasPassed = dateParts.month > birthDate.month
    || (dateParts.month === birthDate.month && dateParts.day >= birthDate.day);
  if (!birthdayHasPassed) age -= 1;
  return age;
}

export function parseSimulatedDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
  if (!match) return null;

  const parts = { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
  const candidate = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  const isRealDate = candidate.getUTCFullYear() === parts.year
    && candidate.getUTCMonth() === parts.month - 1
    && candidate.getUTCDate() === parts.day;
  return isRealDate ? parts : null;
}

// Algoritmo gregoriano de Meeus/Jones/Butcher.
export function getEasterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = ((19 * a) + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + (2 * e) + (2 * i) - h - k) % 7;
  const m = Math.floor((a + (11 * h) + (22 * l)) / 451);
  const month = Math.floor((h + l - (7 * m) + 114) / 31);
  const day = ((h + l - (7 * m) + 114) % 31) + 1;
  return { year, month, day };
}

export function findSpecialDates(dateParts) {
  const events = SPECIAL_DATES.filter(({ month, day }) => month === dateParts.month && day === dateParts.day);
  if (!dateParts.year) return events;

  const easter = getEasterSunday(dateParts.year);
  if (easter.month === dateParts.month && easter.day === dateParts.day) {
    events.push(Object.freeze({ ...EASTER_EVENT, ...easter }));
  }
  return events;
}

export function findSpecialDate(dateParts) {
  return findSpecialDates(dateParts)[0] || null;
}

export function resolveSpecialDate({ actualDate, search = '', hash = '' }) {
  const params = new URLSearchParams(search);
  const simulatedDate = parseSimulatedDate(params.get('date'));
  const forcedId = params.get('celebration')
    || params.get('special')
    || (params.get('preview') === 'birthday' ? 'birthday' : null)
    || (hash === '#birthday-preview' ? 'birthday' : null);
  const effectiveDate = simulatedDate || actualDate;
  const forcedSpecialDate = forcedId === EASTER_EVENT.id
    ? Object.freeze({ ...EASTER_EVENT, ...getEasterSunday(effectiveDate.year) })
    : (forcedId ? SPECIAL_DATE_BY_ID.get(forcedId) || null : null);
  const events = forcedId
    ? [forcedSpecialDate].filter(Boolean)
    : findSpecialDates(effectiveDate);

  return {
    date: effectiveDate,
    event: events[0] || null,
    events,
    isPreview: Boolean(simulatedDate || forcedSpecialDate)
  };
}

function addBirthdayConfetti(holder) {
  for (let index = 0; index < 34; index += 1) {
    const confetti = document.createElement('i');
    confetti.className = 'birthday-confetti';
    confetti.style.left = `${(index * 37) % 101}%`;
    confetti.style.setProperty('--fall-time', `${5 + (index % 6) * 0.7}s`);
    confetti.style.setProperty('--fall-delay', `${-index * 0.31}s`);
    confetti.style.setProperty('--drift', `${(index % 2 ? 1 : -1) * (12 + (index % 5) * 7)}px`);
    holder.appendChild(confetti);
  }
}

export function formatSpecialDateLabel(event, age, isPreview) {
  const prefix = isPreview ? 'Vista previa · ' : '';
  if (event.kind === 'birthday') return `${prefix}${isPreview ? 'Cumpleaños' : `Hoy cumplo ${age} años`}`;
  if (event.kind === 'halloween') return `${prefix}Halloween en el estudio`;
  if (event.kind === 'new-year') return `${prefix}Feliz Año Nuevo`;
  if (event.kind === 'easter') return `${prefix}Felices Pascuas`;
  if (event.kind === 'hearts') return `${prefix}Un día con más corazones`;
  if (event.kind === 'christmas') return `${prefix}Feliz Navidad`;
  return `${prefix}Fecha patria · ${String(event.day).padStart(2, '0')}/${String(event.month).padStart(2, '0')}`;
}

export function initializeSpecialDates({ now = new Date(), location = window.location } = {}) {
  const actualDate = getMontevideoDate(now);
  const resolution = resolveSpecialDate({
    actualDate,
    search: location.search,
    hash: location.hash
  });
  const age = calculateAge(resolution.date);

  document.querySelectorAll('[data-age]').forEach((element) => {
    element.textContent = String(age);
  });

  if (!resolution.event) return resolution;

  document.body.classList.add('has-special-date');
  resolution.events.forEach((event) => document.body.classList.add(`celebration--${event.kind}`));
  if (resolution.events.some(({ kind }) => SEASONAL_KINDS.has(kind))) {
    document.body.classList.add('celebration--seasonal');
  }
  const layer = document.getElementById('specialDateLayer');
  if (layer) layer.removeAttribute('hidden');

  const badge = document.getElementById('specialDateBadge');
  if (badge) {
    badge.textContent = resolution.events
      .map((event, index) => formatSpecialDateLabel(event, age, resolution.isPreview && index === 0))
      .join(' · ');
    badge.removeAttribute('hidden');
  }

  if (resolution.events.some(({ kind }) => kind === 'birthday')) {
    const holder = document.getElementById('birthdayConfetti');
    if (holder && !holder.childElementCount) addBirthdayConfetti(holder);
  }

  return resolution;
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  initializeSpecialDates();
}

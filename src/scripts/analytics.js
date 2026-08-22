export const ANALYTICS_EVENT_NAME = 'portfolio:analytics';

const EVENT_ATTRIBUTE = 'data-analytics-event';
const EVENT_NAME_PATTERN = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/;

export function createAnalyticsDetail(element, pathname = window.location.pathname) {
  const name = element.getAttribute(EVENT_ATTRIBUTE) || '';
  if (!EVENT_NAME_PATTERN.test(name)) return null;

  return Object.freeze({
    name,
    path: pathname,
    target_kind: element.tagName.toLowerCase()
  });
}

export function dispatchAnalyticsEvent(element, target = window) {
  const detail = createAnalyticsDetail(element, target.location?.pathname || '/');
  if (!detail) return false;

  target.dispatchEvent(new CustomEvent(ANALYTICS_EVENT_NAME, { detail }));
  return true;
}

export function initializeAnalytics(root = document, target = window) {
  if (root.documentElement?.dataset.analyticsReady === 'true') return;
  if (root.documentElement) root.documentElement.dataset.analyticsReady = 'true';

  root.addEventListener('click', (event) => {
    const trigger = event.target.closest?.(`[${EVENT_ATTRIBUTE}]`);
    if (trigger) dispatchAnalyticsEvent(trigger, target);
  });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  initializeAnalytics();
}

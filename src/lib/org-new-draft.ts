export const ORG_NEW_DRAFT_KEY = "org_new_draft";

export type DraftValue = string | number | boolean;

export type OrgNewDraft = Record<string, Record<string, DraftValue>>;

export function readDraft(): OrgNewDraft {
  try {
    const raw = localStorage.getItem(ORG_NEW_DRAFT_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return {};
    }
    return parsed as OrgNewDraft;
  } catch {
    return {};
  }
}

export function loadStepDraft<T extends Record<string, DraftValue>>(
  step: string,
  defaults: T,
): T {
  const draft = readDraft();
  const saved = draft[step];
  if (!saved || typeof saved !== "object" || Array.isArray(saved)) {
    return defaults;
  }
  return { ...defaults, ...saved } as T;
}

export function saveStepDraft(
  step: string,
  values: Record<string, DraftValue>,
): void {
  const draft = readDraft();
  draft[step] = values;
  localStorage.setItem(ORG_NEW_DRAFT_KEY, JSON.stringify(draft));
}

export function clearDraft(): void {
  localStorage.removeItem(ORG_NEW_DRAFT_KEY);
}

export function isDraftDirty(
  defaultsByStep: Record<string, Record<string, DraftValue>>,
): boolean {
  const draft = readDraft();
  return Object.entries(defaultsByStep).some(([step, defaults]) => {
    const saved = draft[step];
    if (!saved) return false;
    return Object.keys(defaults).some(
      (key) => key in saved && saved[key] !== defaults[key],
    );
  });
}
/* A demo runs in one language, so the kernel ships a flat dictionary instead of
   an i18n provider. Same call signature as next-intl, so primitives copied from
   the production app work unchanged. Reskin edits the strings, not the calls. */

type Vars = Record<string, string | number>;

const DICTIONARY: Record<string, Record<string, string>> = {
  'common.table': {
    clear: 'Clear',
    firstPage: 'First page',
    lastPage: 'Last page',
    loadError: 'Could not load this list.',
    nextPage: 'Next page',
    noResults: 'No results',
    pageOf: 'Page {page} of {total}',
    previousPage: 'Previous page',
    retry: 'Try again',
    rowsPerPage: 'Rows per page',
    search: 'Search',
    selectAll: 'Select all rows',
    selected: '{count} selected',
    selectRow: 'Select row',
    sortBy: 'Sort by {title}',
  },
  'common.actions': {
    close: 'Close',
  },
};

export function useTranslations(namespace: string) {
  const table = DICTIONARY[namespace] ?? {};
  return (key: string, vars?: Vars): string => {
    const template = table[key] ?? key;
    if (!vars) return template;
    return template.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in vars ? String(vars[name]) : match,
    );
  };
}

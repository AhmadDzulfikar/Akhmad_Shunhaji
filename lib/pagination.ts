export type PaginationItem =
  | {
      type: "page";
      page: number;
    }
  | {
      type: "ellipsis";
      key: string;
    };

export function getPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 0) {
    return [];
  }

  const visiblePages = new Set<number>([1, totalPages]);

  for (let page = currentPage - 2; page <= currentPage + 2; page += 1) {
    if (page >= 1 && page <= totalPages) {
      visiblePages.add(page);
    }
  }

  const sortedPages = [...visiblePages].sort((left, right) => left - right);
  const items: PaginationItem[] = [];

  for (let index = 0; index < sortedPages.length; index += 1) {
    const page = sortedPages[index];
    const previousPage = sortedPages[index - 1];

    if (previousPage && page - previousPage > 1) {
      items.push({
        type: "ellipsis",
        key: `${previousPage}-${page}`,
      });
    }

    items.push({
      type: "page",
      page,
    });
  }

  return items;
}

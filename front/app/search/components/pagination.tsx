import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export function Pagination({
  current = 1,
  total = 10,
  onPageChange = () => {},
}: {
  current?: number;
  total?: number;
  onPageChange?: (page: number) => void;
}) {
  // Fix: Avoid buggy rendering, boundary cases, non-sensical page values

  // Clamp current within bounds
  const safeCurrent = Math.max(1, Math.min(current, Math.max(total, 1)));

  // Build page buttons, with correct ellipsis logic and boundaries
  const createPages = () => {
    const pages: (number | string)[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (safeCurrent <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", total);
      } else if (safeCurrent >= total - 3) {
        pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, "...", safeCurrent - 1, safeCurrent, safeCurrent + 1, "...", total);
      }
    }
    return pages;
  };
  const pages = createPages();

  function handleClick(page: number | string) {
    if (typeof page === "number" && page !== safeCurrent && page >= 1 && page <= total) {
      onPageChange(page);
    }
  }

  // If total is 0 or 1 page, show nothing
  if (total < 2) return null;

  return (
    <nav
      className="flex items-center justify-center gap-1 mt-10 select-none"
      aria-label="Pagination"
      role="navigation"
    >
      <button
        disabled={safeCurrent === 1}
        onClick={() => handleClick(safeCurrent - 1)}
        className={`px-3 py-2 rounded-lg border border-[color:var(--border-color)] text-sm font-medium 
          flex items-center gap-1
          ${safeCurrent === 1
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-[color:var(--surface-hover)] transition-colors text-[color:var(--text-secondary)]"}`}
        aria-label="Previous page"
        tabIndex={safeCurrent === 1 ? -1 : 0}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {pages.map((p, idx) =>
        p === "..." ? (
          <span
            key={"ellipsis" + idx}
            className="px-2 text-[color:var(--text-secondary)] pointer-events-none select-none"
          >
            <MoreHorizontal className="w-4 h-4" />
          </span>
        ) : (
          <button
            key={p}
            aria-current={p === safeCurrent ? "page" : undefined}
            onClick={() => handleClick(p)}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors min-w-[36px]
              ${
                p === safeCurrent
                  ? "bg-[color:var(--primary-600)] shadow"
                  : "border border-[color:var(--border-color)] text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-hover)]"
              }`}
            style={p === safeCurrent ? { color: "var(--on-primary)" } : {}}
            disabled={p === safeCurrent}
            tabIndex={p === safeCurrent ? -1 : 0}
          >
            {p}
          </button>
        )
      )}

      <button
        disabled={safeCurrent === total}
        onClick={() => handleClick(safeCurrent + 1)}
        className={`px-3 py-2 rounded-lg border border-[color:var(--border-color)] text-sm font-medium 
          flex items-center gap-1
          ${safeCurrent === total
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-[color:var(--surface-hover)] transition-colors text-[color:var(--text-secondary)]"}`}
        aria-label="Next page"
        tabIndex={safeCurrent === total ? -1 : 0}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}

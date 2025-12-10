export function Pagination() {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button className="px-4 py-2 rounded-lg border border-[color:var(--border-color)] text-sm font-medium text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-hover)] transition-colors">
        Previous
      </button>
      <button className="px-4 py-2 rounded-lg bg-[color:var(--primary-600)] text-sm font-medium hover:bg-[color:var(--primary-700)] transition-colors" style={{ color: "var(--on-primary)" }}>
        1
      </button>
      <button className="px-4 py-2 rounded-lg border border-[color:var(--border-color)] text-sm font-medium text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-hover)] transition-colors">
        2
      </button>
      <button className="px-4 py-2 rounded-lg border border-[color:var(--border-color)] text-sm font-medium text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-hover)] transition-colors">
        3
      </button>
      <button className="px-4 py-2 rounded-lg border border-[color:var(--border-color)] text-sm font-medium text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-hover)] transition-colors">
        Next
      </button>
    </div>
  );
}


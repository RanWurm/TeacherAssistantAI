import { JournalsTable } from './journals-table';

export function JournalsView() {
  return (
    <div
      style={{
        background: 'var(--card-bg)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-color-light)',
        }}
      >
        <h2
          style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: 'var(--card-text)',
            marginBottom: '0.25rem',
          }}
        >
          Top Academic Journals
        </h2>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--card-sub-text)',
          }}
        >
          Leading journals by publications and impact factor
        </p>
      </div>
      <JournalsTable />
    </div>
  );
}


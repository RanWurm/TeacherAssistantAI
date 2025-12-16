import { BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function InsightsHeader() {
  const { t } = useTranslation();

  return (
    <header
      className="
        z-30 border-b border-(--border-color) m-0
        px-6 py-6
        sm:px-10 sm:py-10
      "
      data-component="insights-header"
    >
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center gap-3 mb-5 sm:gap-6 sm:mb-8">
          <div className="
            w-12 h-12
            sm:w-20 sm:h-20
            rounded-2xl bg-linear-to-br from-(--metric-blue-s) to-(--metric-blue-e)
            flex items-center justify-center shadow-lg">
            <BarChart3
              className="w-6 h-6 sm:w-10 sm:h-10"
              style={{ color: "var(--on-primary)" }}
            />
          </div>

          <div>
            <h1 className="
              text-2xl sm:text-4xl
              font-extrabold text-(--text-main) text-center"
            >
              {t('insights.header.title')}
            </h1>
            <p className="
              text-base sm:text-lg
              text-(--text-muted) text-center mt-1"
            >
              {t('insights.header.subtitle')}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

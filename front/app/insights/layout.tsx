import { ReactNode } from 'react';

interface InsightsLayoutProps {
  children: ReactNode;
}

export default function InsightsLayout({ children }: InsightsLayoutProps) {
  return <>{children}</>;
}


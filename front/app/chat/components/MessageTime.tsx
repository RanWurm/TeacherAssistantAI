'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function MessageTime({ ts }: { ts: number }) {
  const { i18n } = useTranslation();
  const [label, setLabel] = useState('');

  useEffect(() => {
    setLabel(
      new Date(ts).toLocaleTimeString(
        i18n.language === 'he' ? 'he-IL' : 'en-US',
        { hour: '2-digit', minute: '2-digit' }
      )
    );
  }, [ts, i18n.language]);

  return <span>{label}</span>;
}

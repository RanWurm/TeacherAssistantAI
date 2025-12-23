"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function HtmlDirection() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const isHebrew = i18n.language === "he";

    document.documentElement.lang = i18n.language;
    document.documentElement.dir = isHebrew ? "rtl" : "ltr";
  }, [i18n.language]);

  return null;
}

export const locales = ["en", "zh", "hi", "es", "fr", "ar", "bn", "pt", "ru", "ja", "vi"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  zh: "中文 (Chinese)",
  hi: "हिन्दी (Hindi)",
  es: "Español (Spanish)",
  fr: "Français (French)",
  ar: "العربية (Arabic)",
  bn: "বাংলা (Bengali)",
  pt: "Português (Portuguese)",
  ru: "Русский (Russian)",
  ja: "日本語 (Japanese)",
  vi: "Tiếng Việt (Vietnamese)",
};

export const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  zh: "🇨🇳",
  hi: "🇮🇳",
  es: "🇪🇸",
  fr: "🇫🇷",
  ar: "🇸🇦",
  bn: "🇧🇩",
  pt: "🇧🇷",
  ru: "🇷🇺",
  ja: "🇯🇵",
  vi: "🇻🇳",
};

export const rtlLocales: Locale[] = ["ar"];

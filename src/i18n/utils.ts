import { routing } from "./routing";

export const getCanonicalUrl = ({ locale, pathname }: { locale: string; pathname: string }) => {
  if (locale === routing.defaultLocale) {
    return pathname;
  }
  
  return `/${locale}${pathname}`;
};

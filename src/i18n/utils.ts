import { routing } from "./routing";
import { baseUrl } from "@/app/sitemap";

export const getCanonicalUrl = ({ locale, pathname }: { locale: string; pathname: string }) => {
  if (locale === routing.defaultLocale) {
    return `${baseUrl}${pathname}`;
  }
  
  return `${baseUrl}/${locale}${pathname}`;
};

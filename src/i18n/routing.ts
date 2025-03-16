import {defineRouting} from 'next-intl/routing';

export const locales = ["en", "es"] as const;
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: locales,

  // Used when no locale matches
  defaultLocale: "es",

  localePrefix: "never",
});


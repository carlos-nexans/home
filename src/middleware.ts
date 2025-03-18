import createMiddleware from "next-intl/middleware";
import {routing} from "./i18n/routing";

export default createMiddleware(routing);
export const config = {
  // Skip internal paths and static files, but handle everything else
  matcher: ['/((?!og|rss|api|_next|.*\\.).*)']
};

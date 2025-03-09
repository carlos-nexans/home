import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
import fs from 'fs';
import path from 'path';
 
export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;
 
  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const messagesPath = path.join('src', 'messages', `${locale}.json`);
  const messagesExists = fs.existsSync(messagesPath);
  const messages = messagesExists ? JSON.parse(fs.readFileSync(messagesPath, 'utf8')) : {};

  return {
    locale,
    messages
  };
});
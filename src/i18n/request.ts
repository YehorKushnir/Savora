import {getRequestConfig} from 'next-intl/server';

export const locales = ['en', 'ru', 'uk'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({requestLocale}) => {
    let locale = await requestLocale;

    if (!locale || !locales.includes(locale as string)) {
        locale = defaultLocale;
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
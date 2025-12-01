import NextAuth from "next-auth"
import authConfig from '@/auth.config'
import createMiddleware from 'next-intl/middleware';

const {auth} = NextAuth(authConfig)
const locales = ['en', 'ru', 'uk'];
const defaultLocale = 'en';
const publicPages = ['/', '/login'];

const intlMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always'
});

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const pathname = nextUrl.pathname;

    const pathWithoutLocale = pathname.replace(
        new RegExp(`^/(${locales.join('|')})`),
        ''
    ) || '/';

    const isPublic = publicPages.includes(pathWithoutLocale);

    if (!isLoggedIn && !isPublic) {
        const locale = pathname.split('/')[1];
        const targetLocale = locales.includes(locale) ? locale : defaultLocale;

        return Response.redirect(new URL(`/${targetLocale}/login`, nextUrl.origin));
    }

    if (isLoggedIn && pathWithoutLocale === '/login') {
        const locale = pathname.split('/')[1];
        const targetLocale = locales.includes(locale) ? locale : defaultLocale;

        return Response.redirect(new URL(`/${targetLocale}/dashboard`, nextUrl.origin));
    }

    return intlMiddleware(req);
})

export const config = {
    matcher: '/((?!api|_next|_vercel|.*\\..*).*)'
}
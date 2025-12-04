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

    if (req.method === 'POST') {
        return intlMiddleware(req);
    }

    const isLoggedIn = !!req.auth;
    const pathname = nextUrl.pathname;

    const pathWithoutLocale = pathname.replace(
        new RegExp(`^/(${locales.join('|')})`),
        ''
    ) || '/';

    const isPublic = publicPages.includes(pathWithoutLocale);

    const urlLocale = pathname.split('/')[1];
    const cookieLocale = req.cookies.get('NEXT_LOCALE')?.value;
    let targetLocale = defaultLocale;

    if (locales.includes(urlLocale)) {
        targetLocale = urlLocale;
    } else if (cookieLocale && locales.includes(cookieLocale)) {
        targetLocale = cookieLocale;
    }

    if (!isLoggedIn && !isPublic) {
        return Response.redirect(new URL(`/${targetLocale}/login`, nextUrl.origin));
    }

    if (isLoggedIn) {

        const userCurrency = req.auth?.user?.currency;

        const isCurrencyPage = pathWithoutLocale === '/currency';
        const isLoginPage = pathWithoutLocale === '/login';

        const isCurrencySet = !!userCurrency

        if (!isCurrencySet) {
            if (!isCurrencyPage) {
                return Response.redirect(new URL(`/${targetLocale}/currency`, nextUrl.origin));
            }
        } else {
            if (isLoginPage || isCurrencyPage) {
                return Response.redirect(new URL(`/${targetLocale}/dashboard`, nextUrl.origin));
            }
        }
    }

    return intlMiddleware(req);
})

export const config = {
    matcher: '/((?!api|_next|_vercel|.*\\..*).*)'
}
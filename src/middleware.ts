import NextAuth from "next-auth"
import authConfig from '@/auth.config'

const {auth} = NextAuth(authConfig)
export default auth(async (req) => {
    if (!req.auth && req.nextUrl.pathname !== "/login") {
        const newUrl = new URL("/login", req.nextUrl.origin)
        return Response.redirect(newUrl)
    }
    if (req.auth && req.nextUrl.pathname === "/login") {
        const newUrl = new URL("/dashboard", req.nextUrl.origin)
        return Response.redirect(newUrl)
    }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|otf)).*)"],
}
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import authConfig from "./auth.config"

const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token?.sub) {
                session.user.id = token.sub
            }
            return session
        },
    },
})

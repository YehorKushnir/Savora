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
        async jwt({ token, user, trigger, session}) {
            if (user) {
                token.sub = user.id
                token.currency = user.currency;
            }

            if (trigger === "update" && session?.currency) {
                token.currency = session.currency
            }

            return token
        },
        async session({ session, token }) {
            if (token?.sub && token.currency) {
                session.user.id = token.sub
                session.user.currency = token.currency as string
            }
            return session
        },
    },
})

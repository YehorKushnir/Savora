import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            currency: string | null
        } & DefaultSession["user"]
    }
    interface User {
        currency: string | null
    }
}
import type {NextAuthConfig} from "next-auth"
import Google from 'next-auth/providers/google'

export default {
    providers: [Google],
    callbacks: {
        session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            if (session.user && token.currency) {
                // @ts-ignore
                session.user.currency = token.currency as string;
            }
            return session;
        },
        authorized({ auth }) {
            return !!auth?.user;
        }
    }
} satisfies NextAuthConfig
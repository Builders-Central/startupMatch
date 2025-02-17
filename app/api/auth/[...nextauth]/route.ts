import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { JWT } from "next-auth/jwt"
import { AuthOptions } from "next-auth"

interface User {
    email?: string | null
    name?: string | null
    image?: string | null
}

interface Session {
    user?: User
    accessToken?: string
}

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async jwt({ token, account, user }) {
            // Initial sign in
            if (account && user) {
                token.accessToken = account.access_token
                token.email = user.email || undefined
            }
            return token
        },
        async session({ session, token }) {
            // Send properties to the client
            if (session.user) {
                session.user.email = token.email as string
            }
            session.accessToken = token.accessToken as string
            return session
        },
    },
    pages: {
        signIn: '/auth',
    },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 
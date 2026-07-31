import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { getOrCreateUser } from '@/lib/notion-users';
import type { UserRole } from '@/lib/notion-users';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account }) {
      // Hanya izinkan login via Google
      if (account?.provider !== 'google') return false;
      if (!user.email) return false;

      try {
        // Ambil atau buat user di Notion
        const notionUser = await getOrCreateUser({
          name: user.name ?? user.email,
          email: user.email,
          googleId: account.providerAccountId,
        });

        if (!notionUser) return false;
        return true;
      } catch (error) {
        console.error('[auth] signIn callback error:', error);
        return false;
      }
    },

    async jwt({ token, account, user }) {
      // Saat pertama kali login, simpan email & role ke token
      if (account && user?.email) {
        const notionUser = await getOrCreateUser({
          name: user.name ?? user.email,
          email: user.email,
          googleId: account.providerAccountId,
        });
        token.role = notionUser?.role ?? 'customer';
        token.notionUserId = notionUser?.notionPageId;
      }
      return token;
    },

    async session({ session, token }) {
      // Expose role dan userId ke client session
      if (session.user) {
        session.user.role = token.role as UserRole;
        session.user.notionUserId = token.notionUserId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
});

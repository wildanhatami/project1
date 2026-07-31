import type { DefaultSession, DefaultJWT } from 'next-auth';
import type { UserRole } from '@/lib/notion-users';

declare module 'next-auth' {
  interface Session {
    user: {
      role?: UserRole;
      notionUserId?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role?: UserRole;
    notionUserId?: string;
  }
}

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import * as Users from '@/app/api/entities/auth';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'example@gamil.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const body = JSON.stringify({
          email: credentials?.email,
          password: credentials?.password,
        });
        const res = await Users.login(body);
        const user = await res?.data;
        if (user) return user;
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = {
        accessToken: token.accessToken,
      };
      return session;
    },
  },
});

export { handler as GET, handler as POST };

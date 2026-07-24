import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import { signInSchema } from "@/schemas/auth";
import { prisma } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = signInSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          include: {
            memberships: {
              include: { organization: true },
              orderBy: { createdAt: "asc" },
              take: 1,
            },
          },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const validPassword = await compare(parsed.data.password, user.passwordHash);

        if (!validPassword) {
          return null;
        }

        const primaryMembership = user.memberships[0];

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: primaryMembership?.role ?? null,
          organizationId: primaryMembership?.organizationId ?? null,
          organizationName: primaryMembership?.organization.name ?? null,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.organizationId = user.organizationId;
        token.organizationName = user.organizationName;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub ?? "";
      session.user.role = token.role;
      session.user.organizationId = token.organizationId;
      session.user.organizationName = token.organizationName;

      return session;
    },
  },
});

import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse
} from "next";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";

import { compareSync } from "bcrypt-ts-edge";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" }
      },
      async authorize(credentials, req) {
        let response = null;

        if (credentials) {
          const user = await prisma.user.findFirst({
            where: { email: credentials.email }
          });

          if (user && compareSync(credentials.password, user.password)) {
            response = {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
            };
          }
        }

        return response;
      }
    })
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, user, trigger, token }: any) {
      session.user.id = token.sub;

      if (trigger === "update") {
        session.user.name = user.name;
      }

      return session;
    }
  }
} satisfies NextAuthOptions;

export const handler = NextAuth(config);

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}

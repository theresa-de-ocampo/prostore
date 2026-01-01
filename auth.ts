/* eslint-disable @typescript-eslint/no-explicit-any */
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { type NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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
      async authorize(credentials) {
        let response = null;

        if (credentials) {
          const user = await prisma.user.findFirst({
            where: { email: credentials.email as string }
          });

          if (
            user &&
            compareSync(credentials.password as string, user.password)
          ) {
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
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.role = user.role;

        if (!user.name) {
          const pseudoName = user.email.split("@")[0];
          token.name = `${pseudoName.charAt(0).toUpperCase()}${pseudoName.slice(
            1
          )}`;

          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name }
          });
        }
      }

      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }

      if (trigger === "signIn" || trigger === "signUp") {
        const cartCookie = await cookies();
        const sessionCartId = cartCookie.get("sessionCartId")?.value;

        if (sessionCartId) {
          const cart = await prisma.cart.findFirst({
            where: { sessionCartId }
          });

          if (cart) {
            await prisma.cart.deleteMany({
              where: {
                userId: user.id
              }
            });

            await prisma.cart.update({
              where: {
                id: cart.id
              },
              data: {
                userId: user.id
              }
            });
          }
        }
      }

      return token;
    },
    async session({ session, token }: any) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      return session;
    },
    authorized({ request }) {
      let response: NextResponse<unknown> | boolean = true;

      if (!request.cookies.get("sessionCartId")) {
        const sessionCartId = crypto.randomUUID();
        response = NextResponse.next();
        response.cookies.set("sessionCartId", sessionCartId);
      }

      return response;
    }
  }
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);

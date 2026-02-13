import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { type NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// * Prisma
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";

// * Utils
import { compareSync } from "bcrypt-ts-edge";

// * Types
import type { Adapter } from "next-auth/adapters";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  adapter: PrismaAdapter(prisma) as Adapter,
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
            // node_modules/@auth/core/src/lib/actions/callback/index.ts at line 354
            // copies user.id into the default token
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
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;

        if (!user.name && typeof user.email === "string") {
          const pseudoName = user.email.split("@")[0];
          token.name = `${pseudoName.charAt(0).toUpperCase()}${pseudoName.slice(
            1
          )}`;

          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name }
          });
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
      }

      if (trigger === "update" && session?.user?.name) {
        token.name = session.user.name;
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      return session;
    },
    authorized({ request, auth }) {
      let response: NextResponse<unknown> | boolean = true;

      const protectedPaths = ["/checkout", "/admin", "/user"];
      const { pathname } = request.nextUrl;

      if (!auth && protectedPaths.some((p) => pathname.startsWith(p))) {
        response = false;
      } else if (!request.cookies.get("sessionCartId")) {
        const sessionCartId = crypto.randomUUID();
        response = NextResponse.next();
        response.cookies.set("sessionCartId", sessionCartId);
      }

      return response;
    }
  }
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);

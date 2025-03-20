/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export const authOptions: any = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
          // console.log('userCredential', userCredential)
          const user = userCredential.user;
          // console.log('user', user)
          const token = await user.getIdToken(true);

          return {
            id: user.uid,
            name: user.displayName || credentials.email,
            email: user.email,
            accessToken: token,
          };
        } catch (error) {
          console.error("Error signing in:", error);
          return null;
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, account }: any) {
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
        console.log("token", token, account);

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/my-account`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${account.access_token}`,
            },
          });


          if (response.ok) {
            const userData = await response.json();
            token.user = userData;
          } else if (response.status === 401 || response.status === 403) {
            console.log("account.access_token", account.access_token);
            const createUserResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/register`, {
              method: "POST",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                accessToken: account.access_token,
              }),
            });

            if (createUserResponse.ok) {
              const newUserData = await createUserResponse.json();
              token.user = newUserData;
            } else {
              console.error("Failed to create user:", createUserResponse.status);
              token.error = "Failed to create user";
            }
          } else {
            console.error("Failed to fetch user data:", response.status);
            token.error = "Failed to fetch user data";
          }
        } catch (error) {
          console.error("Error in JWT callback:", error);
          token.error = "Internal server error";
        }
      }
      return token;
    },

    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      session.user = token.user;
      session.error = token.error;
      return session;
    },

    async redirect({ url, baseUrl }: any) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },

    async signIn({ user }: any) {
      if (!user.email) return false;
      return true;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

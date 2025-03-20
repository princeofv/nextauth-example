/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
// import type { NextAuthOptions } from "next-auth";

export const authOptions: any = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // authorization: {
      //   params: {
      //     scope: "openid email profile https://www.googleapis.com/auth/calendar",
      //   },
      // },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account }:any) {
      if (account) {
        token.accessToken = account.access_token; // Store the access token
        token.provider = account.provider; // Store the provider (e.g., "google")
      console.log('token', token)
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/my-account`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${account.access_token}`,
            },
          });
          console.log('response get my account', response)
          if (response.ok) {
            const userData = await response.json();
            token.user = userData; 
          } else if (response.status === 401 || response.status === 403) {
            console.log('account.access_token', account.access_token)
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
            token.error = "Failed to fetch user data"; // Store error in the JWT
          }
        } catch (error) {
          console.error("Error in JWT callback:", error);
          token.error = "Internal server error"; // Store error in the JWT
        }
      }
      return token; // Return the updated token
    },

    // Session Callback: Pass JWT data to the session
    async session({ session, token }:any) {
      session.accessToken = token.accessToken; // Add access token to the session
      session.user = token.user; // Add user data to the session
      session.error = token.error; // Add error to the session
      return session; // Return the updated session
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

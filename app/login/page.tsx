/* eslint-disable @next/next/no-img-element */
"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginPage() {
  const { data: session } = useSession();
  console.log('session', session)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">NextAuth.js with TypeScript</h1>
      {session ? (
        <>
          <p>Welcome, {session.user?.name}</p>
          <img src={session.user?.image || ""} alt="Profile" className="w-16 h-16 rounded-full mt-2" />
          <button onClick={() => signOut()} className="mt-4 p-2 bg-red-500 text-white rounded">
            Logout
          </button>
        </>
      ) : (
        <button onClick={() => signIn("google")} className="p-2 bg-blue-500 text-white rounded">
          Login with Google
        </button>
      )}
    </div>
  );
}

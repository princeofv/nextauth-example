"use client";

import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  console.log('session', session)
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Dashboard</h1>
      {session ? (
        <div>
          <p><strong>Name:</strong> {session.user?.name}</p>
          <p><strong>Email:</strong> {session.user?.email}</p>
          <p><strong>Access Token:</strong> {session.accessToken}</p>
          <button onClick={() => signOut()} className="bg-red-500 text-white p-2 mt-4">
            Sign Out
          </button>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}

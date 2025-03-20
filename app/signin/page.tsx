/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("vjwarboy13@gmail.com");
  const [password, setPassword] = useState("Vijay@123");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // Redirect after successful sign-up
    } catch (error: any) {
      console.error("Error signing up:", error.message);
      setError(error.message);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push("/dashboard"); // Redirect after successful login
      }
    } catch (error: any) {
      console.error("Error signing in:", error.message);
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard"); // Redirect after successful login
    } catch (error: any) {
      console.error("Error signing in with Google:", error.message);
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form className="space-y-4 bg-white p-6 rounded shadow-md" onSubmit={handleSignIn}>
        <h2 className="text-2xl font-bold">Login</h2>
        {error && <p className="text-red-500">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Sign In
        </button>

        <button type="button" className="w-full bg-green-500 text-white p-2 rounded" onClick={handleSignUp}>
          Sign Up
        </button>

        <button type="button" className="w-full bg-red-500 text-white p-2 rounded" onClick={handleGoogleSignIn}>
          Sign in with Google
        </button>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auths/logins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });


      const data = await res.json();

      if (!res.ok) {
        throw new Error("Login failed");
      }
      if(data.status === "success") 
        router.push("/dashboards");


    } catch (err) {
        console.error("Login error:", err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-900 via-blue-800 to-blue-950 relative overflow-hidden">

      {/* Curved Background */}
      <div className="absolute left-0 top-0 w-[60%] h-full bg-white rounded-r-[120px]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md px-6">

        <div className="bg-white rounded-3xl shadow-2xl p-8">

          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full border-4 border-blue-500 flex items-center justify-center mb-3">
              <span className="text-3xl font-bold text-blue-600">MH</span>
            </div>

            <h1 className="text-xl font-bold text-gray-900">
              MH Electronic
            </h1>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Sign in to your account
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Enter your email to continue
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@domain.com"
              required
              className="w-full text-black h-12 px-4 rounded-full border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Password */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full text-black h-12 px-4 rounded-full border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Continue Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full
              bg-blue-600 hover:bg-blue-700
              text-white font-medium
              transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Continue"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="px-3 text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Google Button */}
          <button
            type="button"
            className="w-full h-12 rounded-full border border-gray-300
            flex items-center justify-center gap-2
            hover:bg-gray-50 transition"
          >
            <FcGoogle size={22} />
            <span className="text-sm text-black font-medium">
              Continue with Google
            </span>
          </button>

          {/* Terms */}
          <p className="text-xs text-black text-center mt-6 leading-relaxed">
            By clicking continue, you agree to our{" "}
            <span className="text-blue-600 cursor-pointer">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-blue-600 cursor-pointer">
              Privacy Policy
            </span>
          </p>
        </div>

      </div>
    </main>
  );
}

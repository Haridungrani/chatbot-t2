'use client';

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-zinc-900 dark:via-purple-950 dark:to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    // Show logged-in home page
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-zinc-900 dark:via-purple-950 dark:to-zinc-950">
        {/* Header */}
        <nav className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-700 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">🤖</span>
                </div>
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">AI ChatBot</h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">{user.username}</span>
                <Link href="/dashboard" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl text-sm font-medium">
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    router.push('/');
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">🤖</span>
              </div>
            </div>

            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-3">
              Welcome Back, {user.username}!
            </h1>
            
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
              Your AI assistant is ready to help
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="px-8 py-3 bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Go to ChatBot
              </Link>
              
              <Link
                href="/dashboard/faq"
                className="px-8 py-3 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Manage FAQs
              </Link>
            </div>
          </div>

          {/* User Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="group bg-white dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Email</h3>
              <p className="text-base text-zinc-900 dark:text-white font-medium truncate">{user.email}</p>
            </div>

            <div className="group bg-white dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-300 to-pink-300 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Username</h3>
              <p className="text-base text-zinc-900 dark:text-white font-medium">{user.username}</p>
            </div>

            <div className="group bg-white dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-300 to-emerald-300 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Member Since</h3>
              <p className="text-base text-zinc-900 dark:text-white font-medium">
                {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <div className="flex min-h-screen items-center justify-center px-4">
        <main className="w-full max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">🤖</span>
              </div>
            </div>

            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
              AI ChatBot
            </h1>
            
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
              Your intelligent conversation partner powered by modern technology
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              Get Started
            </Link>
            
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Sign In
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group bg-white dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                Secure
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                JWT authentication with bcrypt password protection
              </p>
            </div>

            <div className="group bg-white dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-300 to-pink-300 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                Fast
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                GraphQL API for efficient and real-time responses
              </p>
            </div>

            <div className="group bg-white dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-green-300 to-emerald-300 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                Reliable
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                PostgreSQL database with robust data handling
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

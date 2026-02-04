'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const menuItems = [
    { name: 'ChatBot', path: '/dashboard', icon: '💬' },
    { name: 'FAQ Management', path: '/dashboard/faq', icon: '❓' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-zinc-900 dark:via-purple-950 dark:to-zinc-950 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl border-r border-zinc-200 dark:border-zinc-700 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-300 to-purple-300 rounded-lg flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">🤖</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AI ChatBot</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{user.username}</p>
              </div>
            </Link>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all transform hover:scale-105 ${
                  pathname === item.path
                    ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-xl'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-white/50 dark:hover:bg-zinc-700/50 shadow-lg hover:shadow-xl'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-700">
            <div className="mb-3 p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Logged in as</p>
              <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{user.username}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 truncate">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Top Header */}
        <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 shadow-sm sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700"
              >
                <svg className="w-6 h-6 text-zinc-600 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">{user.username}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

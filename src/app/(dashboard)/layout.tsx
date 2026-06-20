'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Search, Heart, MessageCircle, Bell, User, Settings, Crown, LogOut, Menu, X, ChevronRight, Users, Moon, Sun
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { Navbar } from '@/components/common/Navbar';
import { MobileNav } from '@/components/common/MobileNav';

const sidebarLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Discover', icon: Heart, href: '/discover' },
    { name: 'Search', icon: Search, href: '/search' },
    { name: 'Matches', icon: Users, href: '/matches' },
    { name: 'Messages', icon: MessageCircle, href: '/messages' },
    { name: 'Notifications', icon: Bell, href: '/notifications' },
    { name: 'Profile', icon: User, href: '/profile' },
    { name: 'Settings', icon: Settings, href: '/settings' },
    { name: 'Subscription', icon: Crown, href: '/subscription' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, user, logout } = useAuthStore();
    const { isDarkMode, toggleDarkMode } = useUIStore();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
                <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <Navbar />

            <div className="flex pt-20">
                <aside className="hidden lg:flex flex-col fixed left-0 top-20 bottom-0 w-64 bg-[var(--color-bg-card)] backdrop-blur-md border-r border-[var(--color-border-light)] z-40">
                    <div className="p-4 border-b border-[var(--color-border-light)]">
                        <div className="flex items-center justify-between">
                            <Link href="/dashboard" className="flex items-center gap-2">
                                <span className="text-lg font-serif font-bold text-[var(--color-text-primary)]">
                                    Vivaha<span className="text-brand">Setu</span>
                                </span>
                            </Link>
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-xl text-soft-gray dark:text-gray-100/70 hover:text-brand dark:hover:text-brand transition-colors"
                                aria-label="Toggle dark mode"
                            >
                                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                            </button>
                        </div>
                    </div>
                    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                        {sidebarLinks.map((link) => {
                            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                        ? 'bg-gradient-to-r from-brand/20 to-brand-dark/10 text-brand shadow-lg border border-brand/20'
                                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border-light)] hover:text-brand'
                                    }`}
                                >
                                    <link.icon size={20} />
                                    <span>{link.name}</span>
                                    {isActive && <ChevronRight size={16} className="ml-auto" />}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-3 border-t border-[var(--color-border-light)]">
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 transition-all"
                        >
                            <LogOut size={20} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </aside>

                <button
                    className="lg:hidden fixed bottom-20 right-4 z-50 w-12 h-12 bg-gradient-to-r from-brand to-brand-dark text-brand-navy rounded-full shadow-lg flex items-center justify-center"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: -300 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -300 }}
                            className="lg:hidden fixed inset-0 z-40"
                        >
                            <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
                            <div className="relative w-64 h-full bg-[var(--color-bg-card)] backdrop-blur-md shadow-2xl p-4 pt-6">
                                <nav className="space-y-1">
                                    {sidebarLinks.map((link) => {
                                        const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setSidebarOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                                    ? 'bg-gradient-to-r from-brand/20 to-brand-dark/10 text-brand border border-brand/20'
                                                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border-light)]'
                                                }`}
                                            >
                                                <link.icon size={20} />
                                                <span>{link.name}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 transition-all mt-6"
                                >
                                    <LogOut size={20} />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <main className="flex-1 lg:ml-64 min-h-[calc(100vh-5rem)] pb-24 lg:pb-8 px-4 sm:px-6 lg:px-8 py-6">
                    {children}
                </main>
            </div>

            <MobileNav />
        </div>
    );
}

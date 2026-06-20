'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Flag,
  BarChart3,
  Settings,
  Palette,
  FileText,
  Database,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useAuthStore } from '@/stores/auth-store';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Users', href: '/admin/users', icon: <Users className="w-5 h-5" /> },
  { label: 'Verifications', href: '/admin/verifications', icon: <ShieldCheck className="w-5 h-5" /> },
  { label: 'Reports', href: '/admin/reports', icon: <Flag className="w-5 h-5" /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 className="w-5 h-5" /> },
  { label: 'Content', href: '/admin/content', icon: <FileText className="w-5 h-5" /> },
  { label: 'Lookups', href: '/admin/lookups', icon: <Database className="w-5 h-5" /> },
  { label: 'Theme', href: '/admin/theme', icon: <Palette className="w-5 h-5" /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
];

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className={`flex flex-col h-full ${isCollapsed ? 'items-center' : ''}`}>
      <div className={`p-4 border-b border-white/10 ${isCollapsed ? 'flex justify-center' : ''}`}>
        {isCollapsed ? (
          <div className="w-10 h-10 rounded-lg bg-brand-gradient flex items-center justify-center">
            <span className="text-white font-bold text-lg">V</span>
          </div>
        ) : (
          <Logo variant="white" height={36} />
        )}
      </div>

      <nav className="flex-1 py-4 space-y-1 px-3">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                active
                  ? 'bg-white/15 text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <span className={active ? 'text-brand-light' : 'group-hover:text-brand-light transition-colors'}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {active && !isCollapsed && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-brand"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className={`p-4 border-t border-white/10 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        {isCollapsed ? (
          <div className="w-9 h-9 rounded-full bg-brand/20 flex items-center justify-center text-white text-sm font-bold">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-gradient flex items-center justify-center text-white text-sm font-bold">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.email || 'Admin'}</p>
              <p className="text-xs text-white/50 truncate capitalize">{user?.role?.toLowerCase().replace('_', ' ') || 'Admin'}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className={`mt-3 flex items-center gap-2 text-white/50 hover:text-red-400 transition-colors text-sm ${
            isCollapsed ? 'justify-center w-full' : ''
          }`}
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-brand-navy text-white shadow-premium"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-brand-navy z-50 lg:hidden"
          >
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        onMouseEnter={() => isCollapsed && setIsCollapsed(false)}
        onMouseLeave={() => isCollapsed && setIsCollapsed(true)}
        className={`hidden lg:flex flex-col bg-brand-navy min-h-screen transition-all duration-300 relative ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-brand-navy border border-white/10 text-white/60 hover:text-white flex items-center justify-center z-10"
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
        {sidebarContent}
      </aside>
    </>
  );
};

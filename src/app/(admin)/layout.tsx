'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useAuthStore } from '@/stores/auth-store';

const ALLOWED_ROLES = ['ADMIN', 'SUPER_ADMIN'];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/login');
      } else if (user && !ALLOWED_ROLES.includes(user.role)) {
        router.replace('/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm font-medium">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !ALLOWED_ROLES.includes(user.role)) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 min-h-screen overflow-x-hidden">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

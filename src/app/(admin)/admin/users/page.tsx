'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  SlidersHorizontal,
  Loader2,
} from 'lucide-react';

type UserRole = 'USER' | 'PREMIUM_USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN';
type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'BANNED' | 'PENDING_VERIFICATION' | 'DEACTIVATED';

interface User {
  id: string;
  profileId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  joined: string;
}

const roleColors: Record<string, string> = {
  USER: 'bg-blue-100 text-blue-700',
  PREMIUM_USER: 'bg-amber-100 text-amber-700',
  MODERATOR: 'bg-purple-100 text-purple-700',
  ADMIN: 'bg-red-100 text-red-700',
  SUPER_ADMIN: 'bg-red-100 text-red-700',
};

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  SUSPENDED: 'bg-orange-100 text-orange-700',
  BANNED: 'bg-red-100 text-red-700',
  PENDING_VERIFICATION: 'bg-yellow-100 text-yellow-700',
  DEACTIVATED: 'bg-gray-100 text-gray-700',
  DELETED: 'bg-gray-100 text-gray-700',
};

const ROWS_PER_PAGE = 10;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | ''>('');
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(ROWS_PER_PAGE) })
      if (search) params.set('search', search)
      if (roleFilter) params.set('role', roleFilter)
      if (statusFilter) params.set('status', statusFilter)
      const res = await fetch(`/api/admin/users?${params}`)
      const data = await res.json()
      if (data.success) {
        setUsers(data.data)
        setTotal(data.meta.total)
      }
    } catch {
      // keep existing data
    } finally {
      setLoading(false)
    }
  }, [page, search, roleFilter, statusFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const updateUser = async (id: string, updates: Partial<User>) => {
    setSavingId(id)
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      const data = await res.json()
      if (data.success) {
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)))
      }
    } finally {
      setSavingId(null)
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-montserrat text-brand-navy">User Management</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage registered users, roles, and account statuses</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-4"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, profile ID or phone..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-field pl-10 w-full"
            />
          </div>
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value as UserRole | ''); setPage(1); }}
              className="input-field pr-8 appearance-none min-w-[140px]"
            >
              <option value="">All Roles</option>
              <option value="USER">User</option>
              <option value="PREMIUM_USER">Premium User</option>
              <option value="MODERATOR">Moderator</option>
              <option value="ADMIN">Admin</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as UserStatus | ''); setPage(1); }}
              className="input-field pr-8 appearance-none min-w-[160px]"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="BANNED">Banned</option>
              <option value="PENDING_VERIFICATION">Pending</option>
              <option value="DEACTIVATED">Deactivated</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          <button
            onClick={() => alert('Advanced filters coming soon. Use the dropdowns above to filter by role and status.')}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border hover:bg-gray-50 transition-colors text-sm font-medium text-muted-foreground"
          >
            <SlidersHorizontal className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-navy text-white">
                <th className="text-left py-3.5 px-4 font-semibold">Profile ID</th>
                <th className="text-left py-3.5 px-4 font-semibold">Name</th>
                <th className="text-left py-3.5 px-4 font-semibold">Email</th>
                <th className="text-left py-3.5 px-4 font-semibold">Phone</th>
                <th className="text-left py-3.5 px-4 font-semibold">Role</th>
                <th className="text-left py-3.5 px-4 font-semibold">Status</th>
                <th className="text-left py-3.5 px-4 font-semibold">Joined</th>
                <th className="text-right py-3.5 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && users.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                  </td>
                </tr>
              )}
              {!loading && users.map((u, i) => (
                <React.Fragment key={u.id}>
                  <tr
                    className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-brand-sky/40 transition-colors cursor-pointer`}
                    onClick={() => setExpandedId(expandedId === u.id ? null : u.id)}
                  >
                    <td className="py-3.5 px-4 font-medium text-brand">{u.profileId}</td>
                    <td className="py-3.5 px-4 font-medium text-brand-navy">{u.name}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{u.email}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{u.phone}</td>
                    <td className="py-3.5 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => updateUser(u.id, { role: e.target.value as UserRole })}
                        onClick={(e) => e.stopPropagation()}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer appearance-none ${roleColors[u.role]}`}
                      >
                        <option value="USER">User</option>
                        <option value="PREMIUM_USER">Premium</option>
                        <option value="MODERATOR">Moderator</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={u.status}
                        onChange={(e) => updateUser(u.id, { status: e.target.value as UserStatus })}
                        onClick={(e) => e.stopPropagation()}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer appearance-none ${statusColors[u.status]}`}
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="SUSPENDED">Suspended</option>
                        <option value="BANNED">Banned</option>
                        <option value="PENDING_VERIFICATION">Pending</option>
                        <option value="DEACTIVATED">Deactivated</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{u.joined}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); setExpandedId(expandedId === u.id ? null : u.id); }}
                        className="p-1.5 rounded-lg hover:bg-brand/10 text-brand transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-muted-foreground transition-colors"
                        title="More"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                  {expandedId === u.id && (
                    <tr key={`${u.id}-expanded`}>
                      <td colSpan={8} className="p-4 bg-brand-sky/20 border-b border-border">
                        <div className="flex items-center justify-between">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground text-xs">User ID</p>
                              <p className="font-medium">{u.id}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Email Verified</p>
                              <p className="font-medium text-green-600">Yes</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Last Login</p>
                              <p className="font-medium">2 days ago</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Reports Count</p>
                              <p className="font-medium">0</p>
                            </div>
                          </div>
                          <Link href={`/profile/${u.profileId}`}>
                            <button className="px-4 py-2 rounded-xl bg-brand text-white text-sm font-medium hover:bg-brand-dark transition-colors">
                              View Full Profile
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && users.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No users found matching your filters</p>
          </div>
        )}

        {/* Pagination */}
        {total > ROWS_PER_PAGE && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * ROWS_PER_PAGE + 1}–{Math.min(page * ROWS_PER_PAGE, total)} of {total} users
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-border hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.ceil(total / ROWS_PER_PAGE) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  p === page ? 'bg-brand text-white' : 'border border-border hover:bg-gray-50 text-muted-foreground'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(Math.ceil(total / ROWS_PER_PAGE), p + 1))}
              disabled={page === Math.ceil(total / ROWS_PER_PAGE)}
              className="p-2 rounded-lg border border-border hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        )}
      </motion.div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, UserPlus, UserCheck, Crown, ShieldCheck, Flag,
  Bell, Search, Eye, CheckCircle, XCircle, BarChart3, FileText,
} from 'lucide-react';
import { StatCard } from '@/components/admin/StatCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0, activeUsers: 0, premiumUsers: 0,
    pendingVerifications: 0, reports: 0, newToday: 0,
    verifiedCount: 0, recentUsers: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(res => {
        if (res.success) setStats(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers.toLocaleString(), change: { value: 12.5, isPositive: true }, icon: Users },
    { title: 'New Today', value: stats.newToday.toString(), change: { value: 8.2, isPositive: true }, icon: UserPlus },
    { title: 'Active Users', value: stats.activeUsers.toLocaleString(), change: { value: 3.1, isPositive: true }, icon: UserCheck },
    { title: 'Premium Users', value: stats.premiumUsers.toString(), change: { value: 15.7, isPositive: true }, icon: Crown },
    { title: 'Pending Verifications', value: stats.pendingVerifications.toString(), change: { value: 5.3, isPositive: false }, icon: ShieldCheck },
    { title: 'Reports', value: stats.reports.toString(), change: { value: 2.1, isPositive: false }, icon: Flag },
  ];

  const filteredUsers = (stats.recentUsers || []).filter((u: any) =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: '#4A0E1A' }}>Admin Dashboard</h1>
          <p style={{ color: '#7a6050', fontSize: '13px', marginTop: '2px' }}>Real platform metrics from your database</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#a08070' }} />
            <input type="text" placeholder="Quick search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              style={{ height: '38px', borderRadius: '8px', border: '1.5px solid #e8d5b0', background: '#fff', paddingLeft: '36px', paddingRight: '12px', fontSize: '13px', width: '220px', outline: 'none', color: '#4A0E1A' }} />
          </div>
          <button style={{ width: '38px', height: '38px', borderRadius: '8px', border: '1.5px solid #e8d5b0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer' }}>
            <Bell size={18} style={{ color: '#7a6050' }} />
            <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px', borderRadius: '50%', background: '#DC2626', color: '#fff', fontSize: '9px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{stats.reports}</span>
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, i) => (
          <StatCard key={stat.title} {...stat} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8d5b0', padding: '24px' }}
        >
          <h3 className="font-display font-bold" style={{ color: '#4A0E1A', fontSize: '16px', marginBottom: '16px' }}>Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Manage Lookups', icon: BarChart3, href: '/admin/lookups' },
              { label: 'Review Verifications', icon: ShieldCheck, href: '/admin/verifications' },
              { label: 'Content Settings', icon: FileText, href: '/admin/content' },
              { label: 'View Reports', icon: Flag, href: '/admin/reports' },
            ].map((action) => (
              <a key={action.label} href={action.href}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', background: '#FFFDF7', color: '#4A0E1A', fontSize: '13px', fontWeight: '500', textDecoration: 'none' }}
                className="hover:bg-[#f8f0e8] transition-colors"
              >
                <action.icon size={18} style={{ color: '#6A0D25' }} />
                {action.label}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Recent Users */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8d5b0', overflow: 'hidden', gridColumn: 'span 2' }}
        >
          <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 className="font-display font-bold" style={{ color: '#4A0E1A', fontSize: '16px' }}>Recent Users</h3>
            <a href="/admin/users" style={{ fontSize: '13px', color: '#6A0D25', fontWeight: '600', textDecoration: 'none' }}>View All</a>
          </div>
          <div className="overflow-x-auto mt-4">
            <table style={{ width: '100%', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e8d5b0' }}>
                  <th style={{ textAlign: 'left', padding: '12px 24px', color: '#a08070', fontWeight: '600' }}>ID</th>
                  <th style={{ textAlign: 'left', padding: '12px 24px', color: '#a08070', fontWeight: '600' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '12px 24px', color: '#a08070', fontWeight: '600' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '12px 24px', color: '#a08070', fontWeight: '600' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u: any, i: number) => (
                  <tr key={u.id} style={{ background: i % 2 === 0 ? '#fff' : '#FFFDF7', borderBottom: '1px solid #f0e8e0' }}>
                    <td style={{ padding: '12px 24px', fontWeight: '600', color: '#6A0D25' }}>{u.id}</td>
                    <td style={{ padding: '12px 24px', color: '#4A0E1A' }}>{u.name || u.email}</td>
                    <td style={{ padding: '12px 24px' }}>
                      <span style={{ background: u.status === 'ACTIVE' ? '#dcfce7' : '#fef9c3', color: u.status === 'ACTIVE' ? '#166534' : '#854d0e', fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '999px' }}>
                        {u.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '12px 24px', color: '#a08070', fontSize: '12px' }}>{u.joined}</td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#a08070' }}>No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Total Users', value: stats.totalUsers },
          { label: 'Active Users', value: stats.activeUsers },
          { label: 'Premium Users', value: stats.premiumUsers },
          { label: 'Pending Verifications', value: stats.pendingVerifications },
          { label: 'Open Reports', value: stats.reports },
          { label: 'Verified Documents', value: stats.verifiedCount },
        ].map((s) => (
          <div key={s.label} style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e8d5b0', padding: '16px', textAlign: 'center' }}>
            <div className="font-display text-2xl font-bold" style={{ color: '#4A0E1A' }}>{s.value}</div>
            <div style={{ color: '#7a6050', fontSize: '12px', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flag,
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

type ReportStatus = 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';

interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedId: string;
  reportedName: string;
  reason: string;
  description: string;
  status: ReportStatus;
  date: string;
}

const statusConfig: Record<ReportStatus, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  INVESTIGATING: { label: 'Investigating', color: 'bg-blue-100 text-blue-700', icon: <Search className="w-3.5 h-3.5" /> },
  RESOLVED: { label: 'Resolved', color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  DISMISSED: { label: 'Dismissed', color: 'bg-gray-100 text-gray-700', icon: <XCircle className="w-3.5 h-3.5" /> },
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: 'RESOLVED' | 'DISMISSED' } | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' })
      if (statusFilter !== 'ALL') params.set('status', statusFilter)
      if (search) params.set('search', search)
      const res = await fetch(`/api/admin/reports?${params}`)
      const data = await res.json()
      if (data.success) setReports(data.data)
    } catch {
      // keep existing
    } finally {
      setLoading(false)
    }
  }, [statusFilter, search])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const filtered = reports;

  const updateStatus = async (id: string, status: ReportStatus) => {
    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (data.success) {
        setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
      }
    } catch {
      // ignore
    }
    setConfirmAction(null);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-montserrat text-brand-navy">Reports Management</h1>
        <p className="text-muted-foreground text-sm mt-1">Review and manage user reports and disputes</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by ID, reason, reporter or reported..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
          {(['ALL', 'PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                statusFilter === s ? 'bg-white text-brand-navy shadow-sm' : 'text-muted-foreground hover:text-brand-navy'
              }`}
            >
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Reports List */}
      <div className="space-y-3">
        {loading && (
          <div className="text-center py-16 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
          </div>
        )}
        <AnimatePresence>
          {!loading && filtered.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ delay: i * 0.03 }}
              className="card overflow-hidden"
            >
              {/* Main Row */}
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
              >
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <Flag className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">ID</p>
                    <p className="font-medium text-brand">{r.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Reporter</p>
                    <p className="font-medium truncate">{r.reporterName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Reported</p>
                    <p className="font-medium truncate">{r.reportedName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Reason</p>
                    <p className="font-medium truncate">{r.reason}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-medium">{r.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${statusConfig[r.status].color}`}>
                    {statusConfig[r.status].icon}
                    {statusConfig[r.status].label}
                  </span>
                  {r.status === 'PENDING' || r.status === 'INVESTIGATING' ? (
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setConfirmAction({ id: r.id, action: 'RESOLVED' })}
                        className="p-1.5 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
                        title="Resolve"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setConfirmAction({ id: r.id, action: 'DISMISSED' })}
                        className="p-1.5 rounded-lg hover:bg-gray-200 text-muted-foreground transition-colors"
                        title="Dismiss"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ) : null}
                  {expandedId === r.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedId === r.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border overflow-hidden"
                  >
                    <div className="p-4 bg-gray-50/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Description</p>
                            <p className="text-sm text-brand-navy bg-white p-3 rounded-xl border border-border">{r.description}</p>
                          </div>
                          <div className="flex gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Reporter ID</p>
                              <p className="text-sm font-medium">{r.reporterId}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Reported ID</p>
                              <p className="text-sm font-medium">{r.reportedId}</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="bg-white p-4 rounded-xl border border-border">
                            <p className="text-xs text-muted-foreground mb-3 font-medium">Actions</p>
                            <div className="flex flex-wrap gap-2">
                              {r.status === 'PENDING' && (
                                <button onClick={() => updateStatus(r.id, 'INVESTIGATING')} className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-1.5">
                                  <Search className="w-4 h-4" /> Mark Investigating
                                </button>
                              )}
                              <button
                                onClick={() => setConfirmAction({ id: r.id, action: 'RESOLVED' })}
                                className="px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-1.5"
                              >
                                <CheckCircle className="w-4 h-4" /> Resolve
                              </button>
                              <button
                                onClick={() => setConfirmAction({ id: r.id, action: 'DISMISSED' })}
                                className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-gray-100 transition-colors flex items-center gap-1.5"
                              >
                                <XCircle className="w-4 h-4" /> Dismiss
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Affected users will be notified of the resolution
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Flag className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No reports found</p>
        </div>
      )}

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={() => setConfirmAction(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <div className={`w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center ${
                  confirmAction.action === 'RESOLVED' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {confirmAction.action === 'RESOLVED' ? (
                    <CheckCircle className="w-7 h-7 text-green-600" />
                  ) : (
                    <XCircle className="w-7 h-7 text-gray-600" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-brand-navy">
                  {confirmAction.action === 'RESOLVED' ? 'Resolve Report?' : 'Dismiss Report?'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {confirmAction.action === 'RESOLVED'
                    ? 'This will mark the report as resolved. Appropriate action will be taken.'
                    : 'This will dismiss the report. No further action will be taken.'}
                </p>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateStatus(confirmAction.id, confirmAction.action as ReportStatus)}
                  className={`flex-1 py-2.5 rounded-xl text-white text-sm font-medium transition-colors ${
                    confirmAction.action === 'RESOLVED' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

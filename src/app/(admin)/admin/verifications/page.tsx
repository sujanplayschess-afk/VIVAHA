'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Search,
  CheckCircle,
  XCircle,
  FileText,
  Eye,
  AlertTriangle,
  Clock,
  Loader2,
} from 'lucide-react';

type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface Verification {
  id: string;
  userName: string;
  userProfileId: string;
  documentType: string;
  status: VerificationStatus;
  uploadedAt: string;
  notes?: string;
}

const tabs: { label: string; value: VerificationStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
];

const statusColors: Record<VerificationStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  APPROVED: 'bg-green-100 text-green-700 border-green-200',
  REJECTED: 'bg-red-100 text-red-700 border-red-200',
};

const statusIcons: Record<VerificationStatus, React.ReactNode> = {
  PENDING: <Clock className="w-4 h-4" />,
  APPROVED: <CheckCircle className="w-4 h-4" />,
  REJECTED: <XCircle className="w-4 h-4" />,
};

const docTypeIcons: Record<string, string> = {
  AADHAAR: '🆔',
  PAN: '📋',
  PASSPORT: '🛂',
  VOTER_ID: '🗳️',
  EDUCATION_CERT: '🎓',
  INCOME_PROOF: '💰',
};

export default function VerificationsPage() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [activeTab, setActiveTab] = useState<VerificationStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: 'APPROVED' | 'REJECTED' } | null>(null);

  const fetchVerifications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' })
      if (activeTab !== 'ALL') params.set('status', activeTab)
      if (search) params.set('search', search)
      const res = await fetch(`/api/admin/verifications?${params}`)
      const data = await res.json()
      if (data.success) setVerifications(data.data)
    } catch {
      // keep existing
    } finally {
      setLoading(false)
    }
  }, [activeTab, search])

  useEffect(() => {
    fetchVerifications()
  }, [fetchVerifications])

  const filtered = verifications;

  const updateStatus = async (id: string, status: VerificationStatus, notes?: string) => {
    try {
      const res = await fetch(`/api/admin/verifications/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: status, notes }),
      })
      const data = await res.json()
      if (data.success) {
        setVerifications((prev) => prev.map((v) => (v.id === id ? { ...v, status, notes: notes || v.notes } : v)))
      }
    } catch {
      // ignore
    }
    setConfirmAction(null);
    setRejectModal(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-montserrat text-brand-navy">Document Verifications</h1>
        <p className="text-muted-foreground text-sm mt-1">Review and manage user document verification requests</p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit"
      >
        {tabs.map((tab) => {
          const count = tab.value === 'ALL' ? verifications.length : verifications.filter((v) => v.status === tab.value).length;
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive ? 'bg-white text-brand-navy shadow-sm' : 'text-muted-foreground hover:text-brand-navy'
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-brand/10 text-brand' : 'bg-gray-200 text-muted-foreground'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search verifications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10 w-full"
        />
      </div>

      {/* Verification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading && (
          <div className="col-span-full text-center py-16 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
          </div>
        )}
        <AnimatePresence>
          {!loading && filtered.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              layout
              className="card p-5"
            >
              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColors[v.status]}`}>
                  {statusIcons[v.status]}
                  {v.status}
                </span>
                <span className="text-xs text-muted-foreground">{v.uploadedAt}</span>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold text-lg">
                  {v.userName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-brand-navy">{v.userName}</p>
                  <p className="text-xs text-muted-foreground">{v.userProfileId}</p>
                </div>
              </div>

              {/* Document Info */}
              <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Document Type</span>
                  <span className="text-sm font-medium flex items-center gap-1">
                    {docTypeIcons[v.documentType] || <FileText className="w-4 h-4" />} {v.documentType}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <span className="text-sm font-mono font-medium">{v.status}</span>
                </div>
                {/* Document Preview Placeholder */}
                <div className="mt-3 h-24 rounded-lg bg-gradient-to-br from-brand-sky to-brand-bg flex items-center justify-center border-2 border-dashed border-border">
                  <Eye className="w-6 h-6 text-muted-foreground/50" />
                  <span className="text-xs text-muted-foreground ml-2">Document Preview</span>
                </div>
              </div>

              {v.notes && (
                <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-100 text-xs text-red-700 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{v.notes}</span>
                </div>
              )}

              {/* Actions */}
              {v.status === 'PENDING' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmAction({ id: v.id, action: 'APPROVED' })}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => setRejectModal(v.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No verification requests found</p>
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
                  confirmAction.action === 'APPROVED' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {confirmAction.action === 'APPROVED' ? (
                    <CheckCircle className="w-7 h-7 text-green-600" />
                  ) : (
                    <XCircle className="w-7 h-7 text-red-600" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-brand-navy">
                  {confirmAction.action === 'APPROVED' ? 'Approve Verification?' : 'Reject Verification?'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {confirmAction.action === 'APPROVED'
                    ? 'This will mark the document as verified. The user will be notified.'
                    : 'This will reject the document. The user will be notified with the reason.'}
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
                  onClick={() => updateStatus(confirmAction.id, confirmAction.action)}
                  className={`flex-1 py-2.5 rounded-xl text-white text-sm font-medium transition-colors ${
                    confirmAction.action === 'APPROVED' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Reason Modal */}
      <AnimatePresence>
        {rejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={() => { setRejectModal(null); setRejectReason(''); }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-brand-navy mb-2">Rejection Reason</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Provide a reason for rejecting this verification. This will be shared with the user.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Document is blurry, please upload a clearer image..."
                className="input-field w-full min-h-[100px] resize-none py-3"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => { setRejectModal(null); setRejectReason(''); }}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateStatus(rejectModal, 'REJECTED', rejectReason)}
                  disabled={!rejectReason.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

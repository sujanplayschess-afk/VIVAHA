'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Settings as SettingsIcon, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maxProfilePhotos, setMaxProfilePhotos] = useState(6);
  const [autoApprovePhotos, setAutoApprovePhotos] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setSiteName(data.data.siteName || 'VivahaSetu');
          setSupportEmail(data.data.supportEmail || '');
          setMaintenanceMode(data.data.maintenanceMode || false);
          setMaxProfilePhotos(data.data.maxProfilePhotos || 6);
          setAutoApprovePhotos(data.data.autoApprovePhotos || false);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteName,
          supportEmail,
          maintenanceMode,
          maxProfilePhotos,
          autoApprovePhotos,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Settings saved successfully' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save settings' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-montserrat text-brand-navy">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage general platform settings</p>
      </motion.div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6 space-y-6"
      >
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="p-2.5 rounded-xl bg-brand/10">
            <SettingsIcon className="w-5 h-5 text-brand" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-brand-navy">General Settings</h2>
            <p className="text-xs text-muted-foreground">Configure platform-wide settings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-navy">Site Name</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="input-field w-full"
              placeholder="VivahaSetu"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-navy">Support Email</label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="input-field w-full"
              placeholder="support@vivahasetu.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-navy">Max Profile Photos</label>
            <input
              type="number"
              value={maxProfilePhotos}
              onChange={(e) => setMaxProfilePhotos(Number(e.target.value))}
              className="input-field w-full"
              min={1}
              max={20}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-navy">Auto-Approve Photos</label>
            <div className="flex items-center gap-3 mt-1">
              <button
                onClick={() => setAutoApprovePhotos(!autoApprovePhotos)}
                className={`relative w-12 h-6 rounded-full transition-colors ${autoApprovePhotos ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${autoApprovePhotos ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-sm text-muted-foreground">{autoApprovePhotos ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-brand-navy">Maintenance Mode</p>
              <p className="text-xs text-muted-foreground">When enabled, only admins can access the site</p>
            </div>
            <button
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`relative w-12 h-6 rounded-full transition-colors ${maintenanceMode ? 'bg-red-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${maintenanceMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand text-white text-sm font-medium hover:bg-brand-dark transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

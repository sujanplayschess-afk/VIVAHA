'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Palette, RefreshCw, CheckCircle, RotateCcw } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';

const defaultColors = {
  primaryColor: '#0D9488',
  primaryDark: '#0F766E',
  primaryLight: '#14B8A6',
  navyColor: '#1A2332',
  accentColor: '#F59E0B',
};

export default function ThemeSettingsPage() {
  const { accessToken } = useAuthStore();
  const [colors, setColors] = useState(defaultColors);
  const [fontHeading, setFontHeading] = useState('Cormorant Garamond');
  const [fontBody, setFontBody] = useState('Inter');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) {
          setColors({
            primaryColor: res.data.primaryColor || defaultColors.primaryColor,
            primaryDark: res.data.primaryDark || defaultColors.primaryDark,
            primaryLight: res.data.primaryLight || defaultColors.primaryLight,
            navyColor: res.data.navyColor || defaultColors.navyColor,
            accentColor: res.data.accentColor || defaultColors.accentColor,
          });
          setFontHeading(res.data.fontHeading || 'Cormorant Garamond');
          setFontBody(res.data.fontBody || 'Inter');
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ...colors, fontHeading, fontBody }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const resetColors = () => {
    setColors(defaultColors);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold font-serif text-brand-navy">Theme Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Customize the look and feel of your matrimony site</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={resetColors} className="btn-outline text-sm py-2 px-4 flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Color Palette */}
        <div className="card p-6 space-y-6">
          <div className="flex items-center gap-2 text-brand-navy font-semibold">
            <Palette className="w-5 h-5 text-brand" />
            Color Palette
          </div>

          {Object.entries(colors).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-brand-navy mb-1.5 capitalize">
                {key.replace(/([A-Z])/g, ' $1').replace(/color/i, ' Color').trim()}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={value}
                  onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                  className="w-12 h-12 rounded-xl border border-gray-200 cursor-pointer bg-white"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                  className="input-field flex-1 font-mono text-sm"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Font Settings */}
        <div className="card p-6 space-y-8">
          <div className="flex items-center gap-2 text-brand-navy font-semibold">
            <Palette className="w-5 h-5 text-brand" />
            Font Settings
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-navy mb-1.5">Heading Font</label>
            <select
              value={fontHeading}
              onChange={(e) => setFontHeading(e.target.value)}
              className="input-field"
            >
              <option value="Cormorant Garamond">Cormorant Garamond (Serif)</option>
              <option value="Playfair Display">Playfair Display</option>
              <option value="Georgia">Georgia</option>
              <option value="Inter">Inter (Sans)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-navy mb-1.5">Body Font</label>
            <select
              value={fontBody}
              onChange={(e) => setFontBody(e.target.value)}
              className="input-field"
            >
              <option value="Inter">Inter (Sans)</option>
              <option value="System UI">System UI</option>
              <option value="Georgia">Georgia (Serif)</option>
            </select>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Heading Preview</p>
              <p style={{ fontFamily: fontHeading }} className="text-2xl font-bold text-brand-navy">
                VivahaSetu Matrimony
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Body Preview</p>
              <p style={{ fontFamily: fontBody }} className="text-base text-soft-gray">
                Find your perfect match from respected families across South Indian communities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Color Preview */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-brand-navy mb-4">Color Preview</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl" style={{ backgroundColor: colors.primaryColor }} />
            <div className="w-16 h-16 rounded-xl" style={{ backgroundColor: colors.primaryDark }} />
            <div className="w-16 h-16 rounded-xl" style={{ backgroundColor: colors.primaryLight }} />
            <div className="w-16 h-16 rounded-xl" style={{ backgroundColor: colors.navyColor }} />
            <div className="w-16 h-16 rounded-xl" style={{ backgroundColor: colors.accentColor }} />
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Primary</span>
            <span className="ml-2">Dark</span>
            <span className="ml-2">Light</span>
            <span className="ml-2">Navy</span>
            <span className="ml-2">Accent</span>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button className="btn-primary" style={{ background: `linear-gradient(135deg, ${colors.primaryColor} 0%, ${colors.primaryDark} 100%)` }}>
              Button Primary
            </button>
            <button className="btn-outline" style={{ borderColor: colors.primaryColor, color: colors.primaryColor }}>
              Button Outline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

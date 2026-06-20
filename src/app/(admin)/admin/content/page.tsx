'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Image, Type, RefreshCw, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';

export default function ContentEditorPage() {
  const { accessToken } = useAuthStore();
  const [form, setForm] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroDescription: '',
    heroBadgeText: '',
  });
  const [heroImage, setHeroImage] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) {
          setForm({
            heroTitle: res.data.heroTitle || '',
            heroSubtitle: res.data.heroSubtitle || '',
            heroDescription: res.data.heroDescription || '',
            heroBadgeText: res.data.heroBadgeText || '',
          });
          setHeroImage(res.data.heroImage || '');
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
        body: JSON.stringify({ ...form, heroImage }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUrl = (url: string) => {
    setHeroImage(url);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold font-serif text-brand-navy">Content Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Edit the landing page hero section</p>
        </div>
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
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Text Editor */}
        <div className="card p-6 space-y-6">
          <div className="flex items-center gap-2 text-brand-navy font-semibold">
            <Type className="w-5 h-5 text-brand" />
            Hero Text
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-navy mb-1.5">Badge Text</label>
            <input
              type="text"
              value={form.heroBadgeText}
              onChange={(e) => setForm({ ...form, heroBadgeText: e.target.value })}
              className="input-field"
              placeholder="Welcome to VivahaSetu Matrimonial"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-navy mb-1.5">Hero Title</label>
            <input
              type="text"
              value={form.heroTitle}
              onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
              className="input-field text-lg font-semibold"
              placeholder="Find Your Perfect Match"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-navy mb-1.5">Hero Subtitle</label>
            <textarea
              value={form.heroSubtitle}
              onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
              className="input-field min-h-[80px] pt-3 resize-none"
              placeholder="and begin a beautiful journey..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-navy mb-1.5">Hero Description</label>
            <textarea
              value={form.heroDescription}
              onChange={(e) => setForm({ ...form, heroDescription: e.target.value })}
              className="input-field min-h-[80px] pt-3 resize-none"
              placeholder="Your perfect partner is just a few clicks away..."
              rows={3}
            />
          </div>
        </div>

        {/* Image Editor */}
        <div className="card p-6 space-y-6">
          <div className="flex items-center gap-2 text-brand-navy font-semibold">
            <Image className="w-5 h-5 text-brand" />
            Hero Image
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-navy mb-1.5">Image URL</label>
            <input
              type="url"
              value={heroImage}
              onChange={(e) => handleImageUrl(e.target.value)}
              className="input-field"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
            {heroImage ? (
              <div className="relative">
                <img
                  src={heroImage}
                  alt="Hero preview"
                  className="max-h-64 mx-auto rounded-lg object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <button
                  onClick={() => setHeroImage('')}
                  className="mt-3 text-sm text-red-500 hover:underline"
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <div className="text-muted-foreground">
                <Image className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Enter an image URL above to preview</p>
                <p className="text-xs mt-1">Use Unsplash or Picsum for placeholder images</p>
              </div>
            )}
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Suggested: Use images from{' '}
              <a href="https://unsplash.com" target="_blank" rel="noreferrer" className="text-brand hover:underline">
                Unsplash
              </a>{' '}
              for a professional look.
            </p>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-brand-navy mb-4">Preview</h3>
        <div className="bg-gradient-to-br from-brand-navy via-brand-navy to-brand rounded-2xl p-8 text-white">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6 border border-white/10">
              {form.heroBadgeText || 'Welcome to VivahaSetu Matrimonial'}
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight mb-3">
              {form.heroTitle || 'Find Your Perfect Match'}
            </h2>
            <p className="text-lg text-white/70 mb-4">
              {form.heroSubtitle || 'and begin a beautiful journey...'}
            </p>
            <p className="text-white/60 mb-6 max-w-lg mx-auto">
              {form.heroDescription || 'Your perfect partner is just a few clicks away!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

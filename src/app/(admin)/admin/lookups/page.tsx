'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, RefreshCw, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';

type LookupKey = 'communities' | 'religions' | 'motherTongues' | 'educationLevels' | 'occupations' | 'employedIn' | 'familyTypes' | 'familyValues' | 'diet' | 'smoking' | 'drinking' | 'states';

const sectionLabels: Record<string, string> = {
  communities: 'Communities',
  religions: 'Religions',
  motherTongues: 'Mother Tongues',
  educationLevels: 'Education Levels',
  occupations: 'Occupations',
  employedIn: 'Employment Types',
  familyTypes: 'Family Types',
  familyValues: 'Family Values',
  diet: 'Diet Preferences',
  smoking: 'Smoking',
  drinking: 'Drinking',
  states: 'States',
};

const sections: LookupKey[] = Object.keys(sectionLabels) as LookupKey[];

export default function LookupsPage() {
  const { accessToken } = useAuthStore();
  const [data, setData] = useState<Record<string, string[]>>({});
  const [cities, setCities] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [newItems, setNewItems] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) {
          setData(res.data);
          setCities(res.data.cities || {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = (key: string) => {
    const val = newItems[key]?.trim();
    if (!val) return;
    if (key === 'states') {
      setCities(prev => ({ ...prev, [val]: ['Other'] }));
    } else {
      setData(prev => ({ ...prev, [key]: [...(prev[key] || []), val] }));
    }
    setNewItems(prev => ({ ...prev, [key]: '' }));
  };

  const handleRemove = (key: string, index: number) => {
    if (key === 'states') {
      const stateName = (data[key] || [])[index];
      const newCities = { ...cities };
      delete newCities[stateName];
      setCities(newCities);
    }
    setData(prev => ({
      ...prev,
      [key]: (prev[key] || []).filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ ...data, cities }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: '#4A0E1A' }}>Lookups</h1>
          <p style={{ color: '#7a6050', fontSize: '13px', marginTop: '2px' }}>Manage dropdown options for registration forms</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          style={{ background: 'linear-gradient(135deg, #6A0D25, #4A0E1A)', color: '#fff', borderRadius: '8px', padding: '10px 24px', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer' }}
        >
          {saving ? <RefreshCw size={16} className="animate-spin" /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save All Changes'}
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sections.map((key) => (
          <div key={key} style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e8d5b0', overflow: 'hidden' }}>
            <div
              onClick={() => setExpanded(prev => ({ ...prev, [key]: !prev[key] }))}
              style={{ padding: '12px 16px', background: '#FFFDF7', borderBottom: '1px solid #e8d5b0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
            >
              <span style={{ fontWeight: '600', fontSize: '14px', color: '#4A0E1A' }}>{sectionLabels[key]}</span>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '11px', color: '#a08070', background: '#f8f0e8', borderRadius: '999px', padding: '2px 10px' }}>
                  {(data[key] || []).length}
                </span>
                {expanded[key] ? <ChevronDown size={14} style={{ color: '#C9A227' }} /> : <ChevronRight size={14} style={{ color: '#C9A227' }} />}
              </div>
            </div>

            {expanded[key] && (
              <div style={{ padding: '12px 16px' }}>
                <div className="flex flex-wrap gap-1.5 mb-3 min-h-[28px]">
                  {(data[key] || []).map((item, i) => (
                    <span key={i} style={{ background: '#f8f0e8', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#4A0E1A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {item}
                      <button onClick={() => handleRemove(key, i)} style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '14px', lineHeight: 1 }}>&times;</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={newItems[key] || ''}
                    onChange={(e) => setNewItems(prev => ({ ...prev, [key]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd(key)}
                    placeholder={`Add ${sectionLabels[key].toLowerCase().slice(0, -1)}...`}
                    style={{ flex: 1, height: '34px', borderRadius: '6px', border: '1.5px solid #e8d5b0', background: '#f8f0e8', padding: '0 10px', fontSize: '12px', outline: 'none', color: '#4A0E1A' }}
                  />
                  <button onClick={() => handleAdd(key)}
                    style={{ width: '34px', height: '34px', borderRadius: '6px', background: 'linear-gradient(135deg, #6A0D25, #4A0E1A)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Cities section - special handling */}
        <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e8d5b0', overflow: 'hidden' }}>
          <div
            onClick={() => setExpanded(prev => ({ ...prev, cities: !prev.cities }))}
            style={{ padding: '12px 16px', background: '#FFFDF7', borderBottom: '1px solid #e8d5b0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
          >
            <span style={{ fontWeight: '600', fontSize: '14px', color: '#4A0E1A' }}>Cities (by State)</span>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '11px', color: '#a08070', background: '#f8f0e8', borderRadius: '999px', padding: '2px 10px' }}>
                {Object.keys(cities).length} states
              </span>
              {expanded.cities ? <ChevronDown size={14} style={{ color: '#C9A227' }} /> : <ChevronRight size={14} style={{ color: '#C9A227' }} />}
            </div>
          </div>

          {expanded.cities && (
            <div style={{ padding: '12px 16px', maxHeight: '400px', overflowY: 'auto' }}>
              {Object.entries(cities).map(([state, cityList]) => (
                <div key={state} style={{ marginBottom: '12px' }}>
                  <div style={{ fontWeight: '600', fontSize: '12px', color: '#4A0E1A', marginBottom: '6px' }}>{state}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(cityList as string[]).map((city, i) => (
                      <span key={i} style={{ background: '#f8f0e8', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', color: '#7a6050' }}>
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

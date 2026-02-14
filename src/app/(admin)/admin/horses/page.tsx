'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState, useCallback } from 'react'
import {
  getAllHorses,
  createHorse,
  updateHorse,
  deleteHorse,
  toggleHorseAvailability,
} from '@/services/horseService'
import type { Horse } from '@/types'
import {
  Plus, Edit, Trash2, ToggleLeft, ToggleRight, X, Save,
} from 'lucide-react'

const GENDERS = ['MALE', 'FEMALE', 'STALLION', 'MARE', 'GELDING'] as const
const LEVELS = ['BEGINNER', 'NOVICE', 'INTERMEDIATE', 'ADVANCED'] as const

const emptyForm = {
  name: '', breed: '', age: 3, gender: 'STALLION' as string,
  color: '', description: '', image: '',
  suitableFor: [] as string[], maxWeight: 100,
}

export default function AdminHorsesPage() {
  const { t } = useTranslation('admin')
  const [horses, setHorses] = useState<Horse[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setHorses(await getAllHorses())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  function openAdd() {
    setForm(emptyForm)
    setEditing(null)
    setShowForm(true)
  }

  function openEdit(horse: Horse) {
    setForm({
      name: horse.name,
      breed: horse.breed,
      age: horse.age,
      gender: horse.gender,
      color: horse.color,
      description: horse.description ?? '',
      image: horse.image ?? '',
      suitableFor: horse.suitableFor as string[],
      maxWeight: horse.maxWeight ?? 100,
    })
    setEditing(horse.id)
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const data = {
        ...form,
        suitableFor: form.suitableFor as ('BEGINNER' | 'NOVICE' | 'INTERMEDIATE' | 'ADVANCED')[],
        gender: form.gender as Horse['gender'],
        available: true,
      }
      if (editing) {
        await updateHorse(editing, data)
      } else {
        await createHorse(data as Omit<Horse, 'id' | 'createdAt' | 'updatedAt'>)
      }
      setShowForm(false)
      await load()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  async function handleToggle(id: string) {
    try {
      await toggleHorseAvailability(id)
      await load()
    } catch (e) {
      console.error(e)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t('deleteHorseConfirm'))) return
    try {
      await deleteHorse(id)
      await load()
    } catch (e) {
      console.error(e)
    }
  }

  function toggleLevel(level: string) {
    setForm((f) => ({
      ...f,
      suitableFor: f.suitableFor.includes(level)
        ? f.suitableFor.filter((l) => l !== level)
        : [...f.suitableFor, level],
    }))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-cream-100">
          {t('horses')}
        </h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-forest-900 rounded-lg text-sm font-bold hover:bg-gold-400 transition-all"
        >
          <Plus className="w-4 h-4" />
          {t('addHorse')}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : horses.length === 0 ? (
        <div className="admin-glass-card rounded-xl p-12 text-center">
          <p className="text-cream-300 font-sans">{t('noHorses')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {horses.map((horse) => (
            <div key={horse.id} className="admin-glass-card rounded-xl overflow-hidden">
              {/* Image */}
              {horse.image && (
                <div className="h-40 overflow-hidden">
                  <img
                    src={horse.image}
                    alt={horse.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-cream-100 font-serif font-bold">{horse.name}</h3>
                    <p className="text-cream-400 text-xs font-sans">
                      {horse.breed} · {horse.age} yrs · {t(horse.gender.toLowerCase())}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                    horse.available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {horse.available ? t('available') : t('blocked')}
                  </span>
                </div>

                {horse.description && (
                  <p className="text-cream-300 text-xs font-sans mb-3 line-clamp-2">{horse.description}</p>
                )}

                {/* Suitable for */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {horse.suitableFor.map((l) => (
                    <span key={l} className="text-[10px] bg-cream-400/10 text-cream-200 px-2 py-0.5 rounded-full font-sans">
                      {t(l.toLowerCase())}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 border-t border-cream-400/10 pt-3">
                  <button onClick={() => handleToggle(horse.id)} className="p-1.5 rounded-lg hover:bg-cream-400/10 text-cream-300 hover:text-cream-100 transition-colors" title={t('toggleAvailability')}>
                    {horse.available ? <ToggleRight className="w-4 h-4 text-green-400" /> : <ToggleLeft className="w-4 h-4 text-red-400" />}
                  </button>
                  <button onClick={() => openEdit(horse)} className="p-1.5 rounded-lg hover:bg-cream-400/10 text-cream-300 hover:text-cream-100 transition-colors" title={t('editHorse')}>
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(horse.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-cream-300 hover:text-red-400 transition-colors" title={t('delete')}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div
            className="admin-glass-card rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif font-bold text-cream-100">
                {editing ? t('editHorse') : t('addHorse')}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-cream-300 hover:text-cream-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <FormField label={t('horseName')} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <FormField label={t('horseBreed')} value={form.breed} onChange={(v) => setForm({ ...form, breed: v })} />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-cream-200 font-sans text-sm mb-1 block">{t('horseAge')}</label>
                  <input
                    type="number" min={0} value={form.age}
                    onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-cream-400/10 border border-cream-400/20 rounded-lg text-cream-100 text-sm font-sans focus:outline-none focus:border-gold-400"
                  />
                </div>
                <div>
                  <label className="text-cream-200 font-sans text-sm mb-1 block">{t('horseGender')}</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-400/10 border border-cream-400/20 rounded-lg text-cream-100 text-sm font-sans focus:outline-none focus:border-gold-400"
                  >
                    {GENDERS.map((g) => (
                      <option key={g} value={g} className="bg-forest-800">{t(g.toLowerCase())}</option>
                    ))}
                  </select>
                </div>
              </div>

              <FormField label={t('horseColor')} value={form.color} onChange={(v) => setForm({ ...form, color: v })} />
              <FormField label={t('horseImage')} value={form.image} onChange={(v) => setForm({ ...form, image: v })} placeholder="https://..." />

              <div>
                <label className="text-cream-200 font-sans text-sm mb-1 block">{t('horseDescription')}</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-cream-400/10 border border-cream-400/20 rounded-lg text-cream-100 text-sm font-sans focus:outline-none focus:border-gold-400 resize-none"
                />
              </div>

              <div>
                <label className="text-cream-200 font-sans text-sm mb-1 block">{t('horseMaxWeight')}</label>
                <input
                  type="number" min={0} value={form.maxWeight}
                  onChange={(e) => setForm({ ...form, maxWeight: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-cream-400/10 border border-cream-400/20 rounded-lg text-cream-100 text-sm font-sans focus:outline-none focus:border-gold-400"
                />
              </div>

              {/* Suitable for multi-select */}
              <div>
                <label className="text-cream-200 font-sans text-sm mb-2 block">{t('horseSuitableFor')}</label>
                <div className="flex flex-wrap gap-2">
                  {LEVELS.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => toggleLevel(level)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        form.suitableFor.includes(level)
                          ? 'bg-gold-500 text-forest-900'
                          : 'bg-cream-400/10 text-cream-300 hover:bg-cream-400/20'
                      }`}
                    >
                      {t(level.toLowerCase())}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving || !form.name || !form.breed || !form.color}
              className="w-full mt-6 flex items-center justify-center gap-2 py-2.5 bg-gold-500 text-forest-900 rounded-lg text-sm font-bold hover:bg-gold-400 disabled:opacity-50 transition-all"
            >
              <Save className="w-4 h-4" />
              {saving ? '...' : t('save')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function FormField({
  label, value, onChange, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div>
      <label className="text-cream-200 font-sans text-sm mb-1 block">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-cream-400/10 border border-cream-400/20 rounded-lg text-cream-100 text-sm font-sans focus:outline-none focus:border-gold-400"
      />
    </div>
  )
}

'use client'

import {
  X,
  Calendar,
  Mail,
  Phone,
  User,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Check,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { BookingCalendar } from './BookingCalendar'
import { HorseSelector } from './HorseSelector'
import { bookingService } from '@/services'
import { getUserLocation } from '@/services/ipGeolocation'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

interface BookingFormData {
  service: string
  name: string
  email: string
  phone: string
  experienceLevel: string
  groupSize: number
  specialRequests: string
  date?: Date
  time?: string
  horseIds: string[]
}

export const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [riderCount, setRiderCount] = useState(1)
  const [formData, setFormData] = useState<BookingFormData>({
    service: '',
    name: '',
    email: '',
    phone: '',
    experienceLevel: 'beginner',
    groupSize: 1,
    specialRequests: '',
    horseIds: [],
  })
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const services = [
    { id: 'safari', name: 'Horse Riding Safari', icon: '🏇' },
    { id: 'academy', name: 'Riding Academy', icon: '🎓' },
    { id: 'private', name: 'Private Lessons', icon: '👤' },
    { id: 'event', name: 'Special Event', icon: '🎉' },
  ]

  const experienceLevels = [
    { id: 'beginner', name: 'Beginner (Never ridden)' },
    { id: 'novice', name: 'Novice (A few times)' },
    { id: 'intermediate', name: 'Intermediate (Comfortable)' },
    { id: 'advanced', name: 'Advanced (Expert rider)' },
  ]

  useEffect(() => {
    setRiderCount(formData.groupSize)
    setFormData((prev) => ({
      ...prev,
      horseIds: prev.horseIds.slice(0, formData.groupSize),
    }))
  }, [formData.groupSize])

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<string, string>> = {}

    if (step === 1 && formData.horseIds.length !== formData.groupSize) {
      newErrors.horses = 'Please select a horse for each rider'
    }
    if (step === 2) {
      if (!formData.date) newErrors.date = 'Please select a date'
      if (!formData.time) newErrors.time = 'Please select a time'
    }
    if (step === 3 && !formData.service) {
      newErrors.service = 'Please select a service'
    }
    if (step === 4) {
      if (!formData.name.trim()) newErrors.name = 'Name is required'
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = 'Invalid email format'
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep(currentStep + 1)
  }
  const handleBack = () => {
    setCurrentStep(currentStep - 1)
    setErrors({})
  }

  const handleHorseSelect = (riderIndex: number, horseId: string) => {
    setFormData((prev) => {
      const newHorseIds = [...prev.horseIds]
      newHorseIds[riderIndex] = horseId
      return { ...prev, horseIds: newHorseIds }
    })
    if (errors.horses) setErrors({ ...errors, horses: undefined })
  }

  const handleSubmit = async () => {
    if (validateStep(4) && formData.date && formData.time) {
      try {
        const location = await getUserLocation()
        await bookingService.create({
          service: formData.service,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          experienceLevel: formData.experienceLevel,
          groupSize: formData.groupSize,
          specialRequests: formData.specialRequests,
          date: formData.date.toISOString().split('T')[0],
          time: formData.time,
          horseIds: formData.horseIds,
          location: location || undefined,
        })
        setIsSubmitted(true)
        setTimeout(() => handleClose(), 3000)
      } catch (error) {
        console.error('Error saving booking:', error)
        setIsSubmitted(true)
        setTimeout(() => handleClose(), 3000)
      }
    }
  }

  const handleClose = () => {
    setCurrentStep(1)
    setFormData({
      service: '',
      name: '',
      email: '',
      phone: '',
      experienceLevel: 'beginner',
      groupSize: 1,
      specialRequests: '',
      horseIds: [],
    })
    setErrors({})
    setIsSubmitted(false)
    onClose()
  }

  const updateFormData = (field: keyof BookingFormData, value: unknown) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) setErrors({ ...errors, [field]: undefined })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-forest-900 border border-gold-400/20 shadow-luxury-lg">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-cream-100" />
        </button>

        {/* Header */}
        <div className="p-8 border-b border-cream-400/20">
          <h2 className="text-3xl font-serif font-bold text-cream-100 mb-2">
            Book Your Experience
          </h2>
          <p className="text-cream-300 font-sans">
            Complete your booking in a few simple steps
          </p>
          <div className="flex items-center gap-2 mt-6">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-8 h-8 font-sans font-bold transition-colors ${
                    currentStep >= step
                      ? 'bg-gold-400 text-forest-900'
                      : 'bg-cream-400/20 text-cream-400'
                  }`}
                >
                  {currentStep > step ? <Check className="w-5 h-5" /> : step}
                </div>
                {step < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > step ? 'bg-gold-400' : 'bg-cream-400/20'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm font-sans text-cream-300">
            <span className={currentStep === 1 ? 'text-gold-400 font-semibold' : ''}>Horses</span>
            <span className={currentStep === 2 ? 'text-gold-400 font-semibold' : ''}>Date & Time</span>
            <span className={currentStep === 3 ? 'text-gold-400 font-semibold' : ''}>Service</span>
            <span className={currentStep === 4 ? 'text-gold-400 font-semibold' : ''}>Details</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {!isSubmitted ? (
            <>
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-sans font-bold text-cream-100 mb-4">Choose Your Horses</h3>
                  <div className="mb-6">
                    <label className="block text-cream-200 font-sans font-semibold mb-3">How many riders?</label>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <button
                          key={num}
                          onClick={() => updateFormData('groupSize', num)}
                          className={`px-4 py-2 font-sans font-semibold transition-colors ${
                            formData.groupSize === num
                              ? 'bg-gold-400 text-forest-900'
                              : 'glass text-cream-100 hover:bg-white/10'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                  <HorseSelector
                    riderCount={riderCount}
                    selectedHorses={formData.horseIds}
                    onHorseSelect={handleHorseSelect}
                    showWarningFor={formData.experienceLevel.toUpperCase() as 'BEGINNER' | 'NOVICE' | 'INTERMEDIATE' | 'ADVANCED'}
                  />
                  {errors.horses && <p className="text-red-400 text-sm font-sans">{errors.horses}</p>}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-sans font-bold text-cream-100 mb-4">Choose Your Date & Time</h3>
                  <BookingCalendar
                    selectedDate={formData.date}
                    selectedTime={formData.time}
                    onDateSelect={(date) => updateFormData('date', date)}
                    onTimeSelect={(time) => updateFormData('time', time)}
                  />
                  {(errors.date || errors.time) && (
                    <p className="text-red-400 text-sm font-sans">Please select both a date and time</p>
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-sans font-bold text-cream-100 mb-4">What would you like to book?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => updateFormData('service', service.id)}
                        className={`p-6 text-left transition-all ${
                          formData.service === service.id
                            ? 'bg-gold-400 text-forest-900 border-gold-400'
                            : 'glass-card text-cream-100 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-3xl mb-3">{service.icon}</div>
                        <div className="text-lg font-sans font-bold">{service.name}</div>
                      </button>
                    ))}
                  </div>
                  {errors.service && <p className="text-red-400 text-sm font-sans">{errors.service}</p>}
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-sans font-bold text-cream-100 mb-4">Your Information</h3>
                  <div>
                    <label className="flex items-center gap-2 text-cream-200 font-sans font-semibold mb-2">
                      <User className="w-4 h-4" /> Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      className="w-full px-4 py-3 bg-cream-400/10 border border-cream-400/20 text-cream-100 font-sans focus:outline-none focus:border-gold-400"
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-400 text-sm font-sans mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-cream-200 font-sans font-semibold mb-2">
                      <Mail className="w-4 h-4" /> Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="w-full px-4 py-3 bg-cream-400/10 border border-cream-400/20 text-cream-100 font-sans focus:outline-none focus:border-gold-400"
                      placeholder="your.email@example.com"
                      dir="ltr"
                    />
                    {errors.email && <p className="text-red-400 text-sm font-sans mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-cream-200 font-sans font-semibold mb-2">
                      <Phone className="w-4 h-4" /> Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      className="w-full px-4 py-3 bg-cream-400/10 border border-cream-400/20 text-cream-100 font-sans focus:outline-none focus:border-gold-400"
                      placeholder="+964 750 123 4567"
                      dir="ltr"
                    />
                    {errors.phone && <p className="text-red-400 text-sm font-sans mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-cream-200 font-sans font-semibold mb-2">
                      Experience Level
                    </label>
                    <select
                      value={formData.experienceLevel}
                      onChange={(e) => updateFormData('experienceLevel', e.target.value)}
                      className="w-full px-4 py-3 bg-cream-400/10 border border-cream-400/20 text-cream-100 font-sans focus:outline-none focus:border-gold-400"
                    >
                      {experienceLevels.map((level) => (
                        <option key={level.id} value={level.id} className="bg-forest-900">
                          {level.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-cream-200 font-sans font-semibold mb-2">
                      <MessageSquare className="w-4 h-4" /> Special Requests (Optional)
                    </label>
                    <textarea
                      value={formData.specialRequests}
                      onChange={(e) => updateFormData('specialRequests', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-cream-400/10 border border-cream-400/20 text-cream-100 font-sans focus:outline-none focus:border-gold-400 resize-none"
                      placeholder="Any special requests?"
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 mb-6">
                <Check className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-cream-100 mb-4">Booking Confirmed!</h3>
              <p className="text-cream-200 font-sans mb-2">
                Thank you, {formData.name}! Your booking request has been received.
              </p>
              <p className="text-cream-300 font-sans text-sm">
                We&apos;ll contact you at {formData.phone} to confirm your booking.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isSubmitted && (
          <div className="p-8 border-t border-cream-400/20 flex justify-between gap-4">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 glass-card text-cream-100 font-sans font-semibold hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" /> Back
              </button>
            )}
            <div className="flex-1" />
            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-gold-400 hover:bg-gold-500 text-forest-900 font-sans font-bold transition-colors"
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-3 bg-gold-400 hover:bg-gold-500 text-forest-900 font-sans font-bold transition-colors"
              >
                <Calendar className="w-5 h-5" /> Confirm Booking
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

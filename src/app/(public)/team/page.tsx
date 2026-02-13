'use client'

import { useTranslation } from 'react-i18next'
import { Users, Award, Briefcase } from 'lucide-react'

// Team data will be provided later — using placeholder structure
const teamMembers = [
  {
    name: 'Team Member',
    role: 'Instructor',
    image: null,
  },
]

export default function TeamPage() {
  const { t } = useTranslation('common')

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="section-spacing">
        <div className="container-breathable text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-cream-100 mb-4">
            Team Mam Loyalty
          </h1>
          <p className="text-lg text-cream-200 font-sans max-w-2xl mx-auto">
            The dedicated professionals behind Mam Center
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="pb-20">
        <div className="container-breathable">
          <div className="glass-card rounded-2xl p-12 text-center">
            <Users className="w-16 h-16 text-cream-300 mx-auto mb-6" />
            <h2 className="text-2xl font-serif font-bold text-cream-100 mb-4">
              Coming Soon
            </h2>
            <p className="text-cream-200 font-sans max-w-lg mx-auto">
              Team information will be updated soon. Our professional team is dedicated to 
              providing the best equestrian experience at Mam Center.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

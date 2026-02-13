'use client'

import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { Users, User } from 'lucide-react'

const teamMembers = [
  {
    name: 'Ahmad Kareem',
    role: 'Founder & Head Trainer',
    description:
      'With over 15 years of equestrian experience, Ahmad founded Mam Center with a vision to bring world-class horse riding to the region.',
    image: null as string | null,
  },
  {
    name: 'Sara Mohammed',
    role: 'Senior Riding Instructor',
    description:
      'A certified equestrian instructor specializing in dressage and show jumping, Sara brings passion and precision to every lesson.',
    image: null as string | null,
  },
  {
    name: 'Omar Hassan',
    role: 'Horse Care Manager',
    description:
      'Omar oversees the health and well-being of all horses at the center, ensuring they receive the best nutrition and veterinary care.',
    image: null as string | null,
  },
  {
    name: 'Lana Ali',
    role: 'Youth Program Coordinator',
    description:
      'Lana designs and leads our youth riding programs, making horse riding accessible and fun for children of all ages.',
    image: null as string | null,
  },
  {
    name: 'Karwan Jamal',
    role: 'Safari & Trail Guide',
    description:
      'An experienced trail guide, Karwan leads our desert safari and nature rides, creating unforgettable outdoor experiences.',
    image: null as string | null,
  },
  {
    name: 'Dina Rashid',
    role: 'Operations Manager',
    description:
      'Dina keeps everything running smoothly — from bookings and scheduling to facility management and customer relations.',
    image: null as string | null,
  },
]

export default function TeamPage() {
  const { t } = useTranslation('common')

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="section-spacing">
        <div className="container-breathable text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] mb-6">
            <Users className="w-4 h-4 text-[var(--color-text-secondary)]" />
            <span className="text-sm font-sans text-[var(--color-text-secondary)]">Our People</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-[var(--color-text-primary)] mb-4">
            Team Mam Loyalty
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] font-sans max-w-2xl mx-auto">
            The dedicated professionals behind Mam Center — united by a shared love for horses and commitment to excellence.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-text-tertiary)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Photo */}
                <div className="relative aspect-[4/5] bg-[var(--color-bg-tertiary)] overflow-hidden">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <User className="w-24 h-24 text-[var(--color-text-tertiary)] opacity-40" />
                    </div>
                  )}
                  {/* Role badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1 text-xs font-sans font-semibold rounded-full bg-[var(--color-bg-primary)]/80 text-[var(--color-text-primary)] backdrop-blur-sm border border-[var(--color-border)]">
                      {member.role}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="text-lg font-serif font-bold text-[var(--color-text-primary)] mb-2">
                    {member.name}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] font-sans leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-10 md:p-14 text-center">
            <h2 className="text-3xl font-serif font-bold text-[var(--color-text-primary)] mb-4">
              Want to Join Our Team?
            </h2>
            <p className="text-[var(--color-text-secondary)] font-sans max-w-lg mx-auto mb-8">
              We&apos;re always looking for passionate equestrians and dedicated professionals to grow with us.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] font-sans font-bold text-sm rounded-lg hover:opacity-90 transition-opacity"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

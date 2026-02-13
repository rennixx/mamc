'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Users, Trophy, Shield, Heart, Truck, TreePine } from 'lucide-react'

const services = [
  {
    icon: Users,
    title: 'Horse Riding for Beginners',
    desc: 'Structured lessons to build confidence and foundational riding skills.',
  },
  {
    icon: Trophy,
    title: 'Jumping Level Training',
    desc: 'Advanced programs for riders refining their jumping techniques.',
  },
  {
    icon: Shield,
    title: 'Daily Rent of the Stable',
    desc: 'Rent the stable for private events, families, and groups.',
  },
  {
    icon: Truck,
    title: 'Horse Transportation',
    desc: 'Reliable and secure transportation for your horse.',
  },
  {
    icon: TreePine,
    title: 'Horse Riding Safari',
    desc: 'Discover the natural beauty of Kurdistan on horseback.',
  },
  {
    icon: Heart,
    title: 'Social Responsibility',
    desc: 'Supporting communities and welcoming people of determination.',
  },
]

export default function HomePage() {
  const { t } = useTranslation('home')

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="/images/horses/equestrian-training.jpg"
          alt="Mam Center Equestrian Club"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 dark:bg-black/70" />
        <div className="relative text-center z-10 px-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 tracking-tight">
            Mam Center
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-sans mb-10 max-w-2xl mx-auto leading-relaxed">
            Where passion meets professionalism in every stride
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="px-10 py-4 bg-white text-black font-sans font-bold rounded-xl hover:bg-white/90 transition-all shadow-luxury text-lg"
            >
              Book Now
            </Link>
            <Link
              href="/services"
              className="px-10 py-4 border-2 border-white text-white font-sans font-bold rounded-xl hover:bg-white/10 transition-all text-lg"
            >
              Our Services
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/70 rounded-full" />
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-spacing">
        <div className="container-breathable">
          <h2 className="section-heading">Our Services</h2>
          <p className="section-subheading">
            A private equestrian club providing premium services to horse lovers
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="glass-card rounded-2xl p-8 card-hover group"
              >
                <service.icon className="w-10 h-10 text-cream-100 mb-5 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-serif font-bold text-cream-100 mb-3">
                  {service.title}
                </h3>
                <p className="text-cream-300 font-sans text-sm leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gold-500 text-forest-900 font-sans font-bold rounded-xl hover:bg-gold-400 transition-colors shadow-tactile"
            >
              View All Services
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Story Teaser */}
      <section className="section-spacing border-t border-cream-400/10">
        <div className="container-breathable">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/facility/riding-arena.png"
                alt="Mam Center riding arena"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-cream-100 mb-6">
                Our Story
              </h2>
              <p className="text-cream-200 font-sans text-lg leading-relaxed mb-6">
                Mam Center is a private equestrian club that provides services to horse lovers, 
                including horse riding and show jumping courses for women, men and children of all 
                kinds, and how to properly deal with horses with high professionalism and creating 
                a social environment for horse lovers, their families and friends.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-gold-400 font-sans font-semibold hover:gap-3 transition-all"
              >
                Learn more about us
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing border-t border-cream-400/10">
        <div className="container-breathable text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-cream-100 mb-6">
            Ready to Ride?
          </h2>
          <p className="text-cream-200 font-sans text-lg max-w-xl mx-auto mb-10">
            Join us at Mam Center – where passion meets professionalism in every stride.
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 px-10 py-4 bg-gold-500 text-forest-900 font-sans font-bold rounded-xl hover:bg-gold-400 transition-colors shadow-luxury text-lg"
          >
            Book Your Experience
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  )
}

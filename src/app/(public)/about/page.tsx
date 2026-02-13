'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Heart, Shield, Users, Award, ArrowRight } from 'lucide-react'

const values = [
  {
    icon: Shield,
    title: 'Professionalism',
    desc: 'Certified instructors and high standards in every service we offer.',
  },
  {
    icon: Heart,
    title: 'Passion',
    desc: 'A genuine love for horses and the equestrian lifestyle.',
  },
  {
    icon: Users,
    title: 'Community',
    desc: 'Creating a social environment for horse lovers, families and friends.',
  },
  {
    icon: Award,
    title: 'Excellence',
    desc: 'Continuously refining our programs to deliver the best experience.',
  },
]

export default function AboutPage() {
  const { t } = useTranslation('about')

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="section-spacing">
        <div className="container-breathable text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-cream-100 mb-6">
            About Mam Center
          </h1>
          <p className="text-lg md:text-xl text-cream-200 font-sans max-w-3xl mx-auto leading-relaxed">
            Mam Center is a private equestrian club that provides services to horse lovers, 
            including horse riding and show jumping courses for women, men and children of all 
            kinds, and how to properly deal with horses with high professionalism and creating 
            a social environment for horse lovers, their families and friends.
          </p>
        </div>
      </section>

      {/* Image + Mission */}
      <section className="pb-20">
        <div className="container-breathable">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-luxury">
              <Image
                src="/images/facility/riding-arena.png"
                alt="Mam Center riding arena"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-cream-100 mb-6">
                Our Mission
              </h2>
              <p className="text-cream-200 font-sans text-base leading-relaxed mb-6">
                We strive to provide a welcoming and professional environment where horse 
                enthusiasts of all levels can learn, grow, and connect through their shared 
                passion for equestrian sports.
              </p>
              <p className="text-cream-200 font-sans text-base leading-relaxed">
                From beginner riding lessons to advanced show jumping training, stable rentals 
                to horse transportation — we cover every aspect of the equestrian experience 
                with dedication and care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-spacing border-t border-cream-400/10">
        <div className="container-breathable">
          <h2 className="section-heading">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {values.map((value) => (
              <div key={value.title} className="glass-card rounded-2xl p-8 text-center card-hover">
                <div className="w-14 h-14 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-5">
                  <value.icon className="w-7 h-7 text-gold-400" />
                </div>
                <h3 className="text-lg font-serif font-bold text-cream-100 mb-3">{value.title}</h3>
                <p className="text-cream-300 font-sans text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facility Gallery */}
      <section className="section-spacing border-t border-cream-400/10">
        <div className="container-breathable">
          <h2 className="section-heading">Our Facility</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
            {[
              { src: '/images/facility/entrance.jpg', alt: 'Entrance' },
              { src: '/images/facility/stable-interior.png', alt: 'Stable Interior' },
              { src: '/images/facility/stable-exterior.png', alt: 'Stable Exterior' },
              { src: '/images/facility/indoor-arena.png', alt: 'Indoor Arena' },
              { src: '/images/facility/riding-arena.png', alt: 'Riding Arena' },
              { src: '/images/facility/clubhouse.png', alt: 'Clubhouse' },
            ].map((img) => (
              <div key={img.alt} className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="absolute bottom-4 left-4 text-white font-sans font-semibold">
                    {img.alt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Responsibility */}
      <section className="section-spacing border-t border-cream-400/10">
        <div className="container-breathable">
          <div className="glass-card rounded-2xl p-10 md:p-16 text-center max-w-4xl mx-auto">
            <Heart className="w-12 h-12 text-gold-400 mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-cream-100 mb-6">
              Social Responsibility
            </h2>
            <p className="text-cream-200 font-sans text-base leading-relaxed">
              Sensing our humanitarian role towards our society and our country, we have the honor 
              to welcome some dear groups and provide them with some support, such as people of 
              determination, people with special needs and children of martyrs, and to participate 
              in national holidays and events as available, provided that this does not conflict 
              with our goals and the public interest.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing border-t border-cream-400/10">
        <div className="container-breathable text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-cream-100 mb-4">
            Join us at Mam Center
          </h2>
          <p className="text-cream-200 font-sans text-lg max-w-xl mx-auto mb-8">
            Where passion meets professionalism in every stride.
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
    </div>
  )
}

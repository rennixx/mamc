'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Users, Trophy, Shield, Truck, TreePine, Heart, ArrowRight } from 'lucide-react'

const services = [
  {
    icon: Users,
    title: 'Horse Riding for Beginners',
    description:
      'Our structured lessons are designed to build confidence, safety, and foundational riding skills under the guidance of certified instructors.',
    image: '/images/services/horse-lesson.jpg',
  },
  {
    icon: Trophy,
    title: 'Jumping Level Training',
    description:
      'We provide advanced training programs for riders aiming to refine their jumping techniques and pursue competitive goals.',
    image: '/images/horses/show-jumping-1.jpg',
  },
  {
    icon: Shield,
    title: 'Daily Rent of the Stable',
    description:
      'The club allows renting the stable for people, families, groups of companies, institutions and friends for your private or public events also renting horses for your special events.',
    image: '/images/facility/stable-interior.png',
  },
  {
    icon: Truck,
    title: 'Horse Transportation',
    description:
      'Our reliable and secure transportation services ensure your horse arrives safely and on time, whether locally or regionally.',
    image: '/images/horses/horse-1.jpg',
  },
  {
    icon: TreePine,
    title: 'Horse Riding Safari',
    description:
      'Discover the natural beauty of Kurdistan on horseback with our exclusive Horse Riding Safaris. Whether you prefer a peaceful solo experience or an adventurous group ride, we offer both private and group safaris tailored to your pace and comfort. Ride through scenic landscapes, guided by our professional team, and enjoy a truly unforgettable equestrian journey.',
    image: '/images/services/riding-safari.jpg',
  },
  {
    icon: Heart,
    title: 'Social Responsibility',
    description:
      'Sensing our humanitarian role towards our society and our country, we have the honor to welcome some dear groups and provide them with some support, such as people of determination, people with special needs and children of martyrs, and to participate in national holidays and events as available, provided that this does not conflict with our goals and the public interest.',
    image: '/images/facility/entrance.jpg',
  },
]

export default function ServicesPage() {
  const { t } = useTranslation('common')

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="section-spacing">
        <div className="container-breathable text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-cream-100 mb-4">
            Our Services
          </h1>
          <p className="text-lg text-cream-200 font-sans max-w-2xl mx-auto">
            Premium equestrian services for horse lovers of all levels
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="pb-20">
        <div className="container-breathable space-y-20">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:direction-reverse' : ''
              }`}
            >
              {/* Image */}
              <div
                className={`relative aspect-[4/3] rounded-2xl overflow-hidden shadow-luxury ${
                  index % 2 === 1 ? 'lg:order-2' : ''
                }`}
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-gold-400" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-cream-100">
                    {service.title}
                  </h2>
                </div>
                <p className="text-cream-200 font-sans text-base leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
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

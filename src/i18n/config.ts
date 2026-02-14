'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// English translations
import enCommon from './locales/en/common.json'
import enNav from './locales/en/nav.json'
import enHome from './locales/en/home.json'
import enServices from './locales/en/services.json'
import enGallery from './locales/en/gallery.json'
import enContact from './locales/en/contact.json'
import enBooking from './locales/en/booking.json'
import enAdmin from './locales/en/admin.json'
import enHorses from './locales/en/horses.json'
import enAbout from './locales/en/about.json'
import enTeam from './locales/en/team.json'
import enAuth from './locales/en/auth.json'
import enRewards from './locales/en/rewards.json'

// Arabic translations
import arCommon from './locales/ar/common.json'
import arNav from './locales/ar/nav.json'
import arHome from './locales/ar/home.json'
import arServices from './locales/ar/services.json'
import arGallery from './locales/ar/gallery.json'
import arContact from './locales/ar/contact.json'
import arBooking from './locales/ar/booking.json'
import arAdmin from './locales/ar/admin.json'
import arHorses from './locales/ar/horses.json'
import arAbout from './locales/ar/about.json'
import arTeam from './locales/ar/team.json'
import arAuth from './locales/ar/auth.json'
import arRewards from './locales/ar/rewards.json'

// Kurdish translations
import kuCommon from './locales/ku/common.json'
import kuNav from './locales/ku/nav.json'
import kuHome from './locales/ku/home.json'
import kuServices from './locales/ku/services.json'
import kuGallery from './locales/ku/gallery.json'
import kuContact from './locales/ku/contact.json'
import kuBooking from './locales/ku/booking.json'
import kuAdmin from './locales/ku/admin.json'
import kuHorses from './locales/ku/horses.json'
import kuAbout from './locales/ku/about.json'
import kuTeam from './locales/ku/team.json'
import kuAuth from './locales/ku/auth.json'
import kuRewards from './locales/ku/rewards.json'

const resources = {
  en: {
    common: enCommon, nav: enNav, home: enHome, services: enServices,
    gallery: enGallery, contact: enContact, booking: enBooking,
    admin: enAdmin, horses: enHorses, about: enAbout, team: enTeam,
    auth: enAuth, rewards: enRewards,
  },
  ar: {
    common: arCommon, nav: arNav, home: arHome, services: arServices,
    gallery: arGallery, contact: arContact, booking: arBooking,
    admin: arAdmin, horses: arHorses, about: arAbout, team: arTeam,
    auth: arAuth, rewards: arRewards,
  },
  ku: {
    common: kuCommon, nav: kuNav, home: kuHome, services: kuServices,
    gallery: kuGallery, contact: kuContact, booking: kuBooking,
    admin: kuAdmin, horses: kuHorses, about: kuAbout, team: kuTeam,
    auth: kuAuth, rewards: kuRewards,
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ku',
    lng: 'ku',
    defaultNS: 'common',
    ns: [
      'common', 'nav', 'admin', 'booking', 'horses',
      'home', 'services', 'gallery', 'contact', 'about', 'team',
      'auth', 'rewards',
    ],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    react: { useSuspense: false },
  })

// RTL languages
const rtlLanguages = ['ar', 'ku']

i18n.dir = (lng?: string) => {
  const language = lng || i18n.language
  return rtlLanguages.includes(language) ? 'rtl' : 'ltr'
}

i18n.on('languageChanged', (lng: string) => {
  if (typeof document !== 'undefined') {
    const dir = rtlLanguages.includes(lng) ? 'rtl' : 'ltr'
    document.documentElement.dir = dir
    document.documentElement.lang = lng
  }
})

// Set initial direction
if (typeof document !== 'undefined') {
  const initialLang = i18n.language || 'ku'
  const initialDir = rtlLanguages.includes(initialLang) ? 'rtl' : 'ltr'
  document.documentElement.dir = initialDir
  document.documentElement.lang = initialLang
}

export default i18n

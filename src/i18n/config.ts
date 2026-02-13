'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// English translations
import enCommon from './locales/en/common.json'
import enNav from './locales/en/nav.json'
import enHome from './locales/en/home.json'
import enSafari from './locales/en/safari.json'
import enLifestyle from './locales/en/lifestyle.json'
import enAcademy from './locales/en/academy.json'
import enGallery from './locales/en/gallery.json'
import enCoffee from './locales/en/coffee.json'
import enContact from './locales/en/contact.json'
import enComponents from './locales/en/components.json'
import enBooking from './locales/en/booking.json'
import enAdmin from './locales/en/admin.json'
import enHorses from './locales/en/horses.json'
import enAbout from './locales/en/about.json'

// Arabic translations
import arCommon from './locales/ar/common.json'
import arNav from './locales/ar/nav.json'
import arHome from './locales/ar/home.json'
import arSafari from './locales/ar/safari.json'
import arLifestyle from './locales/ar/lifestyle.json'
import arAcademy from './locales/ar/academy.json'
import arGallery from './locales/ar/gallery.json'
import arCoffee from './locales/ar/coffee.json'
import arContact from './locales/ar/contact.json'
import arComponents from './locales/ar/components.json'
import arBooking from './locales/ar/booking.json'
import arAdmin from './locales/ar/admin.json'
import arHorses from './locales/ar/horses.json'
import arAbout from './locales/ar/about.json'

// Kurdish translations
import kuCommon from './locales/ku/common.json'
import kuNav from './locales/ku/nav.json'
import kuHome from './locales/ku/home.json'
import kuSafari from './locales/ku/safari.json'
import kuLifestyle from './locales/ku/lifestyle.json'
import kuAcademy from './locales/ku/academy.json'
import kuGallery from './locales/ku/gallery.json'
import kuCoffee from './locales/ku/coffee.json'
import kuContact from './locales/ku/contact.json'
import kuComponents from './locales/ku/components.json'
import kuBooking from './locales/ku/booking.json'
import kuAdmin from './locales/ku/admin.json'
import kuHorses from './locales/ku/horses.json'
import kuAbout from './locales/ku/about.json'

const resources = {
  en: {
    common: enCommon, nav: enNav, home: enHome, safari: enSafari,
    lifestyle: enLifestyle, academy: enAcademy, gallery: enGallery,
    coffee: enCoffee, contact: enContact, components: enComponents,
    booking: enBooking, admin: enAdmin, horses: enHorses, about: enAbout,
  },
  ar: {
    common: arCommon, nav: arNav, home: arHome, safari: arSafari,
    lifestyle: arLifestyle, academy: arAcademy, gallery: arGallery,
    coffee: arCoffee, contact: arContact, components: arComponents,
    booking: arBooking, admin: arAdmin, horses: arHorses, about: arAbout,
  },
  ku: {
    common: kuCommon, nav: kuNav, home: kuHome, safari: kuSafari,
    lifestyle: kuLifestyle, academy: kuAcademy, gallery: kuGallery,
    coffee: kuCoffee, contact: kuContact, components: kuComponents,
    booking: kuBooking, admin: kuAdmin, horses: kuHorses, about: kuAbout,
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
      'common', 'nav', 'admin', 'booking', 'components', 'horses',
      'home', 'safari', 'lifestyle', 'academy', 'gallery', 'coffee',
      'contact', 'about',
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

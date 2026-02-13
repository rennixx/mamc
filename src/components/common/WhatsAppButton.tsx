'use client'

import { MessageCircle } from 'lucide-react'

interface WhatsAppButtonProps {
  phoneNumber?: string
  message?: string
  className?: string
}

export const WhatsAppButton = ({
  phoneNumber = '+9647501234567',
  message = 'Hello! I would like to know more about your services.',
  className = '',
}: WhatsAppButtonProps) => {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-6 left-6 z-50 glass-card p-4 shadow-luxury-lg hover:scale-110 transition-all duration-300 group ${className}`}
      aria-label="Contact us on WhatsApp"
    >
      <div className="relative">
        <MessageCircle
          className="w-7 h-7 text-green-400 group-hover:text-green-300 transition-colors"
          fill="currentColor"
        />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 bg-green-500"></span>
        </span>
      </div>
      <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="glass-nav px-4 py-2 text-cream-100 font-sans text-sm shadow-luxury">
          Chat with us on WhatsApp
        </span>
      </span>
    </button>
  )
}

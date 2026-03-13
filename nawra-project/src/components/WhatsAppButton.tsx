// src/components/WhatsAppButton.tsx
'use client';

import { useState, useEffect } from 'react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export default function WhatsAppButton({
  phoneNumber = '33600000000',
  message = 'Bonjour, je souhaite des informations sur vos corbeilles de fiançailles.',
}: WhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Show button after scroll
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    // Show notification after delay
    const notifTimer = setTimeout(() => {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }, 10000);

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(notifTimer);
    };
  }, []);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50
        transition-all duration-500 ease-spring
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
      `}
    >
      {/* Notification bubble */}
      {showNotification && (
        <div className="absolute bottom-full right-0 mb-3 animate-fade-up">
          <div className="relative bg-white rounded-2xl shadow-2xl p-4 max-w-[240px]">
            <button
              onClick={() => setShowNotification(false)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-dark/80 rounded-full text-white text-xs flex items-center justify-center hover:bg-dark"
            >
              ×
            </button>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
              </div>
              <div>
                <p className="text-dark text-sm font-medium">Besoin d&apos;aide ?</p>
                <p className="text-dark/60 text-xs mt-1">Nous répondons en quelques minutes</p>
              </div>
            </div>
            {/* Arrow */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45" />
          </div>
        </div>
      )}

      {/* Tooltip on hover */}
      <div
        className={`
          absolute bottom-full right-0 mb-3 px-4 py-2 bg-dark/90 backdrop-blur text-cream text-sm rounded-xl
          whitespace-nowrap transition-all duration-300 ease-spring pointer-events-none
          ${isHovered && !showNotification ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        `}
      >
        Discutons sur WhatsApp
        <div className="absolute top-full right-6 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-dark/90" />
      </div>

      {/* Main button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="block"
      >
        <div
          className={`
            relative w-16 h-16 rounded-2xl bg-[#25D366] shadow-lg
            flex items-center justify-center
            transition-all duration-300 ease-spring
            hover:scale-110 hover:shadow-2xl hover:shadow-[#25D366]/40
            hover:rounded-xl
          `}
        >
          <svg
            className="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>

          {/* Online indicator */}
          <span className="absolute top-0 right-0 w-4 h-4 bg-white rounded-full flex items-center justify-center">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          </span>
        </div>
      </a>
    </div>
  );
}

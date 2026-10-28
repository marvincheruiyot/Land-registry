import { ref, computed } from 'vue'
import en from '@/locales/en'
import sw from '@/locales/sw'
import fr from '@/locales/fr'
import ar from '@/locales/ar'

const translations = {
  en,
  sw,
  fr,
  ar
}

const currentLanguage = ref(localStorage.getItem('selectedLanguage') || 'en')

export function useTranslation() {
  const t = (key) => {
    const keys = key.split('.')
    let value = translations[currentLanguage.value]
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        return key // Return key if translation not found
      }
    }
    
    return value || key
  }

  const setLanguage = (lang) => {
    if (translations[lang]) {
      currentLanguage.value = lang
      localStorage.setItem('selectedLanguage', lang)
      
      // Apply RTL for Arabic
      if (lang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl')
        document.documentElement.setAttribute('lang', 'ar')
      } else {
        document.documentElement.setAttribute('dir', 'ltr')
        document.documentElement.setAttribute('lang', lang)
      }
      
      // Force page reload to apply translations everywhere
      window.location.reload()
    }
  }

  const getCurrentLanguage = computed(() => currentLanguage.value)

  return {
    t,
    setLanguage,
    getCurrentLanguage
  }
}

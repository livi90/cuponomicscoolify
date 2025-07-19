import es from '@/app/locales/es.json'
import en from '@/app/locales/en.json'
import fr from '@/app/locales/fr.json'
import de from '@/app/locales/de.json'
import pt from '@/app/locales/pt.json'

const translations: Record<string, any> = { es, en, fr, de, pt }

export function t(locale: string, key: string): string {
  const keys = key.split('.')
  let value: any = translations[locale] || translations['es']
  for (const k of keys) {
    value = value?.[k]
    if (!value) break
  }
  return value || key
} 
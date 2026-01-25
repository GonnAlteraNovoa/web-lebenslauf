import './style.css'
import Alpine from 'alpinejs'
import en from './data/en.json'
import de from './data/de.json'
import es from './data/es.json'

const dictionaries = { en, de, es }

Alpine.data('app', () => ({
  is_logged_in: false,
  current_lang: 'en',
  language_list: ['en', 'de', 'es'],
  visible_personal_info_keys: ['postal_code', 'location', 'country', 'residence_permit', 'driving_license'],
  init() {
    const saved = localStorage.getItem('current_lang')
    if (saved && this.language_list.includes(saved)) {
      this.current_lang = saved
    }
  },
  set_lang(lang) {
    if (!this.language_list.includes(lang)) return
    this.current_lang = lang
    localStorage.setItem('current_lang', lang)
  },
  get content() {
    return dictionaries[this.current_lang]
  },
  get personal_info_items() {
    const info = this.content?.personal_information
    if (!info || !info.fields || !info.labels) return []
    return Object.keys(info.fields)
      .map((key) => ({
        key,
        label: info.labels[key] || key,
        value: info.fields[key],
      }))
      .filter((item) => item.value && this.visible_personal_info_keys.includes(item.key))
  },
  get experience_items() {
    const items = this.content?.professional_experience?.items || []
    return [...items].sort((a, b) => {
      const a_other = a.category === 'other'
      const b_other = b.category === 'other'
      if (a_other === b_other) return 0
      return a_other ? 1 : -1
    })
  },
}))

window.Alpine = Alpine
Alpine.start()

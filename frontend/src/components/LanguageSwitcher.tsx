import { useTranslation } from 'react-i18next'
import { GlobeAltIcon } from '@heroicons/react/24/outline'

export default function LanguageSwitcher() {
    const { i18n } = useTranslation()

    const toggleLanguage = () => {
        const newLang = i18n.language === 'es' ? 'en' : 'es'
        i18n.changeLanguage(newLang)
    }

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-cyan-500 transition-colors rounded-lg hover:bg-slate-100"
            title={i18n.language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
        >
            <GlobeAltIcon className="h-5 w-5" />
            <span className="uppercase">{i18n.language}</span>
        </button>
    )
}

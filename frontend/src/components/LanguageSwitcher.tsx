import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { US, ES, BR, FR } from 'country-flag-icons/react/3x2'

export default function LanguageSwitcher() {
    const { i18n } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)

    const languages = [
        { code: 'es', name: 'Español', Flag: ES },
        { code: 'en', name: 'English', Flag: US },
        { code: 'pt', name: 'Português', Flag: BR },
        { code: 'fr', name: 'Français', Flag: FR }
    ]

    const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0]

    return (
        <div className="relative">
            {/* El botón principal */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-white hover:bg-slate-700 hover:text-cyan-400 transition-colors rounded-lg"
            >
                <currentLang.Flag className="h-5 w-auto rounded-sm shadow-sm" />
                
                <span className="uppercase">{currentLang.code}</span>
                <ChevronDownIcon className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Menú Desplegable*/}
            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-xl z-20 overflow-hidden text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    i18n.changeLanguage(lang.code)
                                    setIsOpen(false)
                                }}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 transition-colors
                                    ${i18n.language === lang.code 
                                        /* Estado Activo */
                                        ? 'bg-cyan-50 text-cyan-600 font-bold dark:bg-slate-700 dark:text-cyan-400' 
                                        /* Estado Inactivo */
                                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                                    }
                                `}
                            >
                                <lang.Flag className="h-5 w-auto rounded-sm shadow-sm" />
                                {lang.name}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
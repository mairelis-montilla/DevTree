import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Importar traducciones
import enTranslations from './locales/en.json'
import esTranslations from './locales/es.json'
import ptTranslations from './locales/pt.json';
import frTranslations from './locales/fr.json';

i18n
    // Detecta idioma del navegador
    .use(LanguageDetector)
    // Pasa la instancia i18n a react-i18next
    .use(initReactI18next)
    // Inicializa i18next
    .init({
        resources: {
            en: {
                translation: enTranslations
            },
            es: {
                translation: esTranslations
            },
            pt: {
                translation: ptTranslations 
                },
            fr: { 
                translation: frTranslations 
            }
        },
        fallbackLng: 'es', // Idioma por defecto
        lng: 'es', // Idioma inicial

        interpolation: {
            escapeValue: false // React ya hace escape
        },

        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng'
        }
    })

export default i18n

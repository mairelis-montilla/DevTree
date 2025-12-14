import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/solid'

export default function NotFoundView() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                <div className="mb-8">
                    <img src="/logo.svg" className="w-64 mx-auto" alt="Logo" />
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-12 space-y-6">
                    <div className="space-y-4">
                        <h1 className="text-9xl font-black text-cyan-400">404</h1>
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
                            {t('notFound.title')}
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-300">
                            {t('notFound.message')}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                            {t('notFound.goBack')}
                        </button>

                        <Link
                            to="/admin"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-400 dark:bg-cyan-500 text-slate-800 dark:text-slate-900 rounded-lg font-bold hover:bg-cyan-500 dark:hover:bg-cyan-600 transition-colors"
                        >
                            <HomeIcon className="h-5 w-5" />
                            {t('notFound.goHome')}
                        </Link>
                    </div>
                </div>

                <p className="mt-8 text-slate-400 text-sm">
                    {t('notFound.help')}
                </p>
            </div>
        </div>
    )
}

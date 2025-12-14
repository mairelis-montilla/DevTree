import { useQuery } from '@tanstack/react-query'
import { searchProfiles } from '../api/DevTreeApi'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function HomeView() {
    const { t } = useTranslation()

    const { data, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: searchProfiles
    })

    if (isLoading) return <p className="text-center text-white mt-10">{t('common.loading')}</p>

    return (
        <div className="min-h-screen bg-gray-900">
            <header className="bg-slate-800 py-5">
                <div className="mx-auto max-w-5xl px-5 flex flex-col md:flex-row items-center justify-between">
                    <div className="w-full md:w-auto">
                        <h1 className="text-3xl font-black text-white text-center md:text-left">
                            Dev<span className="text-green-400">Tree</span>
                        </h1>
                    </div>

                    <nav className="flex gap-4 mt-5 md:mt-0 items-center">
                        <Link
                            to="/auth/login"
                            className="text-white font-bold uppercase hover:text-cyan-400 transition-colors"
                        >
                            {t('home.loginButton')}
                        </Link>
                        <Link
                            to="/auth/register"
                            className="bg-green-400 text-slate-800 px-5 py-2 rounded-lg font-black uppercase hover:bg-cyan-500 transition-colors"
                        >
                            {t('home.registerButton')}
                        </Link>
                    </nav>
                </div>
            </header>

            <div className="bg-gray-800 py-10 lg:py-20">
                <div className="max-w-4xl mx-auto text-center px-5">
                    <h2 className="text-4xl lg:text-5xl font-black text-white mb-5">
                        {t('home.heroTitle')}
                    </h2>
                    <p className="text-xl text-slate-400 mb-10">
                        {t('home.heroDescription')}
                    </p>
                </div>
            </div>

            <main className="py-20 max-w-6xl mx-auto px-5">
                <h3 className="text-2xl font-bold text-white mb-10 text-center uppercase tracking-wide">
                    {t('home.discoverTitle')}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data && data.map((user: any) => (
                        <Link
                            to={`/${user.handle}`}
                            key={user._id}
                            className="bg-slate-800 rounded-xl p-6 flex items-center gap-4 border border-slate-700 hover:border-cyan-400 hover:scale-105 transition-all shadow-lg group"
                        >
                            <img
                                src={user.image || '/default-avatar.png'}
                                alt={user.handle}
                                className="w-16 h-16 rounded-full object-cover border-2 border-slate-600 group-hover:border-cyan-400 transition-colors"
                            />

                            <div className="overflow-hidden">
                                <p className="text-xl font-bold text-white group-hover:text-cyan-400 truncate">
                                    @{user.handle}
                                </p>
                                <p className="text-slate-400 text-sm truncate">
                                    {user.description ? user.description : t('home.noDescription')}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    )
}
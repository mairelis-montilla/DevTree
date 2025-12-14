import { BookmarkSquareIcon, UserIcon } from '@heroicons/react/20/solid'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function NavigationTabs() {
    const { t } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()

    const tabs = [
        { name: t('navigation.links'), href: '/admin', icon: BookmarkSquareIcon },
        { name: t('navigation.profile'), href: '/admin/profile', icon: UserIcon },
    ]

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        navigate(e.target.value)
    }

    return (
        <div className='mb-5'>
            <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                    {t('tabs.selectTab')}
                </label>
                <select
                    id="tabs"
                    name="tabs"
                    className="block w-full rounded-md border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                    onChange={handleChange}
                    value={location.pathname}
                >
                    {tabs.map((tab) => (
                        <option 
                            value={tab.href} 
                            key={tab.name}
                        >{tab.name}</option>
                    ))}
                </select>
            </div>

            <div className="hidden sm:block">
                {/* Borde inferior de la navegación: Oscuro en modo noche */}
                <div className="border-b border-gray-200 dark:border-slate-700">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <Link
                                key={tab.name}
                                to={tab.href}
                                className={classNames(
                                    location.pathname === tab.href
                                        ? 'border-blue-500 text-blue-500'
                                        : 'border-transparent text-gray-500 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-600 hover:text-gray-700 dark:hover:text-slate-200',
                                    'group inline-flex items-center border-b-2 py-4 px-1 text-xl transition-colors'
                                )}
                            >
                                <tab.icon
                                    className={classNames(
                                        location.pathname === tab.href 
                                            ? 'text-blue-500' 
                                            /* Icono Inactivo*/
                                            : 'text-gray-400 dark:text-slate-500 group-hover:text-gray-500 dark:group-hover:text-slate-300',
                                        '-ml-0.5 mr-2 h-5 w-5 transition-colors'
                                    )}
                                    aria-hidden="true"
                                />
                                <span>{tab.name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    )
}
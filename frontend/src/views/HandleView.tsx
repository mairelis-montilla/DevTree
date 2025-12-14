import { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getUserByHandle, registerEvent } from '../api/DevTreeApi'
import { useTranslation } from 'react-i18next'
import { parseLinks } from '../utils'

export default function HandleView() {
    const { t } = useTranslation()
    const params = useParams()
    const handle = params.handle!

    const { data, isLoading, error } = useQuery({
        queryKey: ['user', handle],
        queryFn: () => getUserByHandle(handle),
        retry: 1
    })

    const registerVisit = useMutation({
        mutationFn: registerEvent
    })

    useEffect(() => {
        if (data) {
            registerVisit.mutate({ type: 'visit', handle: handle })
        }
    }, [data])

    if (isLoading) return <p className="text-white text-center font-bold text-2xl mt-10">{t('handle.loadingProfile')}</p>
    if (error) return <Navigate to={'/404'} />

    if (data) {
        const links: any[] = typeof data.links === 'string' ? parseLinks(data.links) : data.links
        const activeLinks = links.filter(link => link.url && link.url.trim() !== "")

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center p-5">

                <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 transition-all hover:shadow-cyan-500/20 border-t-4 border-cyan-400">

                    <div className="flex justify-center -mt-20 mb-5">
                        <img
                            src={data.image || '/default-avatar.png'}
                            alt={t('handle.profileImage')}
                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg bg-slate-100"
                        />
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-slate-800">@{handle}</h1>
                        <p className="text-slate-500 mt-2 text-sm font-medium">{data.description}</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        {activeLinks.length ? (
                            activeLinks.map((link: any) => (
                                <a
                                    key={link._id || link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                                        group flex items-center justify-center
                                        bg-slate-50 p-4 rounded-xl
                                        text-slate-700 font-bold uppercase tracking-wide
                                        border border-slate-200 shadow-sm
                                        transition-all duration-300
                                        hover:bg-cyan-50 hover:border-cyan-200 hover:text-cyan-600 hover:shadow-md hover:-translate-y-1
                                    "
                                    onClick={() => {
                                        registerVisit.mutate({
                                            type: 'click',
                                            handle: handle,
                                            link: link.url
                                        })
                                    }}
                                >
                                    <span className="w-full text-center">{link.name}</span>
                                </a>
                            ))
                        ) : (
                            <p className="text-center text-slate-400 italic">{t('handle.noLinks')}</p>
                        )}
                    </div>
                </div>

                <p className="text-slate-500 mt-10 text-xs">{t('handle.developedWith')}</p>
            </div>
        )
    }
}
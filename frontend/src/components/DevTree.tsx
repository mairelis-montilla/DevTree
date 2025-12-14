import { Link, Outlet } from "react-router-dom";
import NavigationTabs from "./NavigationTabs";
import { Toaster } from "sonner";
import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import type { SocialNetwork, User } from "../types";
import { useEffect, useState } from "react";
import DevTreeLink from "./DevTreeLink";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import { parseLinks } from "../utils";

type DevTreeProps = {
    data: User
}

export default function DevTree({ data }: DevTreeProps) {
    const { t } = useTranslation()
    const [enabledLinks, setEnabledLinks] = useState<SocialNetwork[]>(() => {
        const links = parseLinks(data.links)
        return links.filter((item: SocialNetwork) => item.enabled)
    })

    const queryClient = useQueryClient()

    const handleLogout = () => {
        localStorage.removeItem('AUTH_TOKEN')
        window.location.href = '/'
    }

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e
        if (over && over.id) {
            const prevIndex = enabledLinks.findIndex(link => link.id === active.id)
            const newIndex = enabledLinks.findIndex(link => link.id === over.id)
            const order = arrayMove(enabledLinks, prevIndex, newIndex)

            setEnabledLinks(order)

            const disableLinks: SocialNetwork[] = parseLinks(data.links)
                .filter((item: SocialNetwork) => !item.enabled)

            const links = order.concat(disableLinks)
            queryClient.setQueryData(['user'], (prevData: User) => {
                return {
                    ...prevData,
                    links: JSON.stringify(links)
                }
            })
        }
    }


    useEffect(() => {
        const links = parseLinks(data.links)
        setEnabledLinks(links.filter((item: SocialNetwork) => item.enabled))
    }, [data])


    return (
        <>
            <header className="bg-slate-800 py-5">
                <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center md:justify-between">
                    <div className="w-full p-5 lg:p-0 md:w-1/3">
                        <img src="/logo.svg" className="w-full block" alt="Logo" />
                    </div>
                    <div className="md:w-1/3 md:flex md:justify-end md:gap-3 md:items-center">
                        
                        <ThemeSwitcher />
                        
                        <LanguageSwitcher />
                        
                        <button
                            className="bg-lime-500 p-2 text-slate-800 uppercase font-black text-xs rounded-lg cursor-pointer hover:bg-lime-600 transition-colors"
                            onClick={handleLogout}
                        >
                            {t('auth.logout')}
                        </button>
                    </div>
                </div>
            </header>

            <div className="bg-gray-100 dark:bg-slate-900 min-h-screen py-10 transition-colors duration-300">
                <main className="mx-auto max-w-5xl p-10 md:p-0">

                    <NavigationTabs />

                    <div className="flex justify-end">
                        <Link
                            className="font-bold text-right text-slate-800 dark:text-white text-2xl"
                            to={''}
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            {t('navigation.visit')}: /{data.handle}
                        </Link>
                    </div>

                    <div className="flex flex-col md:flex-row gap-10 mt-10">
                        <div className="flex-1 ">
                            <Outlet />
                        </div>
                        <div className="w-full md:w-96 bg-slate-800 px-5 py-10 space-y-6 rounded-xl shadow-xl">
                            <p className="text-4xl text-center text-white">{data.handle}</p>
                            {data.image &&
                                <img src={data.image} alt='Imagen Perfil' className='mx-auto max-w-[250px] rounded-xl border-4 border-white shadow-lg'></img>
                            }
                            <p className='text-center text-lg font-black text-white'>{data.description}</p>
                            <DndContext
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >

                                <div className="mt-20 flex flex-col gap-5">
                                    <SortableContext items={enabledLinks}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {enabledLinks.map(link => (
                                            <DevTreeLink key={link.id} link={link} />
                                        ))}
                                    </SortableContext>
                                </div>
                            </DndContext>
                        </div>
                    </div>
                </main>
            </div>
            <Toaster position="top-right" />
        </>
    )
}
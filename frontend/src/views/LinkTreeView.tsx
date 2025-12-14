import { useEffect, useState } from "react"
import { useTranslation } from 'react-i18next'
import { social } from '../data/social'
import DevTreeInput from "../components/DevTreeInput"
import { isValidUrl, reassignLinkIds, parseLinks } from "../utils"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProfile } from "../api/DevTreeApi"
import type { SocialNetwork, User } from "../types"

export default function LinkTreeView() {
    const { t } = useTranslation()
    const [devTreeLinks, setDevTreeLinks] = useState(social)

    const QueryClient = useQueryClient()
    const user: User = QueryClient.getQueryData(['user'])!

    const { mutate } = useMutation({
        mutationFn: updateProfile,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success(t('links.updated'))
        }
    })

    useEffect(() => {
        const updateData = devTreeLinks.map(item => {
            const links = parseLinks(user.links)
            const userlink = links.find((link: SocialNetwork) => link.name === item.name)
            if (userlink) {
                return { ...item, url: userlink.url, enabled: userlink.enabled }
            }
            return item
        })
        setDevTreeLinks(updateData)
    }, [])

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedLinks = devTreeLinks.map(link => link.name === e.target.name ? { ...link, url: e.target.value } : link)
        setDevTreeLinks(updatedLinks)

        QueryClient.setQueryData(['user'], (prevData: User) => {
            return {
                ...prevData,
                links: JSON.stringify(updatedLinks)
            }
        })
    }


    const handleEnableLink = (socialNetwork: string) => {
        const currentLink = devTreeLinks.find(link => link.name === socialNetwork)
        if (!currentLink) return

        if (!currentLink.enabled && !isValidUrl(currentLink.url)) {
            toast.error(t('links.invalidUrl'))
            return
        }

        const updatedLocalLinks = devTreeLinks.map(link =>
            link.name === socialNetwork ? { ...link, enabled: !link.enabled } : link
        )
        setDevTreeLinks(updatedLocalLinks)

        const savedLinks: SocialNetwork[] = parseLinks(user.links)
        const existingLinkIndex = savedLinks.findIndex(link => link.name === socialNetwork)

        let updatedSavedLinks: SocialNetwork[]

        if (existingLinkIndex !== -1) {
            updatedSavedLinks = savedLinks.map(link =>
                link.name === socialNetwork ? { ...link, enabled: !link.enabled, url: currentLink.url } : link
            )
        } else {
            if (!currentLink.enabled) {
                updatedSavedLinks = [...savedLinks, { ...currentLink, enabled: true, id: 0 }]
            } else {
                updatedSavedLinks = savedLinks
            }
        }

        const linksWithCorrectIds = reassignLinkIds(updatedSavedLinks)

        QueryClient.setQueryData(['user'], (prevData: User) => ({
            ...prevData,
            links: JSON.stringify(linksWithCorrectIds)
        }))
    }

    return (
        <div className="space-y-5">
            {devTreeLinks.map((item) => (
                <DevTreeInput
                    key={item.name}
                    item={item}
                    handleUrlChange={handleUrlChange}
                    handleEnableLink={handleEnableLink}
                />
            ))}
            
            <button
                className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold hover:bg-cyan-500 transition-colors dark:bg-cyan-500 dark:text-slate-900 dark:hover:bg-cyan-600"
                onClick={() => mutate(QueryClient.getQueryData(['user'])!)}
            >
                {t('common.save')}
            </button>
        </div>
    )
}
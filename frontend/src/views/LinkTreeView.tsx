import { useEffect, useState } from "react"
import { useTranslation } from 'react-i18next'
import {social} from '../data/social'
import DevTreeInput from "../components/DevTreeInput"
import { isValidUrl, reassignLinkIds } from "../utils"
import { toast } from "sonner"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {updateProfile} from "../api/DevTreeApi"
import type { SocialNetwork, User } from "../types"

export default function LinkTreeView(){
    const { t } = useTranslation()
    const [devTreeLinks, setDevTreeLinks] = useState(social)

    const QueryClient = useQueryClient()
    const user: User = QueryClient.getQueryData(['user'])!

    //console.log(JSON.parse(user.links))

    const { mutate } = useMutation({
        mutationFn: updateProfile,
        onError: (error)=> {
            toast.error(error.message)
        },
        onSuccess: ()=>{
            toast.success(t('links.updated'))
        }
    })

    useEffect(()=>{
        //console.log(devTreeLinks)
        //console.log(JSON.parse(user.links))
        const updateData = devTreeLinks.map(item=>{
            console.log(user.links)
            const userlink = JSON.parse(user.links).find((link: SocialNetwork) => link.name === item.name)
            if(userlink){
                return {...item, url: userlink.url, enabled: userlink.enabled
                }
            }
            return item
        })
        setDevTreeLinks(updateData)
    }, [])

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedLinks = devTreeLinks.map(link=> link.name === e.target.name ? {...link, url: e.target.value} : link)
        setDevTreeLinks(updatedLinks)

        QueryClient.setQueryData(['user'], (prevData: User)=>{
            return {
                ...prevData,
                links: JSON.stringify(updatedLinks)
            }
        })
    }


    const handleEnableLink = (socialNetwork: string) => {
        // Obtener el link actual del estado local
        const currentLink = devTreeLinks.find(link => link.name === socialNetwork)

        if (!currentLink) return

        // Si se está intentando habilitar, validar URL primero
        if (!currentLink.enabled && !isValidUrl(currentLink.url)) {
            toast.error(t('links.invalidUrl'))
            return
        }

        // Actualizar estado local del UI
        const updatedLocalLinks = devTreeLinks.map(link =>
            link.name === socialNetwork
                ? {...link, enabled: !link.enabled}
                : link
        )
        setDevTreeLinks(updatedLocalLinks)

        // Obtener links guardados del usuario
        const savedLinks: SocialNetwork[] = JSON.parse(user.links)

        // Buscar si el link ya existe en los links guardados
        const existingLinkIndex = savedLinks.findIndex(link => link.name === socialNetwork)

        let updatedSavedLinks: SocialNetwork[]

        if (existingLinkIndex !== -1) {
            // El link ya existe, actualizar su estado enabled
            updatedSavedLinks = savedLinks.map(link =>
                link.name === socialNetwork
                    ? {...link, enabled: !link.enabled, url: currentLink.url}
                    : link
            )
        } else {
            // El link no existe, agregarlo si se está habilitando
            if (!currentLink.enabled) {
                // Se está habilitando un link nuevo
                updatedSavedLinks = [
                    ...savedLinks,
                    {
                        ...currentLink,
                        enabled: true,
                        id: 0 // Será reasignado por reassignLinkIds
                    }
                ]
            } else {
                // No debería llegar aquí, pero por seguridad
                updatedSavedLinks = savedLinks
            }
        }

        // Re-calcular IDs de manera limpia y secuencial
        const linksWithCorrectIds = reassignLinkIds(updatedSavedLinks)

        // Actualizar cache de React Query
        QueryClient.setQueryData(['user'], (prevData: User) => ({
            ...prevData,
            links: JSON.stringify(linksWithCorrectIds)
        }))
    }

    return(
        <div className="space y-5">
            {devTreeLinks.map((item) => (
                <DevTreeInput 
                    key={item.name} 
                    item={item}
                    handleUrlChange={handleUrlChange}
                    handleEnableLink={handleEnableLink}
             />))}
             <button
             className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold"
             onClick={()=> mutate(QueryClient.getQueryData(['user'])!)}>{t('common.save')}</button>
        </div>
    )
}
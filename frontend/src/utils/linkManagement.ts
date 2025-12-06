import type { SocialNetwork } from "../types"


// Re-calculamos los IDs de los links habilitados de manera secuencial
//Los links habilitados obtienen IDs: 1, 2, 3, 4...
//Los links deshabilitados obtienen ID: 0

export function reassignLinkIds(links: SocialNetwork[]): SocialNetwork[] {
    // Separar links habilitados y deshabilitados
    const enabledLinks = links.filter(link => link.enabled)
    const disabledLinks = links.filter(link => !link.enabled)

    // Asignar IDs secuenciales a los habilitados
    const enabledWithIds = enabledLinks.map((link, index) => ({
        ...link,
        id: index + 1
    }))

    // Asignar ID 0 a los deshabilitados
    const disabledWithIds = disabledLinks.map(link => ({
        ...link,
        id: 0,
        enabled: false
    }))

    // Combinar ambos arrays manteniendo el orden original por nombre
    const allLinks = [...enabledWithIds, ...disabledWithIds]

    // Restaurar el orden original basado en el orden de las redes sociales
    return allLinks.sort((a, b) => {
        const order = ['facebook', 'github', 'instagram', 'x', 'youtube', 'tiktok', 'twitch', 'linkedin']
        return order.indexOf(a.name) - order.indexOf(b.name)
    })
}


//  Actualiza un link específico en el array

export function updateLinkInArray(
    links: SocialNetwork[],
    linkName: string,
    updates: Partial<SocialNetwork>
): SocialNetwork[] {
    return links.map(link =>
        link.name === linkName
            ? { ...link, ...updates }
            : link
    )
}

 // Obtiene el siguiente ID disponible para un nuevo link habilitado
export function getNextLinkId(links: SocialNetwork[]): number {
    const enabledLinks = links.filter(link => link.enabled && link.id > 0)
    return enabledLinks.length + 1
}

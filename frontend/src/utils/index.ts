export function classNames(...classes: string[]){
  return classes.filter(Boolean).join(' ')
}

export function isValidUrl(url: string){
  try{
    new URL(url)
    return true
  }
  catch(error){
    return false
  }
}

/**
 * Safely parses a JSON string containing links data
 * Returns empty array if parsing fails or input is invalid
 */
export function parseLinks(linksStr: string | undefined | null): any[] {
  try {
    if (!linksStr || linksStr.trim() === '') {
      return []
    }
    return JSON.parse(linksStr)
  } catch {
    return []
  }
}

// Re-export link management utilities
export { reassignLinkIds, updateLinkInArray, getNextLinkId } from './linkManagement'
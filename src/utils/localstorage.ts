const RECENT_KEYWORDS_KEY = 'recent_keywords_[]'

// Helper function to get an array from localStorage
const getArray = (key: string) => {
    try {
        const items = localStorage.getItem(key)
        if (items) {
            return JSON.parse(items)
        }
        // Return an empty array if there are no items
        return []
    } catch {
        // Return an empty array in case of error
        return []
    }
}

// Helper function to set an array in localStorage
const setArray = (key: string, value: unknown) => {
    localStorage.setItem(key, JSON.stringify(value))
}

// Function to get recent keywords from localStorage
export const getRecentKeywords = (): string[] => getArray(RECENT_KEYWORDS_KEY)

// Function to add a keyword to the recent keywords list
export const addRecentKeyword = (keyword: string) => {
    const items = getRecentKeywords()
    const existItem = items.find((item) => item === keyword)
    if (existItem) {
        // If the keyword already exists, remove it and add it to the front
        const prevItems = items.filter((item) => item !== keyword)
        setArray(RECENT_KEYWORDS_KEY, [keyword, ...prevItems])
    } else {
        // If the keyword does not exist, add it to the front of the list
        setArray(RECENT_KEYWORDS_KEY, [keyword, ...items])
    }
}

// Function to clear all recent keywords from localStorage
export const clearRecentKeyword = () => {
    localStorage.removeItem(RECENT_KEYWORDS_KEY)
}

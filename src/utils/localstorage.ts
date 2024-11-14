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
    /***TODO***/
    // Implement logic to add a keyword to the recent keywords list
}

// Function to clear all recent keywords from localStorage
export const clearRecentKeyword = () => {
    localStorage.removeItem(RECENT_KEYWORDS_KEY)
}

export const RECENT_ITEM_IDS_KEY = 'recent_item_ids_[]'
export const RECENT_KEYWORDS_KEY = 'recent_keywords_[]'

// Helper function to get an array from localStorage
type ArrayKeys = typeof RECENT_ITEM_IDS_KEY | typeof RECENT_KEYWORDS_KEY

const getArray = (key: ArrayKeys) => {
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
const setArray = (key: ArrayKeys, value: unknown) => {
    localStorage.setItem(key, JSON.stringify(value))
    window.dispatchEvent(new Event(key))
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

// Function to clear all recent keywords
export const clearRecentKeyword = () => {
    setArray(RECENT_KEYWORDS_KEY, [])
}

// Retrieves the list of recent item IDs from localStorage
export const getRecentItemIds = (): string[] => getArray(RECENT_ITEM_IDS_KEY)

/**
 * Adds a product ID to the list of recent items in localStorage.
 * If the product already exists, it moves the product to the front of the list.
 * If the product does not exist, it adds the product ID to the beginning of the list.
 */
export const addRecentItemId = (productId: string) => {
    const items = getRecentItemIds() // Get the current list of recent item IDs
    const existItem = items.find((item) => item === productId) // Check if the product already exists

    if (existItem) {
        // If the product exists, move it to the front
        const prevItems = items.filter((item) => item !== productId) // Remove the existing product ID from the list
        setArray(RECENT_ITEM_IDS_KEY, [productId, ...prevItems]) // Add the product ID to the front of the list
    } else {
        // If the product does not exist, add it to the front
        setArray(RECENT_ITEM_IDS_KEY, [productId, ...items])
    }
}

/**
 * Removes a product ID from the list of recent items in localStorage.
 */
export const removeRecentItemId = (productId: string) => {
    const items = getRecentItemIds() // Get the current list of recent item IDs
    setArray(
        RECENT_ITEM_IDS_KEY,
        items.filter((item) => item !== productId), // Remove the specific product ID from the list
    )
}

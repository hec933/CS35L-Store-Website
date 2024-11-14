import { faker } from '@faker-js/faker'
import { Product } from '@/types'
import { getMockProductData } from '@/utils/mock'

// Define the type for function parameters
type Params = {
    query: string // The search query keyword
    fromPage?: number // The starting page (optional, default is 0)
    toPage?: number // The ending page (optional, default is 1)
}

// Function to generate mock product data based on the search keyword
export async function getProductsByKeyword({
    query,
    fromPage = 0,
    toPage = 1,
}: Params): Promise<{ data: Product[] }> {
    /***TODO***/ // Implement logic to generate and return mock product data

    // Placeholder return to avoid TypeScript errors
    return Promise.resolve({ data: [] })
}

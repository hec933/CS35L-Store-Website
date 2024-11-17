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
    // Create an array of mock product data with length based on the page range
    const data: Product[] = Array.from({
        length: (toPage - fromPage) * 20,
    }).map(() =>
        getMockProductData({
            // Append the query to a generated product name
            title: `${query} - ${faker.commerce.productName()}`,
        }),
    )
    return Promise.resolve({ data })
}

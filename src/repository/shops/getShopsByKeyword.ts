import { faker } from '@faker-js/faker'

import { Shop } from '@/types'
import { getMockShopData } from '@/utils/mock'

// Type definition for function parameters
type Params = {
    query: string // The search query keyword
    fromPage?: number // Starting page (optional, default is 0)
    toPage?: number // Ending page (optional, default is 1)
}

// Function to generate mock shop data based on the search keyword
export async function getShopsByKeyword({
    query,
    fromPage = 0,
    toPage = 1,
}: Params): Promise<{ data: Shop[] }> {
    // Create an array of mock shop data, with 10 shops per page
    const data: Shop[] = Array.from({ length: (toPage - fromPage) * 10 }).map(
        () =>
            getMockShopData({
                // Generate a shop name with the query appended
                name: `${query} - ${faker.internet.displayName()}`,
            }),
    )

    // Return the mock data as a resolved promise
    return Promise.resolve({ data })
}

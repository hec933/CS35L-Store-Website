import { Product } from '@/types'
import { getAuthToken } from '@/utils/auth'
import { getRecentItemIds } from '@/utils/localstorage'
import { getRecentKeywords } from '@/utils/localstorage'


//get the product data for user recents products viewed
export async function getRecentProducts(): Promise<{ 
    data: Product[] }> {


    const recentIds = getRecentItemIds();
    
    if (recentIds.length === 0) {
        return { data: [] };
    }


    const token = await getAuthToken();
    try {
        const products = await Promise.all(
            recentIds.map(async (id) => {
                const response = await fetch(`/api/products?id=${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch product ${id}`);
                }
                const { data } = await response.json();
                return data;
            })
        );


        //remove bad products from user cache
        const validProducts = products.filter(Boolean);
        return { data: validProducts };
    } catch (error) {
        console.error('Error fetching recent products:', error);
        return { data: [] };
    }
}

//get the data by users keywords used
export async function getProductsByRecentKeywords(): Promise<{
     data: Product[] }> {
    const recentKeywords = getRecentKeywords();
    if (recentKeywords.length === 0) {
        return { data: [] };
    }
    const token = await getAuthToken();

    try {//try to get the products
        const products = await Promise.all(
            recentKeywords.map(async (keyword) => {
                const response = await fetch(
                    `/api/products?keyword=${encodeURIComponent(keyword)}&fromPage=0&toPage=1`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                if (!response.ok) {
                    throw new Error(`Failed to fetch products for keyword ${keyword}`);
                }
                const { data } = await response.json();
                return data;
            })
        );

        //clean up thelist
        const allProducts = products.flat();
        const uniqueProducts = allProducts.filter((product, index) => 
            allProducts.findIndex(p => p.id === product.id) === index
        );
        
        return { data: uniqueProducts };
    } catch (error) {
        console.error('Error fetching products by recent keywords:', error);
        return { data: [] };
    }
}















import { Product } from '@/types';
import { fetchWithAuthToken } from '@/utils/auth';

export async function getProductsByTag(tag: string): Promise<{ data: Product[] }> {
    const response = await fetchWithAuthToken(
        `/api/products?tag=${encodeURIComponent(tag)}`,
        'GET'
    );

    const products = response.data.map((product: Product) => ({
        ...product,
        image_urls: product.image_urls?.length ? product.image_urls : ['/placeholder.jpg'],
    }));

    return { data: products };
}

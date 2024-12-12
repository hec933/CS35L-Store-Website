import { Product } from '@/types';
import { fetchWithAuthToken } from '@/utils/auth';

//get a product
export async function getProduct(productId: string): Promise<{ data: Product }> {
    return fetchWithAuthToken('/api/products', 'POST', { productId });
}

//get a list of product ids
export async function getProducts({
    keyword,
    tag,
    fromPage = 0,
    toPage = 1,
}: {
    keyword?: string;
    tag?: string;
    fromPage?: number;
    toPage?: number;
}): Promise<{ data: { id: string }[] }> {
    return fetchWithAuthToken('/api/products', 'POST', { keyword, tag, fromPage, toPage });
}
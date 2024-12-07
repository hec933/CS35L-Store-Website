
import { Product } from '@/types';
import { fetchWithAuthToken } from '@/utils/auth';

//get a product
export async function getProduct(productId: string): Promise<{ data: Product }> {
    return fetchWithAuthToken(`/api/products?id=${productId}`, 'GET');
}

//get a list of products
export async function getProducts({
    fromPage = 0,
    toPage = 1
}: {
    fromPage?: number;
    toPage?: number;
}): Promise<{ data: Product[] }> {
    return fetchWithAuthToken(
        `/api/products?fromPage=${fromPage}&toPage=${toPage}`,
        'GET'
    );
}

//get products by using a keyword
export async function getProductsByKeyword({
    query,
    fromPage = 0,
    toPage = 1,
}: {
    query: string;
    fromPage?: number;
    toPage?: number;
}): Promise<{ data: Product[] }> {
    return fetchWithAuthToken(
        `/api/products?keyword=${encodeURIComponent(query)}&fromPage=${fromPage}&toPage=${toPage}`,
        'GET'
    );
}

//get the products by category
export async function getProductsByTag(tag: string): Promise<{ data: Product[] }> {
    return fetchWithAuthToken(
        `/api/products?tag=${encodeURIComponent(tag)}`,
        'GET'
    );
}
import { fetchWithAuthToken } from '@/utils/auth';

export default async function getProducts({
  productId = null, fromPage = null, toPage = null,
  keyword = null, tag = null,
}: {
  productId?: string | null; fromPage?: number | null; toPage?: number | null;
  keyword?: string | null; tag?: string | null;
})
{
 try {
  if ( keyword ) {
     const { data } = await fetchWithAuthToken('/api/products', 'POST', {
       action: 'fetchKeyword',
       keyword: keyword,
     });
     if ( data && data.length > 0 ) {
     	return data;
     	console.log ('Found:', data.length, ' products with keyword:', keyword)
     } else if ( data && data.length === 0 ) {
        throw new Error('No products found with keyword:${keyword}');
     } else {
        throw new Error('No response for action:${action} and keyword:${keyword}');
     }
  } else if (tag) {
     const {data} = await fetchWithAuthToken('/api/products', 'POST', {
       action: 'fetchTag',
       tag: tag,
     });
     if ( data && data.length > 0 ) {
     	console.log('Found:${data.length} products with tag:${tag}');
	return data;
     } else if ( data && data.length === 0 ) {
        throw new Error('No products found with tag:${tag}');
     } else {
        throw new Error('No response for action:${action} and tag:${tag}');
     }
  } else if ( fromPage && toPage ) {
     const { data } =  await fetchWithAuthToken('/api/products', 'POST', {
       action: 'fetchAll',
       fromPage: fromPage,
       toPage: toPage,
     });
     if ( data && data.length > 0 ) {
     	console.log ('Found:${data.length} products from page:${fromPage} to page:${toPage}');
	console.log(data);
	return data;
     } else if ( data && data.length === 0 ) {
        throw new Error('No products found with keyword:${keyword}');
     } else {
        throw new Error('No response for action:${action} and keyword:${keyword}');
     }
  } else if ( productId ) {
     const { data } = await fetchWithAuthToken('/api/products', 'POST', {
       action: 'fetch',
       productId: productId,
     });
     if ( data && data.length > 0 ) {
     	console.log ('Found product:${productId}');
     	return data;
     } else if ( data || data.length === 0 ) {
        throw new Error('Data received but no product found with id:${productId}');
     } else {
        throw new Error('No response for action:${action} and productId:${productId}');
     }
  } else {
      throw new Error('Unsupported search format');
  }
}
catch (error) {
     console.error('Failed to fetch products:', error);
     return '$0'
}
return '$0'
}

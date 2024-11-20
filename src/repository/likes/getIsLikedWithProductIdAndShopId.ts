type Params = {
    productId: string
    shopId: string
}
// like check (cart list)
export async function getIsLikedWithProductIdAndShopId({
    productId,
    shopId,
}: Params): Promise<{ data: boolean }> {
    return Promise.resolve({ data: false })
}

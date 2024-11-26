import { faker } from '@faker-js/faker'
import { Like, Product, Review, Shop } from '@/types'

export function getMockProductData(defaultValue?: Partial<Product>) {
    const data: Product = {
        id: defaultValue?.id ?? faker.string.uuid(),
        title: defaultValue?.title ?? faker.commerce.productName(),
        price:
            defaultValue?.price ??
            Number(
                (faker.number.int({ min: 10, max: 1000 }) * 0.01).toFixed(2),
            ), // $ 00.00
        address: defaultValue?.address ?? faker.location.city(),
        description:
            defaultValue?.description ?? faker.lorem.sentences(10, '\n'),
        imageUrls:
            defaultValue?.imageUrls ??
            Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(
                () => faker.image.dataUri(),
            ),
        isChangable: defaultValue?.isChangable ?? faker.datatype.boolean(),
        isUsed: defaultValue?.isUsed ?? faker.datatype.boolean(),
        // tags: Array.from({ length: 5 }).map(() => faker.lorem.word()),
        tags:
            (defaultValue?.tags ?? faker.datatype.boolean())
                ? Array.from({
                      length: faker.number.int({ min: 1, max: 5 }),
                  }).map(() => faker.lorem.word())
                : null,
        createdAt: defaultValue?.createdAt ?? faker.date.past().toString(),
        createdBy: defaultValue?.createdBy ?? faker.string.uuid(),
        purchaseBy:
            (defaultValue?.purchaseBy ?? faker.datatype.boolean())
                ? faker.string.uuid()
                : null,
    }
    return data
}

// Shop Mock data
export function getMockShopData(defaultValue?: Partial<Shop>) {
    const data: Shop = {
        id: defaultValue?.id ?? faker.string.uuid(),
        name: defaultValue?.name ?? faker.internet.displayName(),
        imageUrl: defaultValue?.imageUrl ?? faker.image.dataUri(),
        introduce: defaultValue?.introduce ?? faker.lorem.sentences(3, '\n'),
        createdAt: defaultValue?.createdAt ?? faker.date.past().toString(),
    }
    return data
}

// Product shop review
export function getMockReviewData(defaultValue?: Partial<Review>) {
    const data: Review = {
        id: defaultValue?.id ?? faker.string.uuid(),
        productId: defaultValue?.productId ?? faker.string.uuid(),
        contents: defaultValue?.contents ?? faker.lorem.sentences(3, '\n'),
        createdBy: defaultValue?.createdBy ?? faker.string.uuid(),
        createdAt: defaultValue?.createdAt ?? faker.date.past().toString(),
    }
    return data
}

// Cart Like Mock data
export function getMockLikeData(defaultValue?: Partial<Like>) {
    const data: Like = {
        id: defaultValue?.id ?? faker.string.uuid(),
        productId: defaultValue?.productId ?? faker.string.uuid(),
        createdBy: defaultValue?.createdBy ?? faker.string.uuid(),
        createdAt: defaultValue?.createdAt ?? faker.date.past().toString(),
        price: defaultValue?.price ?? Number((Math.random() * 100).toFixed(2)), // Random price between 0.00 and 100.00
    }
    return data
}

// A utility function that returns a promise that resolves after a specified timeout
export const timeout = (ms = 3000) =>
    new Promise((resolve) => {
        // Use setTimeout to wait for the given number of milliseconds before resolving the promise
        setTimeout(resolve, ms)
    })

// Product type
export type Product = {
    id: string
    title: string
    price: number
    address: string
    description: string
    imageUrls: string[]
    isChangable: boolean
    isUsed: boolean
    tags: string[] | null
    createdAt: string
    createdBy: string
    purchaseBy: string | null
}

// Shop type
export type Shop = {
    id: string
    name: string
    imageUrl: string | null
    introduce: string | null
    createdAt: string
}

// product review type
export type Review = {
    id: string
    productId: string
    contents: string
    createdBy: string
    createdAt: string
}

//cart list
export type Like = {
    id: string
    productId: string
    createdBy: string
    createdAt: string
    price: number
}

//user
export type User = {
    id: string;
    name: string;
    email: string;
    profileImageUrl: string | null;
    createdAt: string;
};

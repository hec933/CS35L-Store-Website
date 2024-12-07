//product
export type Product = {
    id: string;
    title: string;
    price: number;
    address: string;
    description: string;
    imageUrls: string[];
    isChangable: boolean;
    isUsed: boolean;
    tags: string[] | null;
    createdAt: string;
    createdBy: string;
    purchaseBy: string | null;
    likeCount: number;
};

//market
export type Market = {
    id: string;
    mostLiked: {
        productId: string;
        likeCount: number;
    }[];
    updatedAt: string;
};

//shop
export type Shop = {
    id: string;
    name: string;
    imageUrl: string | null;
    introduce: string | null;
    createdAt: string;
};

//review
export type Review = {
    id: string;
    productId: string;
    contents: string;
    createdBy: string;
    createdAt: string;
};

//like
export type Like = {
    id: string;
    productId: string;
    createdBy: string;
    createdAt: string;
};

//user
export type User = {
    id: string;
    name: string;
    email: string;
    profileImageUrl: string | null;
    createdAt: string;
};

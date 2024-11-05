import classNames from "classnames";
import ShopProfileImage from "../ShopProfileImage";
import Text from "../Text";

interface Props {
    // The name of the shop
    name: string;

    // URL of the shop profile image
    profileImageUrl?: string;

    // Number of products listed in the shop
    productCount: number;

    // Number of followers of the shop
    followerCount: number;

    // View type of the shop component
    type?: "row" | "column";
}

// Component for displaying shop information
export default function Shop({
    name,
    profileImageUrl,
    productCount,
    followerCount,
    type,
}: Props) {
    return (
        <div
            className={classNames(
                "flex",
                {
                    "flex-row": type === "row",
                    "flex-col": type === "column",
                },
                type === "column" && "gap-1 items-center"
            )}
        >
            <div className="w-14">
                <ShopProfileImage imageUrl={profileImageUrl} />
            </div>
            <div
                className={classNames(
                    "flex flex-col overflow-hidden",
                    type === "row" && "ml-3 justify-around",
                    type === "column" && "w-full"
                )}
            >
                <div
                    className={classNames(
                        "truncate",
                        type === "column" && "text-center"
                    )}
                >
                    <Text>{name}</Text>
                </div>
                <Text
                    size="sm"
                    color={type === "row" ? "grey" : "black"}
                    className={classNames(
                        "flex gap-2",
                        type === "column" && "justify-center"
                    )}
                >
                    <div>Products {productCount.toLocaleString()}</div> |
                    <div>Followers {followerCount.toLocaleString()}</div>
                </Text>
            </div>
        </div>
    );
}

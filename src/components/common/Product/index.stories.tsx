import type { Meta, StoryObj } from "@storybook/react";
import Product from ".";

const meta = {
    title: "Product",
    component: Product,
    tags: ["autodocs"],
    args: {},
    decorators: [
        (Story) => (
            <div className="w-52">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Product>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultProduct: Story = {
    args: {
        title: "Sample Product",
        price: 50.0, // Ensure price is passed as a number
        createdAt: "2024-12-01",
        imageUrl: "https://picsum.photos/200",
    },
};

export const SoldOutProduct: Story = {
    args: {
        title: "Sample Product",
        price: 50.0, // Ensure price is passed as a number
        createdAt: "2024-12-01",
        imageUrl: "https://picsum.photos/200",
        isSoldOut: true,
    },
};

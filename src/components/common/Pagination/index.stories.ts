import type { Meta, StoryObj } from '@storybook/react'
import Pagination from '.'

const meta = {
    title: 'Pagination',
    component: Pagination,
    tags: ['autodocs'],
    args: {
        currentPage: 1,
        count: 100,
        handlePageChange: (pageNumber: number) => {
            // Example function for handlePageChange
            console.log(`Page changed to: ${pageNumber}`)
        },
    },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultProduct: Story = {
    args: {
        currentPage: 1,
        count: 100,
        handlePageChange: (pageNumber: number) => {
            // Example function for handlePageChange
            console.log(`Page changed to: ${pageNumber}`)
        },
    },
}

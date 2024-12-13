import React, { useState, useEffect } from 'react';
import { fetchWithAuthToken } from '@/utils/auth';
import { Product, Shop } from '@/types';
import Button from '@/components/common/Button';

type AdminRole = 'STORE_ADMIN' | 'WEB_ADMIN';

type AdminInfo = {
    role: AdminRole;
    authorizedStores?: string[];
};

function AdminPortal() {
    const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
    const [formType, setFormType] = useState<'product' | 'store'>('product');
    const [storeForm, setStoreForm] = useState({
        name: '',
        imageUrl: '',
        introduce: '',
    });
    const [productForm, setProductForm] = useState({
        title: '',
        price: '',
        address: '',
        description: '',
        imageUrls: [''],
        isChangable: true,
        isUsed: false,
        tags: [''],
    });
    const [isSaving, setIsSaving] = useState(false);
    const [selectedShop, setSelectedShop] = useState<string>('');
    const [shops, setShops] = useState<Shop[]>([]);

    useEffect(() => {
        async function fetchAdminInfo() {
            try {
                const response = await fetchWithAuthToken('/api/user', 'POST', {});
                const user = response?.user;
                if (!user?.role) throw new Error('Role is missing in the response');
                setAdminInfo({ role: user.role, authorizedStores: user.authorizedStores || [] });
            } catch (error) {
                console.error('Failed to fetch admin info:', error);
            }
        }

        fetchAdminInfo();
    }, []);

    useEffect(() => {
        async function fetchShops() {
            if (!adminInfo) return;
            try {
                const { data } = await fetchWithAuthToken('/api/shops', 'POST', {
                    action: 'fetchAll',
                });
                if (!data) throw new Error('Invalid shop data response');
                setShops(data);
            } catch (error) {
                console.error('Failed to fetch shops:', error);
            }
        }
        fetchShops();
    }, [adminInfo]);

    const handleAddStore = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const response = await fetchWithAuthToken('/api/shops', 'POST', {
                action: 'add',
                ...storeForm,
            });
            if (!response?.data) throw new Error('Invalid response structure');
            alert(`Store "${response.data.name}" added successfully!`);
            setStoreForm({ name: '', imageUrl: '', introduce: '' });
        } catch (error) {
            console.error('Error adding store:', error);
            alert('Failed to add store');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedShop) {
            alert('Please select a shop first.');
            return;
        }
        setIsSaving(true);
        try {
            const response = await fetchWithAuthToken('/api/products', 'POST', {
                action: 'add',
                ...productForm,
                shopId: selectedShop,
                price: parseFloat(productForm.price),
            });
            if (!response?.data) throw new Error('Invalid response structure');
            alert(`Product "${response.data.title}" added successfully!`);
            setProductForm({
                title: '',
                price: '',
                address: '',
                description: '',
                imageUrls: [''],
                isChangable: true,
                isUsed: false,
                tags: [''],
            });
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product');
        } finally {
            setIsSaving(false);
        }
    };

    if (!adminInfo) {
        return <div className="p-4 text-red-600">Unauthorized</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Portal</h1>
            {adminInfo.role === 'WEB_ADMIN' && (
                <div className="mb-6 flex justify-center">
                    <Button
                        color="uclaBlue"
                        size="md"
                        className="shadow-lg transform hover:scale-105 transition-transform"
                        onClick={() => setFormType(formType === 'product' ? 'store' : 'product')}
                    >
                        {formType === 'product' ? 'Add Store' : 'Back to Product Form'}
                    </Button>
                </div>
            )}

            {formType === 'store' ? (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Add New Store</h2>
                    <form onSubmit={handleAddStore} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Store Name</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={storeForm.name}
                                onChange={(e) =>
                                    setStoreForm((prev) => ({ ...prev, name: e.target.value }))
                                }
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Image URL</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={storeForm.imageUrl}
                                onChange={(e) =>
                                    setStoreForm((prev) => ({ ...prev, imageUrl: e.target.value }))
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Introduction</label>
                            <textarea
                                className="w-full p-2 border rounded"
                                value={storeForm.introduce}
                                onChange={(e) =>
                                    setStoreForm((prev) => ({ ...prev, introduce: e.target.value }))
                                }
                                rows={4}
                            />
                        </div>
                        <Button
                            color="uclaBlue"
                            size="md"
                            type="submit"
                            isLoading={isSaving}
                            className="shadow-lg transform hover:scale-105 transition-transform"
                        >
                            Save Store
                        </Button>
                    </form>
                </div>
            ) : (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
                    <form onSubmit={handleAddProduct} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Select Shop</label>
                            <select
                                className="w-full p-2 border rounded"
                                value={selectedShop}
                                onChange={(e) => setSelectedShop(e.target.value)}
                            >
                                <option value="">Choose a shop</option>
                                {shops.map((shop) => (
                                    <option key={shop.id} value={shop.id}>
                                        {shop.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={productForm.title}
                                onChange={(e) =>
                                    setProductForm((prev) => ({ ...prev, title: e.target.value }))
                                }
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Price</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded"
                                value={productForm.price}
                                onChange={(e) =>
                                    setProductForm((prev) => ({ ...prev, price: e.target.value }))
                                }
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Address</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={productForm.address}
                                onChange={(e) =>
                                    setProductForm((prev) => ({ ...prev, address: e.target.value }))
                                }
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                className="w-full p-2 border rounded"
                                value={productForm.description}
                                onChange={(e) =>
                                    setProductForm((prev) => ({ ...prev, description: e.target.value }))
                                }
                                rows={4}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Image URLs</label>
                            <textarea
                                className="w-full p-2 border rounded"
                                value={productForm.imageUrls.join('\n')}
                                onChange={(e) =>
                                    setProductForm((prev) => ({ ...prev, imageUrls: e.target.value.split('\n') }))
                                }
                                rows={2}
                            />
                        </div>
                        <Button
                            color="uclaBlue"
                            size="md"
                            type="submit"
                            isLoading={isSaving}
                            className="shadow-lg transform hover:scale-105 transition-transform"
                        >
                            Save Product
                        </Button>
                    </form>
                </div>
            )}
        </div>
    );
}

export { AdminPortal };

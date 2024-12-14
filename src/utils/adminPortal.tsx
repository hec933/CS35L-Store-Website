import React, { useState, useEffect, useRef } from 'react';
import { fetchWithAuthToken } from '@/utils/auth';
import { Product, Shop } from '@/types';
import Button from '@/components/common/Button';

type AdminRole = 'STORE_ADMIN' | 'WEB_ADMIN';

type AdminInfo = {
    role: AdminRole;
    authorizedStores?: string[];
};

export default function AdminPortal() {
    const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
    const [formType, setFormType] = useState<'product' | 'store'>('product');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [storeForm, setStoreForm] = useState({
        name: '',
        imageUrl: '',
        introduce: '',
    });
    const [productForm, setProductForm] = useState<{
        title: string;
        price: string;
        address: string;
        description: string;
        imageUrls: string[];
        newImageUrl: string;
        isChangable: boolean;
        isUsed: boolean;
        tags: string[];
    }>({
        title: '',
        price: '',
        address: 'United States',
        description: '',
        imageUrls: [],
        newImageUrl: '',
        isChangable: true,
        isUsed: false,
        tags: [''],
    });
    const [isSaving, setIsSaving] = useState(false);
    const [selectedShop, setSelectedShop] = useState<string>('');
    const [selectedProduct, setSelectedProduct] = useState<string>('');
    const [shops, setShops] = useState<Shop[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isUrlValid, setIsUrlValid] = useState<boolean | null>(null);

    const baselineFormRef = useRef(productForm);
    const isInitialSelection = useRef(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (!productForm.newImageUrl) {
                setIsUrlValid(null);
                return;
            }
            const dangerousChars = /[<>{}|\\^`]|javascript:/i;
            const validImageExt = /\.(jpg|jpeg|png|gif|webp|svg)$/i;

            setIsUrlValid(
                !dangerousChars.test(productForm.newImageUrl) &&
                validImageExt.test(productForm.newImageUrl)
            );
        }, 500);
        return () => clearTimeout(handler);
    }, [productForm.newImageUrl]);

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

    useEffect(() => {
        async function fetchProducts() {
            if (!selectedShop) return;
            try {
                const response = await fetchWithAuthToken('/api/products', 'POST', {
                    action: 'fetch',
                    shopId: selectedShop,
                });
                if (!response || !response.data) {
                    throw new Error('No products found for the selected store.');
                }
                console.log('Fetched products:', response.data);
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
                alert('Failed to fetch products. Please try again.');
            }
        }
        fetchProducts();
    }, [selectedShop]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted');
        setIsSaving(true);

        try {
            if (formType === 'product') {
                console.log('Submitting product:', {
                    selectedShop,
                    title: productForm.title,
                    price: productForm.price
                });

                const payload = {
                    action: 'add',
                    shopId: selectedShop,
                    title: productForm.title,
                    price: parseFloat(productForm.price),
                    address: productForm.address,
                    description: productForm.description,
                    imageUrls: productForm.imageUrls,
                    isChangable: productForm.isChangable,
                    isUsed: productForm.isUsed,
                    tags: productForm.tags,
                };

                const response = await fetchWithAuthToken('/api/products', 'POST', payload);
                console.log('Server response:', response);

                if (response?.data) {
                    alert('Product saved!');
                    
                    // Update baseline to reflect saved state
                    baselineFormRef.current = { ...productForm };
                    setHasUnsavedChanges(false);

                    // Refresh product list
                    const updatedProducts = await fetchWithAuthToken('/api/products', 'POST', {
                        action: 'fetch',
                        shopId: selectedShop,
                    });
                    if (updatedProducts?.data) {
                        setProducts(updatedProducts.data);
                    }
                }
            }
        } catch (error) {
            console.error('Error saving:', error);
            alert('Failed to save. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleFormChange = (field: keyof typeof productForm, value: any) => {
        setProductForm((prev) => {
            const updatedForm = { ...prev, [field]: value };
            
            // Only check for changes if we're not in initial selection mode
            if (!isInitialSelection.current) {
                const hasChanges = Object.keys(updatedForm).some(key => {
                    const currentVal = updatedForm[key as keyof typeof productForm];
                    const baselineVal = baselineFormRef.current[key as keyof typeof productForm];
                    
                    if (Array.isArray(currentVal)) {
                        return JSON.stringify(currentVal) !== JSON.stringify(baselineVal);
                    }
                    return currentVal !== baselineVal;
                });
                setHasUnsavedChanges(hasChanges);
            }
            
            return updatedForm;
        });
    };

    const handleShopChange = (shopId: string) => {
        // Only check for changes if they've actually modified something
        if (hasUnsavedChanges) {
            const confirmDiscard = confirm(
                'You have unsaved changes. Are you sure you want to switch stores and discard them?'
            );
            if (!confirmDiscard) return;
        }

        setSelectedShop(shopId);
        setSelectedProduct('');
        // Reset form to initial state
        const initialForm = {
            title: '',
            price: '',
            address: 'United States',
            description: '',
            imageUrls: [],
            newImageUrl: '',
            isChangable: true,
            isUsed: false,
            tags: [''],
        };
        setProductForm(initialForm);
        baselineFormRef.current = initialForm;
        setHasUnsavedChanges(false);
        isInitialSelection.current = true;
    };

    const handleProductSelect = (product: Product) => {
        console.log('Selecting product:', product);
        
        if (!product) return;

        // Only show alert if there are actual changes to current data
        if (hasUnsavedChanges) {
            const confirmDiscard = confirm(
                'You have unsaved changes. Are you sure you want to switch products and discard them?'
            );
            if (!confirmDiscard) return;
        }

        const newProductForm = {
            title: product.title,
            price: product.price.toString(),
            address: product.address,
            description: product.description,
            imageUrls: product.imageUrls || [],
            newImageUrl: '',
            isChangable: product.isChangable,
            isUsed: product.isUsed,
            tags: product.tags || [''],
        };

        setProductForm(newProductForm);
        baselineFormRef.current = newProductForm;  // Set the baseline to compare against
        setSelectedProduct(product.id);
        setHasUnsavedChanges(false);  // Reset changes flag
        isInitialSelection.current = false;
        setIsDropdownOpen(false);
    };

    const handleAddImageUrl = async () => {
        if (!productForm.newImageUrl) return;
        try {
            if (true) {
                setProductForm((prev) => ({
                    ...prev,
                    imageUrls: [...prev.imageUrls, prev.newImageUrl],
                    newImageUrl: '',
                }));
            } else {
                alert('Invalid URL');
            }
        } catch (error) {
            console.error('Error validating URL:', error);
            alert('Failed to validate URL');
        }
    };

    const handleDelete = async () => {
        if (formType === 'store') {
            if (!selectedShop) {
                alert('Please select a store to delete.');
                return;
            }
            if (!confirm('Are you sure you want to delete this store?')) return;

            setIsSaving(true);
            try {
                await fetchWithAuthToken('/api/shops', 'DELETE', {
                    shopId: selectedShop,
                });
                alert('Store deleted successfully!');
                setShops((prev) => prev.filter((shop) => shop.id !== selectedShop));
                setSelectedShop('');
            } catch (error) {
                console.error('Error deleting store:', error);
                alert('Failed to delete store');
            } finally {
                setIsSaving(false);
            }
        } else if (formType === 'product') {
            if (!selectedProduct) {
                alert('Please select a product to delete.');
                return;
            }
            if (!confirm('Are you sure you want to delete this product?')) return;

            setIsSaving(true);
            try {
                await fetchWithAuthToken('/api/products', 'DELETE', {
                    productId: selectedProduct,
                });
                alert('Product deleted successfully!');
                setProducts((prev) => prev.filter((product) => product.id !== selectedProduct));
                setSelectedProduct('');
                // Reset form after successful delete
                const initialForm = {
                    title: '',
                    price: '',
                    address: 'United States',
                    description: '',
                    imageUrls: [],
                    newImageUrl: '',
                    isChangable: true,
                    isUsed: false,
                    tags: [''],
                };
                setProductForm(initialForm);
                baselineFormRef.current = initialForm;
                setHasUnsavedChanges(false);
                isInitialSelection.current = true;
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Failed to delete product');
            } finally {
                setIsSaving(false);
            }
        }
    };

    const countryOptions = [
        '...',
        'Australia',
        'Canada',
        'China',
        'Europe',
        'Japan',
        'Mexico',
        'Russia',
        'United States',
    ];

    const currencyMap: Record<string, string> = {
        'United States': '$',
        Canada: 'C$',
        Mexico: 'MX$',
        Europe: '€',
        China: '¥',
        Japan: '¥',
        Australia: 'A$',
        Russia: '₽',
    };

    const currencySymbol = currencyMap[productForm.address] || '$';

return (
        <div className="py-12 px-6">
            <div className="pt-8">
                <div className="flex justify-center mb-6">
                    <Button
                        color="uclaBlue"
                        size="md"
                        className="shadow-lg transform hover:scale-105 transition-transform"
                        onClick={() => setFormType(formType === 'product' ? 'store' : 'product')}
                    >
                        {formType === 'product' ? 'Switch to Store Form' : 'Switch to Product Form'}
                    </Button>
                </div>
            </div>

            {formType === 'store' ? (
                <div className="mb-8">
                    <form className="space-y-4" onSubmit={handleSubmit}>
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
                        <div className="flex justify-center">
                            <Button
                                color="uclaBlue"
                                size="md"
                                type="submit"
                                isLoading={isSaving}
                                className="shadow-lg transform hover:scale-105 transition-transform"
                            >
                                Add Store
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="mb-8">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium mb-1">Shop</label>
                            <select
                                className="w-full p-2 border rounded"
                                value={selectedShop}
                                onChange={(e) => handleShopChange(e.target.value)}
                                required
                            >
                                <option value="" disabled>
                                    Select a shop...
                                </option>
                                {shops?.map((shop) => (
                                    <option key={shop.id} value={shop.id}>
                                        {shop.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Product</label>
                            <div className="relative" ref={dropdownRef}>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={productForm.title}
                                    onChange={(e) => {
                                        handleFormChange('title', e.target.value);
                                        setIsDropdownOpen(true);
                                    }}
                                    onFocus={() => setIsDropdownOpen(true)}
                                    required
                                />
                                {isDropdownOpen && products.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                                        {products.map((product) => (
                                            <div
                                                key={product.id}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleProductSelect(product)}
                                            >
                                                {product.title}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Price ({currencySymbol})
                            </label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded"
                                value={productForm.price}
                                onChange={(e) => handleFormChange('price', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Country</label>
                            <select
                                className="w-full p-2 border rounded"
                                value={productForm.address}
                                onChange={(e) => handleFormChange('address', e.target.value)}
                            >
                                {countryOptions.map((country) => (
                                    <option key={country} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                className="w-full p-2 border rounded"
                                value={productForm.description}
                                onChange={(e) => handleFormChange('description', e.target.value)}
                                rows={4}
                                required
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                type="text"
                                className="w-full p-2 border rounded mr-2"
                                placeholder="Image URL"
                                value={productForm.newImageUrl}
                                onChange={(e) => handleFormChange('newImageUrl', e.target.value)}
                            />
                            <Button
                                color={
                                    isUrlValid === null
                                        ? 'uclaBlue'
                                        : isUrlValid
                                        ? 'uclaGold'
                                        : 'red'
                                }
                                size="md"
                                onClick={handleAddImageUrl}
                                type="button"
                                className="shadow-lg transform hover:scale-105 transition-transform whitespace-nowrap"
                            >
                                Add Image URL
                            </Button>
                        </div>
                        <div>
                            <ul>
                                {productForm.imageUrls?.map((url, index) => (
                                    <li key={index} className="break-words">
                                        {url}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={productForm.isChangable}
                                    onChange={(e) => handleFormChange('isChangable', e.target.checked)}
                                />
                                Can be returned
                            </label>
                            <label className="block text-sm font-medium mb-1">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={productForm.isUsed}
                                    onChange={(e) => handleFormChange('isUsed', e.target.checked)}
                                />
                                Is used
                            </label>
                        </div>
                        <div className="flex justify-between">
                            <Button
                                color="uclaBlue"
                                size="md"
                                type="submit"
                                isLoading={isSaving}
                                className="shadow-lg transform hover:scale-105 transition-transform"
                            >
                                Save Product
                            </Button>
                            <Button
                                color="red"
                                size="md"
                                onClick={handleDelete}
                                className="shadow-lg transform hover:scale-105 transition-transform"
                            >
                                Delete Product
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

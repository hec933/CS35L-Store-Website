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
    const [isImageUrlDropdownOpen, setIsImageUrlDropdownOpen] = useState(false);
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
	quantity: number;
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
	quantity: 0,
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
    const imageUrlDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (isImageUrlDropdownOpen && imageUrlDropdownRef.current && !imageUrlDropdownRef.current.contains(event.target as Node)) {
                setIsImageUrlDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen, isImageUrlDropdownOpen]);

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
                    action: 'fetchShop',
                    shop_id: selectedShop,
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

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(`Submitting ${formType} form`);
        setIsSaving(true);

        try {
            switch (formType) {
                case 'product': {
                    console.log('Submitting product:', {
                        selectedShop,
                        title: productForm.title,
                        price: productForm.price
                    });

                    const payload = {
                        action: 'add',
                        shop_id: selectedShop,
                        title: productForm.title,
                        price: parseFloat(productForm.price),
                        address: productForm.address,
                        description: productForm.description,
                        image_urls: productForm.imageUrls,
                        is_changable: productForm.isChangable,
                        is_used: productForm.isUsed,
                        tags: productForm.tags,
			quantity: productForm.quantity,
                    };

                    const response = await fetchWithAuthToken('/api/products', 'POST', payload);
                    console.log('Server response:', response);

                    if (response?.data) {
                        alert('Product saved!');
                        
                        baselineFormRef.current = { ...productForm };
                        setHasUnsavedChanges(false);

                        const updatedProducts = await fetchWithAuthToken('/api/products', 'POST', {
                            action: 'fetch',
                            shop_id: selectedShop,
                        });
                        if (updatedProducts?.data) {
                            setProducts(updatedProducts.data);
                        }
                    }
                    break;
                }
                
                case 'store': {
                    console.log('Submitting store:', storeForm);

                    const payload = {
                        action: 'add',
                        ...storeForm
                    };

                    const response = await fetchWithAuthToken('/api/shops', 'POST', payload);
                    console.log('Server response:', response);

                    if (response?.data) {
                        alert('Store saved!');
                        
                        const { data } = await fetchWithAuthToken('/api/shops', 'POST', {
                            action: 'fetchAll',
                        });
                        if (data) {
                            setShops(data);
                        }

                        setStoreForm({
                            name: '',
                            imageUrl: '',
                            introduce: '',
                        });
                        setHasUnsavedChanges(false);
                    }
                    break;
                }

                default:
                    console.error('Unknown form type:', formType);
                    alert('Invalid form type');
            }
        } catch (error) {
            console.error(`Error saving ${formType}:`, error);
            alert(`Failed to save ${formType}. Please try again.`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleFormChange = (field: keyof typeof productForm, value: any) => {
        setProductForm((prev) => {
            const updatedForm = { ...prev, [field]: value };
            
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

    const handleStoreFormChange = (field: keyof typeof storeForm, value: string) => {
        setStoreForm(prev => {
            const updatedForm = { ...prev, [field]: value };
            setHasUnsavedChanges(true);
            return updatedForm;
        });
    };

    const handleImageUrlSelect = (url: string) => {
        handleFormChange('newImageUrl', url);
        setIsImageUrlDropdownOpen(false);
    };

    const handleImageUrlAction = () => {
        if (productForm.imageUrls.includes(productForm.newImageUrl)) {
            // Remove URL
            handleFormChange('imageUrls', 
                productForm.imageUrls.filter(url => url !== productForm.newImageUrl)
            );
            handleFormChange('newImageUrl', '');
        } else if (productForm.newImageUrl) {
            // Add URL
            handleFormChange('imageUrls', 
                [...productForm.imageUrls, productForm.newImageUrl]
            );
            handleFormChange('newImageUrl', '');
        }
    };

    const handleShopChange = (shopId: string) => {
        if (hasUnsavedChanges) {
            const confirmDiscard = confirm(
                'You have unsaved changes. Are you sure you want to switch stores and discard them?'
            );
            if (!confirmDiscard) return;
        }

        setSelectedShop(shopId);
        setSelectedProduct('');
        const initialForm = {
            title: '',
            price: '',
            address: 'United States',
            description: '',
            imageUrls: [],
            newImageUrl: '',
            isChangable: true,
            isUsed: false,
	    quantity: 0,
            tags: [''],
        };
        setProductForm(initialForm);
        baselineFormRef.current = initialForm;
        setHasUnsavedChanges(false);
        isInitialSelection.current = true;
        setIsImageUrlDropdownOpen(false);
    };

    const handleProductSelect = (product: Product) => {
        console.log('Selecting product:', product);
        
        if (!product) return;

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
            imageUrls: Array.isArray(product.image_urls) ? [...product.image_urls] : [],
            newImageUrl: '',
            isChangable: product.is_changable,
            isUsed: product.is_used,
	    quantity: product.quantity,
            tags: product.tags || [''],
        };

        setProductForm(newProductForm);
        baselineFormRef.current = newProductForm;
        setSelectedProduct(product.id);
        setHasUnsavedChanges(false);
        isInitialSelection.current = false;
        setIsDropdownOpen(false);
        setIsImageUrlDropdownOpen(false);
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
                    id: selectedShop,
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
                const initialForm = {
                    title: '',
                    price: '',
                    address: 'United States',
                    description: '',
                    imageUrls: [],
                    newImageUrl: '',
                    isChangable: true,
                    isUsed: false,
		    quantity: 0,
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
                {adminInfo?.role === 'WEB_ADMIN' && (
                    <div className="flex justify-center mb-6">
                        <Button
                            color="uclaBlue"
                            size="md"
                            className="shadow-lg transform hover:scale-105 transition-transform"
                            onClick={() => {
                                if (hasUnsavedChanges) {
                                    const confirmDiscard = confirm(
                                        'You have unsaved changes. Are you sure you want to switch forms and discard them?'
                                    );
                                    if (!confirmDiscard) return;
                                }
                                setFormType(formType === 'product' ? 'store' : 'product');
                                // Clear form when switching
                                if (formType === 'product') {
                                    setStoreForm({
                                        name: '',
                                        imageUrl: '',
                                        introduce: '',
                                    });
                                } else {
                                    const initialForm = {
                                        title: '',
                                        price: '',
                                        address: 'United States',
                                        description: '',
                                        imageUrls: [],
                                        newImageUrl: '',
                                        isChangable: true,
                                        isUsed: false,
					quantity: 0,
                                        tags: [''],
                                    };
                                    setProductForm(initialForm);
                                    baselineFormRef.current = initialForm;
                                }
                                setHasUnsavedChanges(false);
                                isInitialSelection.current = true;
                            }}
                        >
                            {formType === 'product' ? 'Edit Stores' : 'Back to Products'}
                        </Button>
                    </div>
                )}
            </div>

            {formType === 'store' ? (
                <div className="mb-8">
                    <form className="space-y-4" onSubmit={handleFormSubmit}>
                        <div>
                            <label className="block text-sm font-medium mb-1">Store Name</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={storeForm.name}
                                onChange={(e) => handleStoreFormChange('name', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Image URL</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={storeForm.imageUrl}
                                onChange={(e) => handleStoreFormChange('imageUrl', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Introduction</label>
                            <textarea
                                className="w-full p-2 border rounded"
                                value={storeForm.introduce}
                                onChange={(e) => handleStoreFormChange('introduce', e.target.value)}
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
                    <form className="space-y-4" onSubmit={handleFormSubmit}>
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

                        {/* Image URL section */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Image URL</label>
                            <div className="relative" ref={imageUrlDropdownRef}>
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded mr-2"
                                        placeholder="Add or select image URL"
                                        value={productForm.newImageUrl}
                                        onChange={(e) => handleFormChange('newImageUrl', e.target.value)}
                                        onFocus={() => setIsImageUrlDropdownOpen(true)}
                                    />
                                    <Button
                                        color={productForm.imageUrls.includes(productForm.newImageUrl) ? 'red' : 'uclaBlue'}
                                        size="md"
                                        onClick={handleImageUrlAction}
                                        type="button"
                                        className="whitespace-nowrap"
                                    >
                                        {productForm.imageUrls.includes(productForm.newImageUrl) ? 'Remove URL' : 'Add URL'}
                                    </Button>
                                </div>
                                {isImageUrlDropdownOpen && productForm.imageUrls.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                                        {productForm.imageUrls.map((url, index) => (
                                            <div
                                                key={index}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleImageUrlSelect(url)}
                                            >
                                                {url}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>


		<div className="flex items-start space-x-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Quantity
                            </label>
                            <input
                                type="number"
                                className="p-2 border rounded"
                                value={productForm.quantity}
                                onChange={(e) => handleFormChange('quantity', e.target.value)}
                                required
                            />
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


import React, { useState, useEffect } from 'react';
import { fetchWithAuthToken } from '@/utils/auth';

type AdminRole = 'STORE_ADMIN' | 'WEB_ADMIN';
type AdminInfo = {
  role: AdminRole;
  authorizedStores?: string[];
};

type Shop = {
  id: string;
  name: string;
  image_url?: string;
  introduce?: string;
};

type Product = {
  id: string;
  title: string;
  price: number;
  description: string;
  imageUrls: string[];
  isChangable: boolean;
  isUsed: boolean;
  tags: string[];
};


//page for editing inventory
function AdminPortal() {
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [selectedShop, setSelectedShop] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(true);
  const [isLoadingShops, setIsLoadingShops] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [adminError, setAdminError] = useState<string>('');
  const [shopsError, setShopsError] = useState<string>('');
  const [productsError, setProductsError] = useState<string>('');
  const [saveError, setSaveError] = useState<string>('');

  const [productForm, setProductForm] = useState({
    title: '',
    price: '',
    description: '',
    imageUrls: [] as string[],
    isChangable: true,
    isUsed: false,
    tags: [] as string[],
  });

  useEffect(() => {
    async function fetchAdminInfo() {
      setAdminError('');
      setIsLoadingAdmin(true);
      try {
        const { data } = await fetchWithAuthToken('/api/user', 'POST', {});
        if (data.role === 'WEB_ADMIN' || data.role === 'STORE_ADMIN') {
          setAdminInfo({ role: data.role, authorizedStores: data.authorizedStores });
        } else {
          setAdminError('User is not an admin');
        }
      } catch (error) {
        setAdminError('Failed to fetch admin info');
        console.error('Error fetching admin info:', error);
      } finally {
        setIsLoadingAdmin(false);
      }
    }
    fetchAdminInfo();
  }, []);

  useEffect(() => {
    async function fetchShops() {
      if (!adminInfo) return;
      setShopsError('');
      setIsLoadingShops(true);
      try {
        const { data } = await fetchWithAuthToken('/api/shops', 'POST', {
          action: adminInfo.role === 'WEB_ADMIN' ? 'fetchAll' : 'fetchByIds',
          shopIds: adminInfo.authorizedStores,
        });
        setShops(data);
        if (data.length === 1) setSelectedShop(data[0].id);
      } catch (error) {
        setShopsError('Failed to fetch shops');
        console.error('Error fetching shops:', error);
      } finally {
        setIsLoadingShops(false);
      }
    }
    fetchShops();
  }, [adminInfo]);

  useEffect(() => {
    async function fetchProducts() {
      if (!selectedShop) return;
      setProductsError('');
      setIsLoadingProducts(true);
      try {
        const { data } = await fetchWithAuthToken('/api/products', 'POST', {
          action: 'fetch',
          shopId: selectedShop,
        });
        setProducts(data);
      } catch (error) {
        setProductsError('Failed to fetch products');
        console.error('Error fetching products:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    }
    fetchProducts();
  }, [selectedShop]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShop) return;
    setSaveError('');
    setIsSaving(true);
    try {
      const { data } = await fetchWithAuthToken('/api/products', 'POST', {
        action: 'add',
        ...productForm,
        shopId: selectedShop,
        price: parseFloat(productForm.price),
      });
      setProducts((prev) => [...prev, data]);
      setProductForm({
        title: '',
        price: '',
        description: '',
        imageUrls: [],
        isChangable: true,
        isUsed: false,
        tags: [],
      });
    } catch (error) {
      setSaveError('Failed to add product');
      console.error('Error adding product:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSaveError('');
    setIsSaving(true);
    try {
      const { data } = await fetchWithAuthToken('/api/products', 'POST', {
        action: 'update',
        id: editingProduct.id,
        ...productForm,
        price: parseFloat(productForm.price),
      });
      setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? data : p)));
      setEditingProduct(null);
      setProductForm({
        title: '',
        price: '',
        description: '',
        imageUrls: [],
        isChangable: true,
        isUsed: false,
        tags: [],
      });
    } catch (error) {
      setSaveError('Failed to update product');
      console.error('Error updating product:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setIsDeleting(productId);
    try {
      await fetchWithAuthToken('/api/products', 'POST', {
        action: 'delete',
        id: productId,
      });
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      if (editingProduct?.id === productId) {
        setEditingProduct(null);
        setProductForm({
          title: '',
          price: '',
          description: '',
          imageUrls: [],
          isChangable: true,
          isUsed: false,
          tags: [],
        });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      price: product.price.toString(),
      description: product.description,
      imageUrls: product.imageUrls,
      isChangable: product.isChangable,
      isUsed: product.isUsed,
      tags: product.tags || [],
    });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      price: '',
      description: '',
      imageUrls: [],
      isChangable: true,
      isUsed: false,
      tags: [],
    });
    setSaveError('');
  };

  if (isLoadingAdmin) {
    return <div className="flex justify-center items-center h-screen">Loading admin information...</div>;
  }

  if (adminError) {
    return <div className="p-4 text-red-600">Error: {adminError}</div>;
  }

  if (!adminInfo) {
    return <div className="p-4">Not authorized as admin</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Portal</h1>

      {adminInfo.role === 'WEB_ADMIN' && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Shop</label>
          {isLoadingShops ? (
            <div>Loading shops...</div>
          ) : shopsError ? (
            <div className="text-red-600">Error: {shopsError}</div>
          ) : (
            <>
              <select
                className="w-full p-2 border rounded"
                value={selectedShop}
                onChange={(e) => setSelectedShop(e.target.value)}
                disabled={isLoadingShops}
              >
                <option value="">Select a shop...</option>
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.name}
                  </option>
                ))}
              </select>
              {shops.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">No shops available</p>
              )}
            </>
          )}
        </div>
      )}

      {selectedShop && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          {saveError && (
            <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">{saveError}</div>
          )}
          <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={productForm.title}
                onChange={(e) => setProductForm((prev) => ({ ...prev, title: e.target.value }))}
                required
                disabled={isSaving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                step="0.01"
                className="w-full p-2 border rounded"
                value={productForm.price}
                onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
                required
                disabled={isSaving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full p-2 border rounded"
                value={productForm.description}
                onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                required
                disabled={isSaving}
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={productForm.isChangable}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, isChangable: e.target.checked }))}
                  className="mr-2"
                  disabled={isSaving}
                />
                Changeable
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={productForm.isUsed}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, isUsed: e.target.checked }))}
                  className="mr-2"
                  disabled={isSaving}
                />
                Used
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                disabled={isSaving}
              >
                {isSaving
                  ? editingProduct
                    ? 'Updating...'
                    : 'Adding...'
                  : editingProduct
                  ? 'Update Product'
                  : 'Add Product'}
              </button>
              {editingProduct && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  disabled={isSaving}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {selectedShop && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          {isLoadingProducts ? (
            <div>Loading products...</div>
          ) : productsError ? (
            <div className="text-red-600">Error: {productsError}</div>
          ) : products.length === 0 ? (
            <div className="text-gray-500">No products found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="border rounded p-4">
                  <h3 className="font-medium">{product.title}</h3>
                  <p className="text-gray-600">${product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500 truncate">{product.description}</p>
                  <div className="flex gap-2 mt-2">
                    {product.isChangable && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Changeable</span>
                    )}
                    {product.isUsed && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Used</span>
                    )}
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="text-blue-500 hover:text-blue-600 disabled:text-gray-400"
                      disabled={isDeleting === product.id || isSaving}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:text-red-600 disabled:text-gray-400"
                      disabled={isDeleting === product.id || isSaving}
                    >
                      {isDeleting === product.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { AdminPortal };


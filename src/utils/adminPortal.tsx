import React, { useState, useEffect } from 'react';

declare const auth: any;

type AdminRole = 'STORE_ADMIN' | 'WEB_ADMIN';
type AdminInfo = {
  role: AdminRole;
  authorizedStores?: string[];
};

type Shop = {
  id: string;
  name: string;
  imageUrl: string | null;
  introduce: string | null;
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

type StoreAdmin = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
};

function AdminPortal() {
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [selectedShop, setSelectedShop] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [storeAdmins, setStoreAdmins] = useState<StoreAdmin[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);

  const [isLoadingAdmin, setIsLoadingAdmin] = useState(true);
  const [isLoadingShops, setIsLoadingShops] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [adminError, setAdminError] = useState<string>('');
  const [shopsError, setShopsError] = useState<string>('');
  const [productsError, setProductsError] = useState<string>('');
  const [adminsError, setAdminsError] = useState<string>('');
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

  const [shopForm, setShopForm] = useState({
    name: '',
    imageUrl: '',
    introduce: '',
  });

  const [adminForm, setAdminForm] = useState({
    email: '',
    shopId: '',
  });

  useEffect(() => {
    async function fetchAdminInfo() {
      setAdminError('');
      setIsLoadingAdmin(true);
      try {
        const user = auth.currentUser;
        if (!user) {
          setAdminError('No user logged in');
          return;
        }

        const token = await user.getIdToken();
        const response = await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch admin info');
        }

        const userData = await response.json();
        if (userData.role === 'WEB_ADMIN' || userData.role === 'STORE_ADMIN') {
          setAdminInfo({
            role: userData.role,
            authorizedStores: userData.authorizedStores
          });
        } else {
          setAdminError('User is not an admin');
        }
      } catch (error) {
        setAdminError(error instanceof Error ? error.message : 'Unknown error occurred');
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
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');

        const token = await user.getIdToken();
        const response = await fetch('/api/shops', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ 
            action: 'fetch',
            stores: adminInfo.authorizedStores 
          })
        });

        if (!response.ok) throw new Error('Failed to fetch shops');
        
        const data = await response.json();
        setShops(data.data);
        
        if (adminInfo.role === 'STORE_ADMIN' && data.data.length === 1) {
          setSelectedShop(data.data[0].id);
        }
      } catch (error) {
        setShopsError(error instanceof Error ? error.message : 'Failed to load shops');
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
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');

        const token = await user.getIdToken();
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ shopId: selectedShop })
        });

        if (!response.ok) throw new Error('Failed to fetch products');

        const data = await response.json();
        setProducts(data.data);
      } catch (error) {
        setProductsError(error instanceof Error ? error.message : 'Failed to load products');
      } finally {
        setIsLoadingProducts(false);
      }
    }

    fetchProducts();
  }, [selectedShop]);

  useEffect(() => {
    async function fetchStoreAdmins() {
      if (adminInfo?.role !== 'WEB_ADMIN' || !selectedShop) return;

      setAdminsError('');
      setIsLoadingAdmins(true);

      try {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');

        const token = await user.getIdToken();
        const response = await fetch('/api/admins', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ shopId: selectedShop })
        });

        if (!response.ok) throw new Error('Failed to fetch admins');

        const data = await response.json();
        setStoreAdmins(data.data);
      } catch (error) {
        setAdminsError(error instanceof Error ? error.message : 'Failed to load admins');
      } finally {
        setIsLoadingAdmins(false);
      }
    }

    fetchStoreAdmins();
  }, [adminInfo, selectedShop]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShop) return;

    setSaveError('');
    setIsSaving(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      const token = await user.getIdToken();
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'create',
          ...productForm,
          shopId: selectedShop,
          price: parseFloat(productForm.price as string)
        })
      });

      if (!response.ok) throw new Error('Failed to add product');

      const newData = await response.json();
      setProducts(prev => [...prev, newData.data]);
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
      setSaveError(error instanceof Error ? error.message : 'Failed to save product');
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
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      const token = await user.getIdToken();
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'update',
          id: editingProduct.id,
          ...productForm,
          price: parseFloat(productForm.price as string)
        })
      });

      if (!response.ok) throw new Error('Failed to update product');

      const updatedData = await response.json();
      setProducts(prev => 
        prev.map(p => p.id === editingProduct.id ? updatedData.data : p)
      );
      
      setProductForm({
        title: '',
        price: '',
        description: '',
        imageUrls: [],
        isChangable: true,
        isUsed: false,
        tags: [],
      });
      setEditingProduct(null);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to update product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminInfo?.role !== 'WEB_ADMIN') return;

    setSaveError('');
    setIsSaving(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      const token = await user.getIdToken();
      const response = await fetch('/api/shops', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'create',
          ...shopForm
        })
      });

      if (!response.ok) throw new Error('Failed to add shop');

      const newData = await response.json();
      setShops(prev => [...prev, newData.data]);
      setShopForm({
        name: '',
        imageUrl: '',
        introduce: '',
      });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save shop');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddStoreAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminInfo?.role !== 'WEB_ADMIN' || !selectedShop) return;

    setSaveError('');
    setIsSaving(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      const token = await user.getIdToken();
      const response = await fetch('/api/admins', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'create',
          email: adminForm.email,
          shopId: selectedShop
        })
      });

      if (!response.ok) throw new Error('Failed to add store admin');

      const newData = await response.json();
      setStoreAdmins(prev => [...prev, newData.data]);
      setAdminForm({
        email: '',
        shopId: '',
      });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to add store admin');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setIsDeleting(productId);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      const token = await user.getIdToken();
      const response = await fetch(`/api/products?id=${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete product');

      setProducts(prev => prev.filter(p => p.id !== productId));

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

  const handleDeleteStoreAdmin = async (adminId: string) => {
    if (!confirm('Are you sure you want to remove this admin?')) return;

    setIsDeleting(adminId);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      const token = await user.getIdToken();
      const response = await fetch(`/api/admins?id=${adminId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to remove admin');

      setStoreAdmins(prev => prev.filter(a => a.id !== adminId));
    } catch (error) {
      console.error('Error removing admin:', error);
      alert('Failed to remove admin');
    } finally {
      setIsDeleting(null);
    }
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
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Shop</h2>
          <form onSubmit={handleAddShop} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Shop Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={shopForm.name}
                onChange={(e) => setShopForm(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                required
                disabled={isSaving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                type="text"
		 className="w-full p-2 border rounded"
                value={shopForm.imageUrl}
                onChange={(e) => setShopForm(prev => ({
                  ...prev,
                  imageUrl: e.target.value
                }))}
                disabled={isSaving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Introduction</label>
              <textarea
                className="w-full p-2 border rounded"
                value={shopForm.introduce}
                onChange={(e) => setShopForm(prev => ({
                  ...prev,
                  introduce: e.target.value
                }))}
                disabled={isSaving}
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
              disabled={isSaving}
            >
              {isSaving ? 'Adding Shop...' : 'Add Shop'}
            </button>
          </form>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Shop</label>
        {isLoadingShops ? (
          <div>Loading shops...</div>
        ) : shopsError ? (
          <div className="text-red-600">Error: {shopsError}</div>
        ) : (
          <select
            className="w-full p-2 border rounded"
            value={selectedShop}
            onChange={(e) => setSelectedShop(e.target.value)}
            disabled={isLoadingShops}
          >
            <option value="">Select a shop...</option>
            {shops.map(shop => (
              <option key={shop.id} value={shop.id}>
                {shop.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedShop && adminInfo.role === 'WEB_ADMIN' && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Manage Store Admins</h2>
          <form onSubmit={handleAddStoreAdmin} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Admin Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                value={adminForm.email}
                onChange={(e) => setAdminForm(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
                required
                disabled={isSaving}
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
              disabled={isSaving}
            >
              {isSaving ? 'Adding Admin...' : 'Add Store Admin'}
            </button>
          </form>

          {isLoadingAdmins ? (
            <div>Loading admins...</div>
          ) : adminsError ? (
            <div className="text-red-600">Error: {adminsError}</div>
          ) : (
            <div className="space-y-2">
              {storeAdmins.map(admin => (
                <div key={admin.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <div className="font-medium">{admin.name}</div>
                    <div className="text-sm text-gray-500">{admin.email}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteStoreAdmin(admin.id)}
                    className="text-red-500 hover:text-red-600 disabled:text-gray-400"
                    disabled={isDeleting === admin.id}
                  >
                    {isDeleting === admin.id ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedShop && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={productForm.title}
                onChange={(e) => setProductForm(prev => ({
                  ...prev,
                  title: e.target.value
                }))}
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
                onChange={(e) => setProductForm(prev => ({
                  ...prev,
                  price: e.target.value
                }))}
                required
                disabled={isSaving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full p-2 border rounded"
                value={productForm.description}
                onChange={(e) => setProductForm(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
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
                  onChange={(e) => setProductForm(prev => ({
                    ...prev,
                    isChangable: e.target.checked
                  }))}
                  className="mr-2"
                  disabled={isSaving}
                />
                Changeable
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={productForm.isUsed}
                  onChange={(e) => setProductForm(prev => ({
                    ...prev,
                    isUsed: e.target.checked
                  }))}
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
                  ? (editingProduct ? 'Updating...' : 'Adding...') 
                  : (editingProduct ? 'Update Product' : 'Add Product')}
              </button>
              {editingProduct && (
                <button
                  type="button"
                  onClick={() => {
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
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  disabled={isSaving}
                >
                  Cancel
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
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Changeable
                      </span>
                    )}
                    {product.isUsed && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Used
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setProductForm({
                          title: product.title,
                          price: product.price.toString(),
                          description: product.description,
                          imageUrls: product.imageUrls,
                          isChangable: product.isChangable,
                          isUsed: product.isUsed,
                          tags: product.tags,
                        });
                      }}
                      className="text-blue-500 hover:text-blue-600 disabled:text-gray-400"
                      disabled={isDeleting === product.id || isSaving}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
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

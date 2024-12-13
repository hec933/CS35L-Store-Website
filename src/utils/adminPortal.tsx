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
   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
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

     const handleFormChange = (field: keyof typeof productForm, value: any) => {
       setProductForm((prev) => {
           const updatedForm = { ...prev, [field]: value };
           const currentProduct = products.find((p) => p.id === selectedProduct);
           const hasChanges = currentProduct
               ? Object.keys(updatedForm).some(
                     (key) =>
                         updatedForm[key as keyof typeof productForm] !==
                         currentProduct[key as keyof Product]
                 )
               : true;

           setHasUnsavedChanges(hasChanges);
           return updatedForm;
       });
   };

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

            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Failed to fetch products. Please try again.');
        }
    }

    fetchProducts();
}, [selectedShop]); 

    const handleProductSelect = (productId: string) => {
       if (hasUnsavedChanges) {
           if (!confirm('You have unsaved changes. Do you want to discard them?')) {
               return; 
           }
       }

       const selected = products.find((p) => p.id === productId);
       if (!selected) return;

       setProductForm({
           title: selected.title,
           price: selected.price.toString(),
           address: selected.address,
           description: selected.description,
           imageUrls: selected.imageUrls,
           newImageUrl: '',
           isChangable: selected.isChangable,
           isUsed: selected.isUsed,
           tags: selected.tags || [''],
       });

       setSelectedProduct(productId);
       setHasUnsavedChanges(false);
   };


   const handleAddImageUrl = async () => {
       if (!productForm.newImageUrl) return;
       try {
       	   //TODO implement a rigorous back end url check
           //const response = await fetchWithAuthToken('/api/validate-url', 'POST', {
           //    url: productForm.newImageUrl,
           //});
           //if (response?.isValid) {
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
           setShops((prev) => [...prev, response.data]);
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
               price: '19.99',
               address: 'United States',
               description: '',
               imageUrls: [],
               newImageUrl: '',
               isChangable: true,
               isUsed: false,
               tags: [''],
           });
           setProducts((prev) => [...prev, response.data]);
       } catch (error) {
           console.error('Error adding product:', error);
           alert('Failed to add product');
       } finally {
           setIsSaving(false);
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
                   {formType === 'product' ? 'Add Store' : 'Back to Product Form'}
               </Button>
           </div>
	 </div>

           {formType === 'store' ? (
               <div className="mb-8">
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
                   <form onSubmit={handleAddProduct} className="space-y-4">
                       <div>
                           <label className="block text-sm font-medium mb-1">Shop</label>
                           <select
                               className="w-full p-2 border rounded"
                               value={selectedShop}
                               onChange={(e) => setSelectedShop(e.target.value)}
                           >
                               <option value="" disabled>
                                   ...
                               </option>
                               {shops.map((shop) => (
                                   <option key={shop.id} value={shop.id}>
                                       {shop.name}
                                   </option>
                               ))}
                           </select>
                       </div>
		       <div>
    <label className="block text-sm font-medium mb-1">Product</label>
    <input
        list="product-options"
        className="w-full p-2 border rounded"
        value={productForm.title}
        onChange={(e) => handleFormChange('title', e.target.value)}
        onSelect={(e) => handleProductSelect((e.target as HTMLInputElement).value)}
    />
    <datalist id="product-options">
        <option value="" label="Add a new product" />
        {products.map((product) => (
            <option key={product.id} value={product.id}>
                {product.title}
            </option>
        ))}
    </datalist>
</div>

		       <div>
                           <label className="block text-sm font-medium mb-1">
                               Price ({currencySymbol})
                           </label>
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
                           <label className="block text-sm font-medium mb-1">Country</label>
                           <select
                               className="w-full p-2 border rounded"
                               value={productForm.address}
                               onChange={(e) =>
                                   setProductForm((prev) => ({ ...prev, address: e.target.value }))
                               }
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
                               onChange={(e) =>
                                   setProductForm((prev) => ({ ...prev, description: e.target.value }))
                               }
                               rows={4}
                           />
                       </div>
                       <div className="flex items-center">
                           <input
                               type="text"
                               className="w-full p-2 border rounded mr-2"
                               placeholder="Image URL"
                               value={productForm.newImageUrl}
                               onChange={(e) =>
                                   setProductForm((prev) => ({
                                       ...prev,
                                       newImageUrl: e.target.value,
                                   }))
                               }
                           />
                           <Button
                               color={isUrlValid === null ? "uclaBlue" : isUrlValid ? "uclaGold" : "red"}
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
                               {productForm.imageUrls.map((url, index) => (
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
                                   onChange={(e) =>
                                       setProductForm((prev) => ({
                                           ...prev,
                                           isChangable: e.target.checked,
                                       }))
                                   }
                               />
                               Can be returned
                           </label>
                           <label className="block text-sm font-medium mb-1">
                               <input
                                   type="checkbox"
                                   className="mr-2"
                                   checked={productForm.isUsed}
                                   onChange={(e) =>
                                       setProductForm((prev) => ({
                                           ...prev,
                                           isUsed: e.target.checked,
                                       }))
                                   }
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

export default AdminPortal;
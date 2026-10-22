import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setBrand(data.brand);
        setCategory(data.category);
        setStock(data.stock);
        setDescription(data.description);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch product');
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await api.put(`/products/${id}`, {
        name,
        price,
        image,
        brand,
        category,
        stock,
        description,
      });
      setIsUpdating(false);
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
      setIsUpdating(false);
    }
  };

  const uploadFileHandler = async (e) => {
    // Basic image upload simulation or real implementation
    // For now, since we might not have multer setup perfectly, let user type URL or simulate
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      // Assuming you have an upload route like POST /api/upload
      const { data } = await api.post('/upload', formData, config);
      setImage(data);
    } catch (err) {
      console.error(err);
      alert('Upload not configured yet, just type URL');
    }
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div>
      <Link to="/admin/products" className="text-brand-dark hover:text-brand-orange font-medium mb-6 inline-block">
        <i className="fas fa-arrow-left mr-2"></i> Go Back
      </Link>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Product</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                id="price"
                type="number"
                required
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
              />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                id="stock"
                type="number"
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
              />
            </div>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <div className="flex gap-2">
              <input
                id="image"
                type="text"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
              />
              <input type="file" id="image-file" onChange={uploadFileHandler} className="hidden" />
              <label htmlFor="image-file" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-200 border border-gray-300 whitespace-nowrap focus-within:ring-2 focus-within:ring-brand-orange">
                Upload File
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input
                id="brand"
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                id="category"
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              required
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="w-full bg-brand-orange text-white font-bold py-3 rounded-md hover:bg-orange-600 transition-colors"
          >
            {isUpdating ? 'Updating...' : 'Update Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductEdit;

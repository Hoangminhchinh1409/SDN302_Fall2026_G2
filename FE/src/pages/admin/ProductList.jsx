import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import useProductStore from '../../store/useProductStore';

const ProductList = () => {
  const { products, fetchProducts, isLoading, error, page, pages, totalCount } = useProductStore();
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState('name');
  const [searchInput, setSearchInput] = useState('');
  
  const [category, setCategory] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  
  const [brand, setBrand] = useState('');
  const [brandInput, setBrandInput] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts({
      pageNumber: currentPage,
      keyword: keyword,
      sort: sort,
      category: category,
      brand: brand,
      pageSize: 12
    });
  }, [fetchProducts, currentPage, keyword, sort, category, brand]);
  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setDeleteLoading(true);
      try {
        await api.delete(`/products/${id}`);
        fetchProducts(); // Refresh list
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting product');
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(searchInput);
    setCategory(categoryInput);
    setBrand(brandInput);
    setCurrentPage(1);
  };

  const createProductHandler = () => {
    navigate('/admin/product/new');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Products</h2>
        <button 
          onClick={createProductHandler}
          className="bg-brand-orange text-white px-4 py-2 rounded-md font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          <i className="fas fa-plus"></i> Create Product
        </button>
      </div>

      {/* Filter and Sort Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row w-full md:w-auto gap-2">
          <input 
            type="text" 
            placeholder="Search name..." 
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-orange w-full md:w-48 text-sm"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Search category..." 
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-orange w-full md:w-40 text-sm"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Search brand..." 
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-orange w-full md:w-40 text-sm"
            value={brandInput}
            onChange={(e) => setBrandInput(e.target.value)}
          />
          <button type="submit" className="bg-brand-gray text-brand-dark px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-200">
            <i className="fas fa-search"></i>
          </button>
        </form>

        <select 
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-brand-orange w-full md:w-auto cursor-pointer text-sm"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="name">Sort by Name (A-Z)</option>
          <option value="latest">Sort by Latest</option>
          <option value="price">Sort by Price: Low to High</option>
          <option value="popularity">Sort by Popularity</option>
        </select>
      </div>

      {isLoading || deleteLoading ? (
        <div className="text-center py-10">Loading products...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
                  <th className="p-4 font-medium">STT</th>
                  <th className="p-4 font-medium">NAME</th>
                  <th className="p-4 font-medium">PRICE</th>
                  <th className="p-4 font-medium">CATEGORY</th>
                  <th className="p-4 font-medium">BRAND</th>
                  <th className="p-4 font-medium text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {products.map((product, index) => (
                  <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 text-gray-500">{(currentPage - 1) * 12 + index + 1}</td>
                    <td className="p-4 font-medium text-brand-dark">{product.name}</td>
                    <td className="p-4">${product.price.toFixed(2)}</td>
                    <td className="p-4">{product.category?.name || product.category}</td>
                    <td className="p-4">{product.brand?.name || product.brand}</td>
                    <td className="p-4 text-right space-x-2">
                      <Link 
                        to={`/admin/product/${product._id}/edit`}
                        className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded hover:bg-gray-200 transition-colors inline-block"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                      <button 
                        onClick={() => deleteHandler(product._id)}
                        className="bg-red-50 text-red-500 px-3 py-1.5 rounded hover:bg-red-100 transition-colors"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && pages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{(currentPage - 1) * 12 + 1}</span> to <span className="font-medium">{Math.min(currentPage * 12, totalCount)}</span> of <span className="font-medium">{totalCount}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${currentPage === 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              Previous
            </button>
            <div className="flex gap-1">
              {[...Array(pages).keys()].map(x => (
                <button
                  key={x + 1}
                  onClick={() => setCurrentPage(x + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${currentPage === x + 1 ? 'bg-brand-orange text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {x + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === pages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pages))}
              className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${currentPage === pages ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;

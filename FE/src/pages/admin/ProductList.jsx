import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import useProductStore from '../../store/useProductStore';
import useAuthStore from '../../store/useAuthStore';

const ProductList = () => {
  const { products, fetchProducts, isLoading, error, page, pages, totalCount } = useProductStore();
  const { user } = useAuthStore();
  const isStaff = user?.role === 'staff';

  const [searchParams, setSearchParams] = useSearchParams();
  const stockFilter = searchParams.get('filter') || 'all';

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState('name');
  const [searchInput, setSearchInput] = useState('');

  const [category, setCategory] = useState('');
  const [categoryInput, setCategoryInput] = useState('');

  const [brand, setBrand] = useState('');
  const [brandInput, setBrandInput] = useState('');

  const [stockDrafts, setStockDrafts] = useState({});
  const [savingStockId, setSavingStockId] = useState(null);
  const [stockMessage, setStockMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts({
      pageNumber: currentPage,
      keyword: keyword,
      sort: sort,
      category: category,
      brand: brand,
      stockFilter: stockFilter !== 'all' ? stockFilter : undefined,
      pageSize: 12,
    });
  }, [fetchProducts, currentPage, keyword, sort, category, brand, stockFilter]);

  const handleStockUpdate = async (productId) => {
    const currentProduct = products.find((p) => p._id === productId);
    const newStock =
      stockDrafts[productId] !== undefined
        ? stockDrafts[productId]
        : currentProduct?.stock;

    if (
      newStock === undefined ||
      newStock === '' ||
      isNaN(newStock) ||
      !Number.isInteger(Number(newStock)) ||
      Number(newStock) < 0
    ) {
      alert('Vui lòng nhập số lượng nguyên hợp lệ (>= 0)');
      return;
    }

    setSavingStockId(productId);
    setStockMessage(null);
    try {
      await api.patch(`/products/${productId}/stock`, { stock: Number(newStock) });
      fetchProducts({
        pageNumber: currentPage,
        keyword: keyword,
        sort: sort,
        category: category,
        brand: brand,
        stockFilter: stockFilter !== 'all' ? stockFilter : undefined,
        pageSize: 12,
      });
      setStockMessage({ type: 'success', text: 'Cập nhật tồn kho thành công!' });
      setTimeout(() => setStockMessage(null), 3000);
    } catch (err) {
      setStockMessage({
        type: 'error',
        text: err.response?.data?.message || 'Cập nhật tồn kho thất bại',
      });
    } finally {
      setSavingStockId(null);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setDeleteLoading(true);
      try {
        await api.delete(`/products/${id}`);
        fetchProducts({
          pageNumber: currentPage,
          keyword: keyword,
          sort: sort,
          category: category,
          brand: brand,
          stockFilter: stockFilter !== 'all' ? stockFilter : undefined,
          pageSize: 12,
        });
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

  const displayedProducts = products;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isStaff ? 'Quản lý tồn kho (Inventory)' : 'Products Management'}
          </h2>
          <p className="text-sm text-gray-500">
            {isStaff
              ? 'Theo dõi số lượng hàng hóa và điều chỉnh tồn kho tức thì.'
              : 'Quản lý sản phẩm, giá bán và danh mục.'}
          </p>
        </div>

        {!isStaff && (
          <button
            onClick={createProductHandler}
            className="bg-brand-orange text-white px-4 py-2 rounded-md font-medium hover:bg-orange-600 transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <i className="fas fa-plus"></i> Create Product
          </button>
        )}
      </div>

      {stockMessage && (
        <div
          className={`p-3 rounded-lg text-xs font-semibold mb-4 ${
            stockMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {stockMessage.text}
        </div>
      )}

      {/* Filter and Sort Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="flex flex-wrap w-full md:w-auto gap-2">
            <input
              type="text"
              placeholder="Search name..."
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-orange w-full sm:w-44 text-sm"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <input
              type="text"
              placeholder="Category..."
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-orange w-full sm:w-36 text-sm"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
            />
            <input
              type="text"
              placeholder="Brand..."
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-orange w-full sm:w-36 text-sm"
              value={brandInput}
              onChange={(e) => setBrandInput(e.target.value)}
            />
            <button
              type="submit"
              className="bg-brand-gray text-brand-dark px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-200"
            >
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

        {/* Stock Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
          <span className="text-xs font-semibold text-gray-500 mr-1">Lọc kho:</span>
          <button
            onClick={() => {
              searchParams.delete('filter');
              setSearchParams(searchParams);
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              stockFilter === 'all'
                ? 'bg-brand-orange text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => {
              setSearchParams({ filter: 'low' });
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              stockFilter === 'low'
                ? 'bg-amber-500 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Sắp hết hàng (≤ 5)
          </button>
          <button
            onClick={() => {
              setSearchParams({ filter: 'out' });
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              stockFilter === 'out'
                ? 'bg-red-500 text-white'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            Hết hàng (0)
          </button>
        </div>
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
                <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="p-4 font-bold">STT</th>
                  <th className="p-4 font-bold">SẢN PHẨM</th>
                  <th className="p-4 font-bold">GIÁ</th>
                  <th className="p-4 font-bold">DANH MỤC</th>
                  <th className="p-4 font-bold">TỒN KHO</th>
                  <th className="p-4 font-bold">ĐIỀU CHỈNH KHO</th>
                  <th className="p-4 font-bold text-right">
                    {isStaff ? 'THAO TÁC' : 'ACTIONS'}
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {displayedProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-400">
                      Không tìm thấy sản phẩm nào.
                    </td>
                  </tr>
                ) : (
                  displayedProducts.map((product, index) => {
                    const stock = product.stock ?? 0;
                    return (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="p-4 text-gray-500">{(currentPage - 1) * 12 + index + 1}</td>
                        <td className="p-4">
                          <div className="font-semibold text-brand-dark">{product.name}</div>
                          <div className="text-xs text-gray-400">{product.brand?.name || product.brand}</div>
                        </td>
                        <td className="p-4 font-medium">${product.price.toFixed(2)}</td>
                        <td className="p-4 text-gray-600">{product.category?.name || product.category}</td>
                        <td className="p-4">
                          {stock === 0 ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                              Hết hàng (0)
                            </span>
                          ) : stock <= 5 ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                              Sắp hết ({stock})
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                              Còn {stock} sp
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="0"
                              placeholder={String(stock)}
                              value={
                                stockDrafts[product._id] !== undefined
                                  ? stockDrafts[product._id]
                                  : stock
                              }
                              onChange={(e) =>
                                setStockDrafts((prev) => ({
                                  ...prev,
                                  [product._id]: e.target.value,
                                }))
                              }
                              className="w-20 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-brand-orange"
                            />
                            <button
                              onClick={() => handleStockUpdate(product._id)}
                              disabled={savingStockId === product._id}
                              className="bg-brand-orange hover:bg-orange-600 text-white text-xs px-2.5 py-1 rounded font-semibold disabled:opacity-50"
                            >
                              {savingStockId === product._id ? '...' : 'Lưu'}
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {!isStaff ? (
                            <>
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
                            </>
                          ) : (
                            <Link
                              to={`/product/${product._id}`}
                              target="_blank"
                              className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded hover:bg-gray-200 text-xs font-medium inline-block"
                            >
                              Xem trang
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && pages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{(currentPage - 1) * 12 + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * 12, totalCount)}</span> of{' '}
            <span className="font-medium">{totalCount}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${
                currentPage === 1
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <div className="flex gap-1">
              {[...Array(pages).keys()].map((x) => (
                <button
                  key={x + 1}
                  onClick={() => setCurrentPage(x + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                    currentPage === x + 1
                      ? 'bg-brand-orange text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {x + 1}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === pages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pages))}
              className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${
                currentPage === pages
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
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

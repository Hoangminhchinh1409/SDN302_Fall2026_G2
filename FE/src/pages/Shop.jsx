import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useProductStore from '../store/useProductStore';
import useCartStore from '../store/useCartStore';

const Shop = () => {
  const { products, fetchProducts, isLoading, error, pages, page, totalCount } = useProductStore();
  const { addToCart } = useCartStore();

  const location = useLocation();
  const navigate = useNavigate();
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedPet, setSelectedPet] = useState(location.state?.selectedPet || '');
  const [keyword, setKeyword] = useState(location.state?.keyword || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('latest');
  const [maxPrice, setMaxPrice] = useState(100);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(100);

  useEffect(() => {
    fetchProducts({
      keyword: keyword,
      category: selectedCategories,
      brand: selectedBrands,
      tags: selectedTags,
      petType: selectedPet,
      pageNumber: currentPage,
      sort: sortBy,
      maxPrice: appliedMaxPrice,
    });
  }, [fetchProducts, keyword, selectedCategories, selectedBrands, selectedTags, selectedPet, currentPage, sortBy, appliedMaxPrice]);

  useEffect(() => {
    if (location.state?.keyword !== undefined) {
      setKeyword(location.state.keyword);
      setCurrentPage(1);
      
      // Clear keyword from state so it doesn't lock the local state
      const newState = { ...location.state };
      delete newState.keyword;
      navigate(location.pathname, { replace: true, state: newState });
    }
    
    if (location.state?.scrollToProducts) {
      setTimeout(() => {
        const el = document.getElementById('shop-main');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
      // Clear scroll state
      const newState = { ...location.state };
      delete newState.scrollToProducts;
      navigate(location.pathname, { replace: true, state: newState });
    }
  }, [location, navigate]);

  const handleCategoryChange = (cat) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    setCurrentPage(1);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
    setCurrentPage(1);
  };

  const handleTagChange = (tag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    setCurrentPage(1);
  };

  const handlePetChange = (pet) => {
    setSelectedPet(prev => prev === pet ? '' : pet);
    setCurrentPage(1);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-white pt-12 pb-16 px-4 md:px-12 lg:px-24 flex items-center justify-between overflow-hidden border-b border-gray-100">
        <div className="relative z-10 max-w-lg">
          <span className="text-brand-orange font-bold text-sm tracking-widest uppercase mb-2 block">Pet Shop</span>
          <h1 className="text-5xl font-extrabold text-brand-dark mb-4 leading-tight">The friendly and<br />caring small pet store</h1>
          <p className="text-brand-text mb-8">Explore our wide selection of premium pet products, carefully curated to ensure your furry friends lead a happy, healthy life.</p>
        </div>
        
        {/* Hero Graphics */}
        <div className="relative z-10 hidden md:block w-96 h-96">
          <div className="absolute inset-0 bg-brand-orange blob-shape opacity-90 transform translate-x-4"></div>
          <div className="absolute inset-4 bg-gray-200 blob-shape z-10 flex items-center justify-center overflow-hidden">
            <i className="fas fa-paw text-8xl text-gray-400"></i>
          </div>
          <i className="fas fa-dove absolute -top-8 left-10 text-4xl text-gray-300"></i>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-10 w-24 h-24 bg-brand-orange rounded-full opacity-80 blob-shape"></div>
        <div className="absolute bottom-10 left-1/3 w-16 h-16 bg-brand-orange rounded-full opacity-80 blob-shape"></div>
      </section>

      <main id="shop-main" className="py-16 px-4 md:px-12 lg:px-24 bg-white">
        
        {/* Shop by pet */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-brand-dark">Shop by pet</h2>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center hover:bg-brand-orange transition-colors"><i className="fas fa-chevron-left text-xs"></i></button>
              <button className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center hover:bg-brand-orange transition-colors"><i className="fas fa-chevron-right text-xs"></i></button>
            </div>
          </div>
          <div className="flex justify-between items-center overflow-x-auto pb-4 gap-6">
            {['Cat', 'Hamster', 'Dog', 'Parrot', 'Rabbit', 'Fish'].map((pet, index) => (
              <div key={pet} onClick={() => handlePetChange(pet)} className="flex flex-col items-center min-w-20 cursor-pointer group">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-3 transition-transform ${selectedPet === pet ? 'bg-brand-orange text-white border-4 border-brand-orange shadow-md' : 'bg-brand-gray text-gray-400 group-hover:bg-brand-orange group-hover:text-white'}`}>
                  <i className={`fas fa-${pet.toLowerCase() === 'rabbit' ? 'carrot' : pet.toLowerCase() === 'parrot' ? 'crow' : pet.toLowerCase() === 'hamster' ? 'paw' : pet.toLowerCase()}`}></i>
                </div>
                <span className={`font-medium text-sm ${selectedPet === pet ? 'text-brand-dark' : 'text-brand-dark group-hover:text-brand-orange'}`}>{pet}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            {/* Active Search */}
            {keyword && (
              <div className="mb-8">
                <h3 className="font-bold text-lg text-brand-dark mb-4">Active Search</h3>
                <div className="flex items-center gap-2">
                  <span className="bg-brand-orange text-white text-sm px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                    "{keyword}"
                    <button 
                      onClick={() => { setKeyword(''); setCurrentPage(1); }} 
                      className="hover:text-gray-200 ml-1 w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                    >
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </span>
                </div>
              </div>
            )}

            {/* Filter by categories */}
            <div className="mb-8">
              <h3 className="font-bold text-lg text-brand-dark mb-4">Filter by categories</h3>
              <ul className="space-y-2">
                {['Cat Food', 'Bowls', 'Clothes', 'Food', 'Toys', 'Beds'].map((cat, i) => (
                  <li key={cat} className="flex justify-between items-center text-sm text-brand-text">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand-orange focus:ring-brand-orange" checked={selectedCategories.includes(cat)} onChange={() => handleCategoryChange(cat)} />
                      {cat}
                    </label>
                    <span className="text-brand-orange font-medium">{/* Math.floor(Math.random() * 50 + 10) */}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Filter by Price */}
            <div className="mb-8">
              <h3 className="font-bold text-lg text-brand-dark mb-4">Filter by Price</h3>
              <div className="mb-4">
                 <input 
                   type="range" 
                   min="0" 
                   max="100" 
                   value={maxPrice} 
                   onChange={(e) => setMaxPrice(Number(e.target.value))}
                   className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                 />
              </div>
              <div className="flex justify-between items-center text-sm text-brand-text font-medium">
                <span>Price: $0 - ${maxPrice}</span>
                <button 
                  onClick={() => { setAppliedMaxPrice(maxPrice); setCurrentPage(1); }}
                  className="bg-brand-dark text-white px-3 py-1 text-xs rounded uppercase font-bold hover:bg-brand-orange"
                >
                  Filter
                </button>
              </div>
            </div>

            {/* Filter by brands */}
            <div className="mb-8">
              <h3 className="font-bold text-lg text-brand-dark mb-4">Filter by brands</h3>
              <ul className="space-y-2">
                {['Natural pet', 'Pet spa', 'Dogs food', 'Whiskas', 'Meow pet', 'Snack mix'].map((brand) => (
                  <li key={brand} className="flex justify-between items-center text-sm text-brand-text">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand-orange focus:ring-brand-orange" checked={selectedBrands.includes(brand)} onChange={() => handleBrandChange(brand)} />
                      {brand}
                    </label>
                    <span className="text-brand-orange font-medium">{/* Math.floor(Math.random() * 30 + 5) */}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Filter by tags */}
            <div className="mb-8">
              <h3 className="font-bold text-lg text-brand-dark mb-4">Filter by tags</h3>
              <div className="flex flex-wrap gap-2">
                {['Dog food', 'Cat food', 'Natural', 'Sweet', 'Small dog', 'Cat'].map((tag, i) => (
                  <span key={tag} onClick={() => handleTagChange(tag)} className={`text-xs px-3 py-1 rounded-md cursor-pointer border ${selectedTags.includes(tag) ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-brand-text border-gray-200 hover:border-brand-orange'}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Popular products */}
            <div>
              <h3 className="font-bold text-lg text-brand-dark mb-4">Popular products</h3>
              <div className="space-y-4">
                {products.slice(0, 4).map((item, idx) => (
                  <div key={item._id || idx} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-md shrink-0">
                      {item.image && item.image !== '/images/sample.jpg' && (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md" />
                      )}
                    </div>
                    <div>
                      <Link to={`/product/${item._id}`}>
                        <h4 className="text-sm font-bold text-brand-dark hover:text-brand-orange cursor-pointer line-clamp-1">{item.name}</h4>
                      </Link>
                      <div className="text-brand-orange text-[10px] mb-1">
                        <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star text-gray-300"></i>
                      </div>
                      <span className="text-xs text-brand-text">${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
              <p className="text-brand-text text-sm">Showing {(page - 1) * 12 + 1}-{Math.min(page * 12, totalCount || 0)} of {totalCount || 0} results</p>
              <select 
                className="bg-transparent border border-gray-200 text-brand-dark text-sm rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-orange cursor-pointer"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="latest">Sort by latest</option>
                <option value="price">Sort by price</option>
                <option value="popularity">Sort by popularity</option>
              </select>
            </div>

            {isLoading ? (
              <div className="text-center py-10">Loading products...</div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">{error}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Product Items */}
                {products.map((prod) => (
                  <div key={prod._id} className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col justify-between hover:border-gray-300 transition shadow-2xs">
                    <div>
                      <div className="w-full aspect-square bg-gray-50 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
                        {prod.image && prod.image !== '/images/sample.jpg' ? (
                          <img src={prod.image} alt={prod.name} className="w-full h-full object-contain p-2" />
                        ) : (
                          <i className="fas fa-box text-3xl text-gray-300"></i>
                        )}
                      </div>
                      <Link to={`/product/${prod._id}`}>
                        <h3 className="font-extrabold text-base text-brand-dark hover:text-brand-orange transition line-clamp-2 mb-1 cursor-pointer">
                          {prod.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-500 mb-3 font-medium">
                        {typeof prod.brand === 'object' ? prod.brand?.name : (prod.brand || 'Pet Shop')}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-lg font-black text-brand-dark">${prod.price.toFixed(2)}</span>
                      <button
                        type="button"
                        aria-label={`Add ${prod.name} to cart`}
                        onClick={() => addToCart(prod, 1)}
                        className="px-3.5 py-1.5 bg-gray-100 hover:bg-brand-orange hover:text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <i className="fas fa-plus text-[10px]"></i> Thêm
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-center mt-16 gap-2">
              {[...Array(pages || 1).keys()].map((p) => (
                <button 
                  key={p + 1}
                  onClick={() => setCurrentPage(p + 1)}
                  className={`w-8 h-8 rounded font-medium flex items-center justify-center text-sm transition-colors ${
                    p + 1 === page 
                      ? 'bg-brand-orange text-white font-bold' 
                      : 'border border-gray-200 text-brand-dark hover:bg-brand-orange hover:text-white hover:border-brand-orange'
                  }`}
                >
                  {p + 1}
                </button>
              ))}
            </div>

            {/* Bottom Service Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
              <div className="rounded-2xl bg-orange-50/60 border border-orange-200/80 p-6 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-orange block mb-1">Dịch vụ tại tiệm</span>
                  <h3 className="text-xl font-extrabold text-brand-dark mb-2">Spa & Grooming Thú Cưng</h3>
                  <p className="text-xs text-gray-600 leading-relaxed max-w-sm">
                    Tắm vệ sinh, cắt tỉa lông tạo kiểu chuyên nghiệp với giới hạn 3 thú cưng/ca để đảm bảo chăm sóc chu đáo nhất.
                  </p>
                </div>
                <div className="pt-4">
                  <Link to="/services" className="inline-block bg-brand-dark hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-lg transition">
                    Đặt lịch ngay →
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl bg-amber-50/50 border border-amber-200/80 p-6 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">Y tế dự phòng</span>
                  <h3 className="text-xl font-extrabold text-brand-dark mb-2">Sổ Tiêm Chủng Online</h3>
                  <p className="text-xs text-gray-600 leading-relaxed max-w-sm">
                    Lưu trữ lịch sử tiêm phòng, tự động nhắc hẹn mũi tiêm nhắc lại cho từng thú cưng của bạn.
                  </p>
                </div>
                <div className="pt-4">
                  <Link to="/pets" className="inline-block bg-brand-orange hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition">
                    Quản lý thú cưng →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Shop;

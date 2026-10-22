import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useProductStore from '../store/useProductStore';
import useCartStore from '../store/useCartStore';

const Home = () => {
  const { products, fetchProducts, isLoading, error } = useProductStore();
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 md:px-12 lg:px-24 flex flex-col md:flex-row items-center justify-between overflow-hidden bg-brand-light/40">
        <div className="absolute top-0 left-0 w-32 h-32 bg-brand-orange/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-10 w-16 h-16 bg-brand-orange rounded-full opacity-80 blob-shape"></div>
        <div className="absolute top-20 left-10 w-8 h-8 bg-brand-orange rounded-full opacity-80 blob-shape"></div>

        <div className="md:w-1/2 z-10 text-center md:text-left mb-12 md:mb-0">
          <span className="text-brand-orange font-semibold tracking-wider text-sm uppercase mb-2 block">Pet Shop</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            A pet store with<br />everything you need
          </h1>
          <p className="text-brand-text mb-8 max-w-md mx-auto md:mx-0">
            Find everything you need to keep your pets happy and healthy. From premium food and tasty treats to cozy beds and fun toys, we have it all.
          </p>
          <Link to="/shop" className="inline-block bg-brand-dark text-white font-medium py-3 px-8 rounded-full hover:bg-brand-orange transition-colors">
            Shop Now
          </Link>
        </div>

        <div className="md:w-1/2 relative flex justify-center items-center h-100">
          <div className="absolute w-87.5 h-87.5 md:w-112.5 md:h-112.5 bg-brand-orange blob-shape flex items-end justify-center overflow-hidden">
            <div className="w-full h-full bg-white/20 backdrop-blur-sm relative">
              <i className="fas fa-dog absolute bottom-10 left-20 text-9xl text-white opacity-80"></i>
              <i className="fas fa-cat absolute bottom-10 right-24 text-7xl text-white opacity-80"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Browse By Category */}
      <section className="py-16 px-4 md:px-12 lg:px-24 text-center">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold">Browse by category</h2>
          <div className="flex gap-2">
            <button aria-label="Previous category" className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center hover:bg-brand-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"><i className="fas fa-chevron-left text-xs" aria-hidden="true"></i></button>
            <button aria-label="Next category" className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center hover:bg-brand-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"><i className="fas fa-chevron-right text-xs" aria-hidden="true"></i></button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['Accessories', 'Food', 'Furniture', 'Bags'].map((cat, i) => (
             <div key={cat} className="group cursor-pointer">
              <div className="bg-gray-200 h-40 rounded-t-xl w-full overflow-hidden mb-0 relative">
                <div className={`w-full h-full bg-linear-to-br ${['from-purple-200 to-pink-200', 'from-green-200 to-emerald-200', 'from-blue-200 to-cyan-200', 'from-red-200 to-rose-200'][i]} group-hover:scale-105 transition-transform duration-500`}></div>
              </div>
              <div className="bg-brand-gray p-4 rounded-b-xl flex justify-between items-center border border-t-0 border-gray-100 group-hover:border-brand-orange/30 transition-colors">
                <div className="text-left">
                  <h3 className="font-semibold text-sm">{cat}</h3>
                  <p className="text-xs text-brand-text">{Math.floor(Math.random() * 50 + 10)} products</p>
                </div>
                <i className="fas fa-chevron-right text-brand-orange text-xs opacity-0 group-hover:opacity-100 transition-opacity"></i>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 md:px-12 lg:px-24">
        <h2 className="text-2xl font-bold text-center mb-10">Featured products</h2>
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {products.slice(0, 3).map((prod) => (
               <div key={prod._id} className="group">
                <div className="bg-brand-gray rounded-xl h-80 mb-4 flex items-center justify-center relative overflow-hidden transition-transform group-hover:scale-[1.02]">
                  {prod.image && prod.image !== '/images/sample.jpg' ? (
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-2/3 h-2/3 bg-gray-300 rounded-lg"></div>
                  )}
                  <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button 
                      aria-label={`Add ${prod.name} to cart`}
                      onClick={() => addToCart(prod, 1)}
                      className="bg-brand-orange text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-orange-600 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                    >
                      <i className="fas fa-cart-plus" aria-hidden="true"></i>
                    </button>
                    <Link 
                      to={`/product/${prod._id}`}
                      aria-label={`View details for ${prod.name}`}
                      className="bg-white text-brand-dark w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                    >
                      <i className="fas fa-eye" aria-hidden="true"></i>
                    </Link>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <Link to={`/product/${prod._id}`}>
                      <h3 className="font-bold text-brand-dark mb-1 group-hover:text-brand-orange transition-colors cursor-pointer">{prod.name}</h3>
                    </Link>
                    <p className="text-brand-text font-medium">${prod.price.toFixed(2)}</p>
                  </div>
                  <button className="text-gray-400 hover:text-brand-orange"><i className="far fa-heart"></i></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Banner Section */}
      <section className="my-16 bg-brand-light/30 py-16 px-4 md:px-12 lg:px-24 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 flex justify-center mb-10 md:mb-0 relative">
          <div className="w-75 h-75 bg-brand-orange rounded-full flex items-center justify-center relative blob-shape">
            <i className="fas fa-cat text-9xl text-white/80 absolute -bottom-4 left-10"></i>
            <i className="fas fa-cat text-8xl text-white/60 absolute bottom-4 right-12 scale-x-[-1]"></i>
          </div>
        </div>
        <div className="md:w-1/2 text-center md:text-left md:pl-12">
          <span className="text-brand-orange font-semibold uppercase text-sm mb-2 block">Pet Shop</span>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">The smarter way to shop<br />for your pet</h2>
          <p className="text-brand-text mb-8">
            Discover exclusive deals and high-quality accessories tailored for your beloved companions. Shop smarter and give your pets the best care possible.
          </p>
          <Link to="/shop" className="inline-block bg-brand-dark text-white font-medium py-3 px-8 rounded-md hover:bg-brand-orange transition-colors">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Best Selling Products */}
      <section className="py-16 px-4 md:px-12 lg:px-24">
        <h2 className="text-2xl font-bold text-center mb-10">Best selling products</h2>
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
             {products.slice(0, 8).map((prod, index) => (
              <div key={prod._id || index} className="group">
                <div className="bg-brand-gray rounded-xl h-56 mb-4 flex items-center justify-center relative overflow-hidden transition-transform group-hover:scale-[1.02]">
                  {prod.image && prod.image !== '/images/sample.jpg' ? (
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-1/2 h-1/2 bg-gray-300 ${index % 2 === 0 ? 'rounded-full' : 'rounded-lg'}`}></div>
                  )}
                  <div className="absolute bottom-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button 
                      aria-label={`Add ${prod.name} to cart`}
                      onClick={() => addToCart(prod, 1)}
                      className="bg-brand-orange text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-orange-600 shadow-md text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                    >
                      <i className="fas fa-cart-plus" aria-hidden="true"></i>
                    </button>
                    <Link 
                      to={`/product/${prod._id}`}
                      aria-label={`View details for ${prod.name}`}
                      className="bg-white text-brand-dark w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 shadow-md text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                    >
                      <i className="fas fa-eye" aria-hidden="true"></i>
                    </Link>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <Link to={`/product/${prod._id}`}>
                      <h3 className="font-bold text-brand-dark text-sm mb-1 group-hover:text-brand-orange cursor-pointer">{prod.name}</h3>
                    </Link>
                    <p className="text-brand-text text-sm font-medium">${prod.price.toFixed(2)}</p>
                  </div>
                  <button className="text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity text-sm"><i className="far fa-heart"></i></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Shop By Pet */}
      <section className="py-16 px-4 md:px-12 lg:px-24">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold">Shop by pet</h2>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center hover:bg-brand-orange transition-colors"><i className="fas fa-chevron-left text-xs"></i></button>
            <button className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center hover:bg-brand-orange transition-colors"><i className="fas fa-chevron-right text-xs"></i></button>
          </div>
        </div>
        <div className="flex justify-between items-center overflow-x-auto pb-4 gap-6">
          {['Cat', 'Hamster', 'Dog', 'Parrot', 'Rabbit', 'Fish'].map((pet, index) => (
            <div 
              key={pet} 
              onClick={() => navigate('/shop', { state: { selectedPet: pet, scrollToProducts: true } })} 
              className="flex flex-col items-center min-w-20 cursor-pointer group"
            >
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-3 transition-transform ${index === 0 ? 'bg-brand-orange text-white border-4 border-brand-orange shadow-md' : 'bg-brand-gray text-gray-400 group-hover:bg-brand-orange group-hover:text-white'}`}>
                <i className={`fas fa-${pet.toLowerCase() === 'rabbit' ? 'carrot' : pet.toLowerCase() === 'parrot' ? 'crow' : pet.toLowerCase() === 'hamster' ? 'paw' : pet.toLowerCase()}`}></i>
              </div>
              <span className={`font-medium text-sm ${index === 0 ? 'text-brand-dark' : 'text-brand-dark group-hover:text-brand-orange'}`}>{pet}</span>
            </div>
          ))}
        </div>
      </section>

      {/* News & Blog */}
      <section className="py-16 px-4 md:px-12 lg:px-24">
        <h2 className="text-2xl font-bold text-center mb-10">News & Blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[1, 2, 3].map((news) => (
            <div key={news} className="group cursor-pointer">
              <div className={`rounded-xl overflow-hidden mb-4 relative h-60 bg-linear-to-br ${news === 1 ? 'from-cyan-300 to-blue-400' : news === 2 ? 'from-yellow-300 to-orange-400' : 'from-orange-400 to-red-400'}`}>
                <div className="w-full h-full group-hover:scale-105 transition-transform duration-500 bg-white/20 backdrop-blur-sm"></div>
                <span className="absolute top-4 left-4 bg-brand-dark text-white text-xs font-bold px-3 py-1 rounded">News</span>
              </div>
              <p className="text-brand-text text-xs mb-2 font-medium">24 Nov 2024</p>
              <h3 className="font-bold text-brand-dark text-lg leading-tight group-hover:text-brand-orange transition-colors">
                {news === 1 ? 'Top 10 Essential Care Tips Every New Dog Owner Should Know' : news === 2 ? 'Choosing the Right Diet for Your Pet: A Comprehensive Guide' : 'Creating a Safe and Cozy Space for Your Indoor Cat'}
              </h3>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;

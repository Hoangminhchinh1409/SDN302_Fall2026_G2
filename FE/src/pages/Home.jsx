import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useProductStore from '../store/useProductStore';
import useCartStore from '../store/useCartStore';
import useLanguageStore from '../store/useLanguageStore';

const Home = () => {
  const { products, fetchProducts, isLoading, error } = useProductStore();
  const { addToCart } = useCartStore();
  const { t } = useLanguageStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = [
    { name: t('cat_food'), key: 'Food', count: t('cat_food_desc'), icon: 'fa-bone' },
    { name: t('cat_accessories'), key: 'Accessories', count: t('cat_accessories_desc'), icon: 'fa-baseball-ball' },
    { name: t('cat_furniture'), key: 'Furniture', count: t('cat_furniture_desc'), icon: 'fa-couch' },
    { name: t('cat_bags'), key: 'Bags', count: t('cat_bags_desc'), icon: 'fa-suitcase-rolling' },
  ];

  const petHeroPhoto = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1000&q=80';

  return (
    <div className="bg-white text-brand-dark">
      {/* 1. Hero Section: Clear, comfortable, readable typography */}
      <section className="px-4 md:px-12 lg:px-24 py-16 md:py-24 border-b border-gray-100 bg-[#fbf9f6]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-brand-orange text-sm font-bold mb-6">
              <span>{t('hero_badge')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.14] mb-6 text-brand-dark">
              {t('hero_title')}
            </h1>

            <p className="text-lg sm:text-xl text-gray-700 max-w-xl mb-8 leading-relaxed font-normal">
              {t('hero_desc')}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-9">
              <Link
                to="/shop"
                className="bg-brand-dark hover:bg-black text-white px-8 py-4 rounded-xl font-bold text-base transition shadow-sm focus-visible:ring-2 focus-visible:ring-brand-orange"
              >
                {t('shop_now')}
              </Link>
              <Link
                to="/services"
                className="bg-white hover:bg-gray-50 text-brand-dark border-2 border-gray-200 hover:border-gray-300 px-8 py-4 rounded-xl font-bold text-base transition focus-visible:ring-2 focus-visible:ring-brand-orange"
              >
                {t('book_service')}
              </Link>
            </div>

            {/* Pet quick filters */}
            <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-gray-200 text-sm text-gray-600">
              <span className="font-bold text-gray-800">{t('for_label')}</span>
              <button
                type="button"
                onClick={() => navigate('/shop', { state: { petType: 'Dog' } })}
                className="px-4 py-1.5 rounded-lg bg-white border border-gray-300 hover:border-brand-orange hover:text-brand-orange transition font-semibold text-sm shadow-2xs"
              >
                {t('for_dog')}
              </button>
              <button
                type="button"
                onClick={() => navigate('/shop', { state: { petType: 'Cat' } })}
                className="px-4 py-1.5 rounded-lg bg-white border border-gray-300 hover:border-brand-orange hover:text-brand-orange transition font-semibold text-sm shadow-2xs"
              >
                {t('for_cat')}
              </button>
              <Link
                to="/pets"
                className="px-4 py-1.5 rounded-lg bg-orange-50 text-brand-orange hover:bg-orange-100 transition font-bold text-sm ml-auto"
              >
                {t('add_pet_quick')}
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden bg-amber-50 shadow-md border-4 border-white">
              <img
                src={petHeroPhoto}
                alt="Chú cún cưng vui tươi tại Pet Shop"
                className="w-full h-full object-cover"
                loading="eager"
              />

              {/* Floating review badge */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-md border border-gray-100 flex items-center gap-2 text-sm font-bold text-brand-dark">
                <i className="fas fa-star text-amber-500"></i>
                <span>{t('rating_badge')}</span>
              </div>

              {/* Floating happy pet badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-gray-100 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-brand-orange flex items-center justify-center text-xl shrink-0">
                  <i className="fas fa-heart"></i>
                </div>
                <div>
                  <div className="font-extrabold text-sm text-brand-dark">{t('happy_pets_count')}</div>
                  <div className="text-xs text-gray-500 font-medium">{t('happy_pets_sub')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Danh mục thiết yếu: Larger text & comfortable cards */}
      <section className="px-4 md:px-12 lg:px-24 py-20 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{t('categories_title')}</h2>
              <p className="text-base text-gray-600 mt-2">{t('categories_sub')}</p>
            </div>
            <Link to="/shop" className="text-base font-bold text-brand-orange hover:underline flex items-center gap-1.5">
              {t('view_all_categories')} <i className="fas fa-arrow-right text-xs"></i>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.key}
                onClick={() => navigate('/shop', { state: { category: cat.key } })}
                className="bg-gray-50 hover:bg-orange-50/50 p-6 rounded-2xl border border-gray-200 hover:border-orange-300 transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 text-brand-orange flex items-center justify-center mb-5 text-lg shadow-2xs">
                    <i className={`fas ${cat.icon}`}></i>
                  </div>
                  <h3 className="font-extrabold text-lg mb-2 text-brand-dark">{cat.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-normal">{cat.count}</p>
                </div>
                <span className="text-sm font-bold text-brand-orange mt-6 flex items-center gap-1.5">
                  {t('explore')} <i className="fas fa-arrow-right text-xs"></i>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Dịch vụ Spa & Đặt lịch: Legible, high-contrast typography */}
      <section className="px-4 md:px-12 lg:px-24 py-20 bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {t('services_title')}
            </h2>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              {t('services_desc')}
            </p>
            <div className="space-y-3.5 pt-2 text-base font-medium text-gray-800">
              <div className="flex items-center gap-3">
                <i className="fas fa-check-circle text-brand-orange text-lg"></i>
                <span>{t('service_f1')}</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-check-circle text-brand-orange text-lg"></i>
                <span>{t('service_f2')}</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-check-circle text-brand-orange text-lg"></i>
                <span>{t('service_f3')}</span>
              </div>
            </div>
            <div className="pt-4">
              <Link
                to="/book-appointment"
                className="inline-block bg-brand-orange hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl text-base transition shadow-sm"
              >
                {t('book_now_btn')}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400 block mb-1.5">{t('pkg_basic_tag')}</span>
              <h3 className="font-extrabold text-xl mb-2 text-brand-dark">{t('pkg_basic_name')}</h3>
              <p className="text-sm text-gray-600 mb-5 leading-relaxed">{t('pkg_basic_desc')}</p>
              <div className="text-2xl font-black text-brand-dark">$15.00 <span className="text-sm text-gray-500 font-normal">/ 45 {t('mins')}</span></div>
            </div>
            <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400 block mb-1.5">{t('pkg_style_tag')}</span>
              <h3 className="font-extrabold text-xl mb-2 text-brand-dark">{t('pkg_style_name')}</h3>
              <p className="text-sm text-gray-600 mb-5 leading-relaxed">{t('pkg_style_desc')}</p>
              <div className="text-2xl font-black text-brand-dark">$25.00 <span className="text-sm text-gray-500 font-normal">/ 60 {t('mins')}</span></div>
            </div>
            <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400 block mb-1.5">{t('pkg_med_tag')}</span>
              <h3 className="font-extrabold text-xl mb-2 text-brand-dark">{t('pkg_med_name')}</h3>
              <p className="text-sm text-gray-600 mb-5 leading-relaxed">{t('pkg_med_desc')}</p>
              <div className="text-2xl font-black text-brand-dark">$20.00 <span className="text-sm text-gray-500 font-normal">/ 30 {t('mins')}</span></div>
            </div>
            <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400 block mb-1.5">{t('pkg_auto_tag')}</span>
                <h3 className="font-extrabold text-xl mb-2 text-brand-dark">{t('pkg_auto_name')}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{t('pkg_auto_desc')}</p>
              </div>
              <Link to="/pets" className="text-sm font-bold text-brand-orange hover:underline mt-5 flex items-center gap-1.5">
                {t('view_pets_record')} <i className="fas fa-arrow-right text-xs"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Sản phẩm nổi bật: Enhanced readability, clear prices */}
      <section className="px-4 md:px-12 lg:px-24 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{t('featured_title')}</h2>
              <p className="text-base text-gray-600 mt-2">{t('featured_sub')}</p>
            </div>
            <Link to="/shop" className="text-base font-bold text-brand-orange hover:underline flex items-center gap-1.5">
              {t('view_all_products')} <i className="fas fa-arrow-right text-xs"></i>
            </Link>
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-gray-400 text-lg">{t('loading_products')}</div>
          ) : error ? (
            <div className="py-12 text-center text-red-500 text-base">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((prod) => (
                <div key={prod._id} className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-between hover:border-gray-300 transition shadow-2xs">
                  <div>
                    <div className="w-full aspect-square bg-gray-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                      {prod.image && prod.image !== '/images/sample.jpg' ? (
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-contain p-2" />
                      ) : (
                        <i className="fas fa-box text-3xl text-gray-300"></i>
                      )}
                    </div>
                    <Link to={`/product/${prod._id}`}>
                      <h3 className="font-extrabold text-base text-brand-dark hover:text-brand-orange transition line-clamp-2 mb-1.5 leading-snug">
                        {prod.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mb-4 font-medium">
                      {typeof prod.brand === 'object' ? prod.brand?.name : (prod.brand || 'Pet Shop')}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-xl font-black text-brand-dark">${prod.price.toFixed(2)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(prod, 1)}
                      className="px-4 py-2 bg-gray-100 hover:bg-brand-orange hover:text-white rounded-xl text-sm font-bold transition flex items-center gap-1.5"
                    >
                      <i className="fas fa-plus text-xs"></i> {t('add_to_cart')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

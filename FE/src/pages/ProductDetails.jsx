import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useProductStore from '../store/useProductStore';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import api from '../api/axios';

const Rating = ({ value, text }) => {
  return (
    <div className="flex items-center gap-1 text-brand-orange text-sm">
      <span>
        <i className={value >= 1 ? 'fas fa-star' : value >= 0.5 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
      </span>
      <span>
        <i className={value >= 2 ? 'fas fa-star' : value >= 1.5 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
      </span>
      <span>
        <i className={value >= 3 ? 'fas fa-star' : value >= 2.5 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
      </span>
      <span>
        <i className={value >= 4 ? 'fas fa-star' : value >= 3.5 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
      </span>
      <span>
        <i className={value >= 5 ? 'fas fa-star' : value >= 4.5 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
      </span>
      {text && <span className="text-gray-500 ml-1 text-xs">{text}</span>}
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { product, fetchProductDetails, clearProductDetails, isLoading, error } = useProductStore();
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  useEffect(() => {
    fetchProductDetails(id);
    return () => clearProductDetails();
  }, [fetchProductDetails, clearProductDetails, id]);

  const addToCartHandler = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError(null);
    try {
      await api.post(`/products/${id}/reviews`, {
        rating,
        comment,
      });
      setReviewLoading(false);
      setRating(0);
      setComment('');
      fetchProductDetails(id); // refresh to show new review
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Error submitting review');
      setReviewLoading(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div className="py-16 px-4 md:px-12 lg:px-24 bg-white min-h-screen">
      <Link to="/shop" className="inline-block mb-8 text-brand-dark hover:text-brand-orange font-medium">
        <i className="fas fa-arrow-left mr-2"></i> Back to Shop
      </Link>

      <div className="flex flex-col md:flex-row gap-12 mb-16">
        <div className="md:w-1/2">
          <div className="bg-gray-100 rounded-2xl p-8 h-96 flex items-center justify-center border border-gray-200">
            {product.image && product.image !== '/images/sample.jpg' ? (
              <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain drop-shadow-xl rounded-xl" />
            ) : (
              <i className="fas fa-box-open text-6xl text-gray-400"></i>
            )}
          </div>
        </div>
        
        <div className="md:w-1/2">
          <h1 className="text-3xl font-extrabold text-brand-dark mb-2">{product.name}</h1>
          <div className="mb-4">
            <Rating value={product.rating} text={`${product.numReviews} reviews`} />
          </div>
          <p className="text-2xl font-bold text-brand-orange mb-6">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>
          
          <div className="border border-gray-200 rounded-xl p-6 mb-8 bg-gray-50">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
              <span className="font-semibold text-gray-700">Status:</span>
              <span className={`font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            
            {product.stock > 0 && (
              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold text-gray-700">Quantity:</span>
                <select 
                  className="border border-gray-300 rounded p-2 focus:ring-brand-orange outline-none w-24"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                >
                  {[...Array(product.stock > 10 ? 10 : product.stock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                  ))}
                </select>
              </div>
            )}
            
            <button
              onClick={addToCartHandler}
              disabled={product.stock === 0}
              className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${
                product.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-dark hover:bg-brand-orange'
              }`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="mt-16 max-w-4xl">
        <h2 className="text-2xl font-bold text-brand-dark mb-8 pb-4 border-b border-gray-200">Reviews</h2>
        
        {product.reviews.length === 0 ? (
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-gray-500 mb-8">
            No reviews yet. Be the first to review this product!
          </div>
        ) : (
          <div className="space-y-6 mb-12">
            {product.reviews.map((review) => (
              <div key={review._id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-800">{review.name}</h4>
                  <span className="text-xs text-gray-400">{review.createdAt.substring(0, 10)}</span>
                </div>
                <div className="mb-3">
                  <Rating value={review.rating} />
                </div>
                <p className="text-gray-600 text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
          <h3 className="text-xl font-bold text-brand-dark mb-6">Write a Customer Review</h3>
          {reviewError && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{reviewError}</div>}
          
          {user ? (
            <form onSubmit={submitReviewHandler} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <select
                  required
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange outline-none"
                >
                  <option value="">Select...</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                <textarea
                  required
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange outline-none resize-none"
                ></textarea>
              </div>
              <button
                disabled={reviewLoading}
                type="submit"
                className="bg-brand-orange text-white font-bold py-2 px-6 rounded-md hover:bg-orange-600 transition-colors"
              >
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <p className="text-gray-600">
              Please <Link to={`/login?redirect=/product/${id}`} className="text-brand-orange hover:underline font-medium">sign in</Link> to write a review.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

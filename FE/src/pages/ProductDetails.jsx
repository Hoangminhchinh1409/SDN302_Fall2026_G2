import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useProductStore from '../store/useProductStore';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import api from '../api/axios';

const Rating = ({ value = 0, text }) => {
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
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);

  // Eligibility & Edit mode
  const [eligibility, setEligibility] = useState({ hasReviewed: false, isVerifiedPurchase: false });
  const [editingReviewId, setEditingReviewId] = useState(null);

  const fetchReviewsData = useCallback(async () => {
    setReviewsLoading(true);
    setReviews([]);
    try {
      const { data } = await api.get(`/reviews/product/${id}`);
      setReviews(data || []);
    } catch (err) {
      // Fallback to product.reviews
      const embeddedReviews = useProductStore.getState().product?.reviews;
      setReviews(Array.isArray(embeddedReviews) ? embeddedReviews : []);
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  const checkUserEligibility = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await api.get(`/reviews/check-eligibility/${id}`);
      setEligibility(data);
      if (data.myReview) {
        setRating(data.myReview.rating);
        setComment(data.myReview.comment);
      }
    } catch (err) {
      // Ignore if error
    }
  }, [id, user]);

  useEffect(() => {
    fetchProductDetails(id);
    fetchReviewsData();
    checkUserEligibility();

    return () => clearProductDetails();
  }, [id, fetchProductDetails, clearProductDetails, fetchReviewsData, checkUserEligibility]);

  const addToCartHandler = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (!rating || rating === 0) {
      setReviewError('Vui lòng chọn số sao đánh giá');
      return;
    }
    if (!comment.trim()) {
      setReviewError('Vui lòng nhập nội dung đánh giá');
      return;
    }

    setReviewLoading(true);
    setReviewError(null);
    setReviewSuccess(null);

    try {
      if (editingReviewId) {
        // Edit mode
        await api.put(`/reviews/${editingReviewId}`, {
          rating,
          comment,
        });
        setReviewSuccess('Cập nhật đánh giá thành công!');
        setEditingReviewId(null);
      } else {
        // Create mode (matching API spec: POST /api/reviews)
        await api.post('/reviews', {
          productId: id,
          rating,
          comment,
        });
        setReviewSuccess('Cảm ơn bạn đã gửi đánh giá cho sản phẩm!');
      }

      setReviewLoading(false);
      fetchProductDetails(id);
      fetchReviewsData();
      checkUserEligibility();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá');
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      fetchProductDetails(id);
      fetchReviewsData();
      checkUserEligibility();
      setEditingReviewId(null);
      setRating(5);
      setComment('');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi xóa đánh giá');
    }
  };

  const handleStartEdit = (rev) => {
    setEditingReviewId(rev._id);
    setRating(rev.rating);
    setComment(rev.comment);
    setReviewError(null);
    setReviewSuccess(null);
    // Smooth scroll to form
    document.getElementById('review-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Đang tải sản phẩm...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div className="py-12 px-4 md:px-12 lg:px-24 bg-white min-h-screen">
      <Link to="/shop" className="inline-flex items-center gap-2 mb-8 text-sm font-semibold text-brand-dark hover:text-brand-orange transition-colors">
        <i className="fas fa-arrow-left text-xs"></i> Quay lại cửa hàng
      </Link>

      <div className="flex flex-col md:flex-row gap-12">
        <div className="md:w-1/2">
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 flex items-center justify-center min-h-[400px]">
            {product.image && product.image !== '/images/sample.jpg' ? (
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[380px] max-w-full object-contain rounded-xl hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <i className="fas fa-box-open text-6xl text-gray-300"></i>
            )}
          </div>
        </div>

        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-brand-dark mb-2 tracking-tight">{product.name}</h1>
            <div className="mb-4 flex items-center gap-2">
              <Rating value={product.rating} text={`(${product.numReviews} đánh giá)`} />
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs font-semibold text-brand-orange">{product.rating ? `${product.rating}/5 sao` : 'Chưa có đánh giá'}</span>
            </div>
            <p className="text-3xl font-black text-brand-orange mb-6">${product.price.toFixed(2)}</p>
            <p className="text-gray-600 mb-8 leading-relaxed text-sm">{product.description}</p>
          </div>

          <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50/70 shadow-xs">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 text-sm">
              <span className="font-semibold text-gray-600">Tình trạng:</span>
              <span className={`font-bold flex items-center gap-1.5 ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                {product.stock > 0 ? `Còn hàng (${product.stock} sản phẩm)` : 'Hết hàng'}
              </span>
            </div>

            {product.stock > 0 && (
              <div className="flex justify-between items-center mb-6 text-sm">
                <span className="font-semibold text-gray-600">Số lượng:</span>
                <select
                  className="border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-brand-orange outline-none w-24 text-sm font-bold bg-white"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                >
                  {[...Array(Math.min(10, product.stock)).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={addToCartHandler}
              disabled={product.stock === 0}
              className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                product.stock === 0
                  ? 'bg-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-brand-dark hover:bg-brand-orange hover:shadow-lg'
              }`}
            >
              <i className="fas fa-shopping-cart text-sm"></i>
              <span>{product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 max-w-4xl">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-brand-dark">Đánh giá từ khách hàng</h2>
            <p className="text-xs text-gray-500 mt-1">
              Điểm trung bình: <strong className="text-brand-orange">{product.rating} / 5</strong> dựa trên {product.numReviews} lượt đánh giá
            </p>
          </div>
        </div>

        {reviewsLoading ? (
          <div className="text-center py-8 text-gray-400 text-sm">Đang tải danh sách đánh giá...</div>
        ) : reviews.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 text-center text-gray-500 mb-8">
            <i className="far fa-comment-dots text-3xl text-gray-300 mb-2 block"></i>
            Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên trải nghiệm và để lại nhận xét!
          </div>
        ) : (
          <div className="space-y-4 mb-12">
            {reviews.map((rev) => {
              const isMyReview = user && (rev.user?._id === user._id || rev.user === user._id);
              return (
                <div key={rev._id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-brand-orange/10 text-brand-orange font-bold text-xs flex items-center justify-center">
                        {(rev.user?.name || rev.name || 'U').substring(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-brand-dark">{rev.user?.name || rev.name}</h4>
                          {rev.isVerifiedPurchase && (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.2 rounded-full">
                              <i className="fas fa-check-circle text-[9px]"></i> Đã mua hàng
                            </span>
                          )}
                          {isMyReview && (
                            <span className="bg-orange-100 text-brand-orange text-[10px] font-bold px-2 py-0.2 rounded-full">
                              Của bạn
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-400">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('vi-VN') : ''}
                        </span>
                      </div>
                    </div>

                    {isMyReview && (
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(rev)}
                          className="text-gray-500 hover:text-brand-orange font-semibold cursor-pointer"
                        >
                          <i className="fas fa-edit"></i> Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(rev._id)}
                          className="text-gray-400 hover:text-red-500 font-semibold cursor-pointer"
                        >
                          <i className="fas fa-trash-alt"></i> Xóa
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mb-2">
                    <Rating value={rev.rating} />
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{rev.comment}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Write / Edit Review Section */}
        <div id="review-form-section" className="bg-gray-50/80 p-6 md:p-8 rounded-2xl border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-brand-dark">
                {editingReviewId ? 'Chỉnh sửa đánh giá của bạn' : 'Viết đánh giá sản phẩm'}
              </h3>
              {eligibility.isVerifiedPurchase && (
                <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                  <i className="fas fa-certificate"></i> Bạn đã mua sản phẩm này - Đánh giá của bạn sẽ có huy hiệu Xác thực!
                </p>
              )}
            </div>

            {editingReviewId && (
              <button
                type="button"
                onClick={() => {
                  setEditingReviewId(null);
                  setRating(5);
                  setComment('');
                }}
                className="text-xs text-gray-500 hover:underline cursor-pointer"
              >
                Hủy chế độ sửa
              </button>
            )}
          </div>

          {reviewError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl mb-4 text-xs font-semibold flex items-center gap-2">
              <i className="fas fa-exclamation-circle"></i> {reviewError}
            </div>
          )}

          {reviewSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl mb-4 text-xs font-semibold flex items-center gap-2">
              <i className="fas fa-check-circle"></i> {reviewSuccess}
            </div>
          )}

          {user ? (
            eligibility.hasReviewed && !editingReviewId ? (
              <div className="bg-white p-5 rounded-xl border border-gray-200 text-sm text-gray-600 flex justify-between items-center">
                <span>Bạn đã đánh giá sản phẩm này rồi.</span>
                <button
                  type="button"
                  onClick={() => eligibility.myReview && handleStartEdit(eligibility.myReview)}
                  className="bg-brand-dark text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-brand-orange transition-colors cursor-pointer"
                >
                  <i className="fas fa-edit mr-1"></i> Chỉnh sửa đánh giá
                </button>
              </div>
            ) : (
              <form onSubmit={submitReviewHandler} className="space-y-4">
                {/* Interactive Star Rating */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Đánh giá chất lượng sản phẩm:
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-2xl text-gray-300">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                        >
                          <i
                            className={`fas fa-star ${
                              (hoverRating || rating) >= star ? 'text-amber-400' : 'text-gray-200'
                            }`}
                          ></i>
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-brand-dark ml-2">
                      {rating === 5
                        ? 'Tuyệt vời (5/5)'
                        : rating === 4
                        ? 'Rất tốt (4/5)'
                        : rating === 3
                        ? 'Bình thường (3/5)'
                        : rating === 2
                        ? 'Tạm được (2/5)'
                        : 'Không hài lòng (1/5)'}
                    </span>
                  </div>
                </div>

                {/* Comment textarea */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Nhận xét chi tiết:
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Chia sẻ cảm nhận của bạn về chất lượng sản phẩm, đóng gói, giao hàng..."
                    className="w-full text-xs p-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none resize-none transition-shadow"
                  ></textarea>
                </div>

                <button
                  disabled={reviewLoading}
                  type="submit"
                  className="bg-brand-dark hover:bg-brand-orange text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {reviewLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <span>{editingReviewId ? 'Lưu cập nhật' : 'Gửi đánh giá'}</span>
                  )}
                </button>
              </form>
            )
          ) : (
            <div className="text-center py-4 text-sm text-gray-600">
              Vui lòng{' '}
              <Link to={`/login?redirect=/product/${id}`} className="text-brand-orange font-bold hover:underline">
                đăng nhập
              </Link>{' '}
              để viết đánh giá sản phẩm.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

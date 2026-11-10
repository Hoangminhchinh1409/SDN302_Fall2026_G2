import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-24 h-24 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-6">
        <i className="fas fa-paw text-4xl"></i>
      </div>
      <h1 className="text-6xl font-extrabold text-brand-dark mb-2">404</h1>
      <p className="text-lg text-gray-600 mb-1">Oops! Trang bạn tìm kiếm không tồn tại.</p>
      <p className="text-sm text-gray-500 mb-8">
        Đường dẫn có thể đã bị thay đổi hoặc bạn đã gõ sai địa chỉ.
      </p>
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="bg-brand-dark text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-orange transition-colors"
        >
          <i className="fas fa-home mr-2"></i>Về trang chủ
        </Link>
        <Link
          to="/shop"
          className="border-2 border-gray-200 text-brand-dark font-bold px-6 py-3 rounded-xl hover:border-brand-orange hover:text-brand-orange transition-colors"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

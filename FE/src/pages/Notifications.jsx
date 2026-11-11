import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import useLanguageStore from '../store/useLanguageStore';

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const { language } = useLanguageStore();

  useEffect(() => {
    api.get('/notifications')
      .then(({ data }) => setItems(data))
      .catch((err) => setError(err.response?.data?.message || (language === 'vi' ? 'Không tải được thông báo.' : 'Failed to load notifications.')));
  }, [language]);

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setItems((all) => all.map((item) => (item._id === id ? { ...item, readAt: new Date().toISOString() } : item)));
    } catch (err) {
      setError(err.response?.data?.message || (language === 'vi' ? 'Không thể cập nhật thông báo.' : 'Failed to update notification.'));
    }
  };

  return (
    <main className="min-h-[70vh] bg-gray-50 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-brand-dark">
          {language === 'vi' ? 'Thông báo của bạn' : 'Your Notifications'}
        </h1>
        <p className="mb-6 mt-1 text-sm text-gray-500">
          {language === 'vi' ? 'Cập nhật đơn hàng và trạng thái lịch hẹn chăm sóc thú cưng.' : 'Latest updates on your orders and pet appointments.'}
        </p>

        {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        {items.length ? (
          <div className="divide-y divide-gray-100 rounded-2xl bg-white px-5 shadow-sm border border-gray-200">
            {items.map((item) => (
              <article key={item._id} className={`flex items-start justify-between gap-4 py-5 ${item.readAt ? 'opacity-70' : ''}`}>
                <div>
                  <div className="font-semibold text-brand-dark">
                    {!item.readAt && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-brand-orange" />}
                    {item.title}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{item.message}</p>
                  <time className="mt-2 block text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')}
                  </time>
                  {item.order && (
                    <Link to={`/order/${item.order._id || item.order}`} className="mt-2 inline-block text-sm font-semibold text-brand-orange hover:underline">
                      {language === 'vi' ? 'Xem đơn hàng →' : 'View order →'}
                    </Link>
                  )}
                  {item.appointment && (
                    <Link to="/my-appointments" className="mt-2 inline-block text-sm font-semibold text-brand-orange hover:underline">
                      {language === 'vi' ? 'Xem chi tiết lịch hẹn →' : 'View appointment details →'}
                    </Link>
                  )}
                </div>
                {!item.readAt && (
                  <button onClick={() => markRead(item._id)} className="shrink-0 text-xs font-medium text-gray-500 hover:text-brand-orange cursor-pointer">
                    {language === 'vi' ? 'Đánh dấu đã đọc' : 'Mark as read'}
                  </button>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-10 text-center text-gray-500 border border-gray-200">
            {language === 'vi' ? 'Chưa có thông báo nào.' : 'No notifications yet.'}
          </div>
        )}
      </div>
    </main>
  );
}

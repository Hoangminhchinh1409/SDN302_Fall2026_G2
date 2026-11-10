import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { api.get('/notifications').then(({ data }) => setItems(data)).catch((err) => setError(err.response?.data?.message || 'Không tải được thông báo.')); }, []);
  const markRead = async (id) => {
    try { await api.put(`/notifications/${id}/read`); setItems((all) => all.map((item) => item._id === id ? { ...item, readAt: new Date().toISOString() } : item)); }
    catch (err) { setError(err.response?.data?.message || 'Không thể cập nhật thông báo.'); }
  };
  return <main className="min-h-[70vh] bg-gray-50 px-4 py-10 md:px-8"><div className="mx-auto max-w-3xl"><h1 className="text-3xl font-bold text-brand-dark">Thông báo đơn hàng</h1><p className="mb-6 mt-1 text-sm text-gray-500">Cập nhật mới nhất về việc xử lý và giao đơn.</p>{error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}{items.length ? <div className="divide-y divide-gray-100 rounded-2xl bg-white px-5">{items.map((item) => <article key={item._id} className={`flex items-start justify-between gap-4 py-5 ${item.readAt ? 'opacity-70' : ''}`}><div><div className="font-semibold text-brand-dark">{!item.readAt && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-brand-orange" />}{item.title}</div><p className="mt-1 text-sm text-gray-600">{item.message}</p><time className="mt-2 block text-xs text-gray-400">{new Date(item.createdAt).toLocaleString('vi-VN')}</time>{item.order && <Link to={`/order/${item.order._id}`} className="mt-2 inline-block text-sm font-semibold text-brand-orange">Xem đơn hàng</Link>}</div>{!item.readAt && <button onClick={() => markRead(item._id)} className="shrink-0 text-sm text-gray-500 hover:text-brand-orange">Đánh dấu đã đọc</button>}</article>)}</div> : <div className="rounded-2xl bg-white p-10 text-center text-gray-500">Chưa có thông báo nào.</div>}</div></main>;
}

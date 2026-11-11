import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    topProducts: [],
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          api.get('/stats').catch(() => ({ data: {} })),
          api.get('/orders').catch(() => ({ data: [] })),
        ]);

        const data = statsRes.data || {};
        setStats({
          totalUsers: data.totalUsers ?? data.users ?? 0,
          totalOrders: data.totalOrders ?? data.orders ?? 0,
          totalRevenue: data.totalRevenue ?? data.sales ?? 0,
          totalProducts: data.totalProducts ?? data.products ?? 0,
          topProducts: Array.isArray(data.topProducts) ? data.topProducts : [],
        });

        const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
        setRecentOrders(orders.slice(0, 6));
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Chờ xác nhận':
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Chờ xác nhận</span>;
      case 'Đang đóng gói':
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">Đang đóng gói</span>;
      case 'Đang giao':
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">Đang giao</span>;
      case 'Hoàn thành':
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Hoàn thành</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">{status}</span>;
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-gray-400 text-sm">Đang tải dữ liệu tổng quan…</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark tracking-tight">Tổng quan quản trị</h1>
          <p className="text-sm text-gray-500 mt-1">Số liệu kinh doanh, đơn hàng và các hoạt động mua sắm gần nhất.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/product/new"
            className="bg-brand-dark hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-lg transition"
          >
            + Thêm sản phẩm
          </Link>
          <Link
            to="/admin/orders"
            className="bg-white border border-gray-300 hover:bg-gray-50 text-brand-dark text-xs font-bold px-4 py-2.5 rounded-lg transition"
          >
            Quản lý đơn hàng
          </Link>
        </div>
      </div>

      {/* Metric Tiles - Clean typography, no colored circular icon badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Tổng doanh thu</div>
          <div className="text-2xl font-extrabold text-brand-dark tracking-tight">
            ${Number(stats.totalRevenue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-2">Từ các đơn đã thanh toán</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Tổng số đơn hàng</div>
          <div className="text-2xl font-extrabold text-brand-dark tracking-tight">
            {stats.totalOrders.toLocaleString()}
          </div>
          <Link to="/admin/orders" className="text-xs text-brand-orange hover:underline font-medium mt-2 block">
            Xem danh sách đơn →
          </Link>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Khách hàng đăng ký</div>
          <div className="text-2xl font-extrabold text-brand-dark tracking-tight">
            {stats.totalUsers.toLocaleString()}
          </div>
          <Link to="/admin/users" className="text-xs text-gray-500 hover:text-brand-dark font-medium mt-2 block">
            Xem tài khoản →
          </Link>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Sản phẩm trong kho</div>
          <div className="text-2xl font-extrabold text-brand-dark tracking-tight">
            {stats.totalProducts.toLocaleString()}
          </div>
          <Link to="/admin/products" className="text-xs text-gray-500 hover:text-brand-dark font-medium mt-2 block">
            Quản lý kho hàng →
          </Link>
        </div>
      </div>

      {/* Main Content Grid: Recent Orders & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-brand-dark">Đơn hàng vừa phát sinh</h2>
              <p className="text-xs text-gray-500 mt-0.5">Các giao dịch gần nhất cần theo dõi và xử lý</p>
            </div>
            <Link to="/admin/orders" className="text-xs font-bold text-brand-orange hover:underline">
              Xem tất cả ({stats.totalOrders})
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Mã đơn</th>
                  <th className="py-3 px-4">Khách hàng</th>
                  <th className="py-3 px-4">Ngày đặt</th>
                  <th className="py-3 px-4">Tổng tiền</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-dark">
                        #{order._id.substring(order._id.length - 6).toUpperCase()}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-brand-dark">{order.user?.name || 'Khách vãng lai'}</div>
                        <div className="text-[11px] text-gray-400">{order.user?.email || ''}</div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-brand-dark">
                        ${order.totalPrice?.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/order/${order._id}`}
                          className="text-xs font-bold text-brand-orange hover:underline"
                        >
                          Mở →
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-400">
                      Chưa có dữ liệu đơn hàng.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Rated / Best Products */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-base font-bold text-brand-dark">Sản phẩm đánh giá cao</h2>
              <p className="text-xs text-gray-500 mt-0.5">Mặt hàng được yêu thích bởi khách hàng</p>
            </div>

            <div className="p-4 divide-y divide-gray-100 space-y-3">
              {stats.topProducts && stats.topProducts.length > 0 ? (
                stats.topProducts.map((p) => (
                  <div key={p._id} className="pt-3 first:pt-0 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      {p.image && p.image !== '/images/sample.jpg' ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                      ) : (
                        <i className="fas fa-box text-gray-300"></i>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${p._id}`}
                        className="font-bold text-xs text-brand-dark hover:text-brand-orange truncate block"
                      >
                        {p.name}
                      </Link>
                      <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-2">
                        <span>${Number(p.price).toFixed(2)}</span>
                        <span>•</span>
                        <span className="flex items-center text-amber-500">
                          <i className="fas fa-star text-[9px] mr-1"></i> {p.rating} ({p.numReviews || 0})
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-[11px]">
                      <span className={`font-semibold ${p.stock <= 5 ? 'text-red-500' : 'text-gray-500'}`}>
                        Còn {p.stock}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-gray-400 text-xs">Chưa có sản phẩm nào.</div>
              )}
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <Link
              to="/admin/products"
              className="text-xs font-bold text-brand-dark hover:text-brand-orange flex items-center justify-between"
            >
              <span>Xem toàn bộ danh mục sản phẩm</span>
              <i className="fas fa-arrow-right text-[10px]"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

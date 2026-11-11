import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const StaffDashboard = () => {
  const [stats, setStats] = useState({
    pendingOrders: 0,
    processingOrders: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    lowStockProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, ordersRes, apptsRes] = await Promise.all([
          api.get('/stats/staff').catch(() => ({ data: {} })),
          api.get('/orders').catch(() => ({ data: [] })),
          api.get('/appointments').catch(() => ({ data: [] })),
        ]);

        if (statsRes.data) setStats((prev) => ({ ...prev, ...statsRes.data }));

        const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
        const pendingOrPackaging = orders
          .filter((o) => o.status === 'Chờ xác nhận' || o.status === 'Đang đóng gói')
          .slice(0, 5);
        setRecentOrders(pendingOrPackaging);

        const appts = Array.isArray(apptsRes.data) ? apptsRes.data : [];
        const pendingAppts = appts
          .filter((a) => a.status === 'Pending' || a.status === 'Confirmed')
          .slice(0, 5);
        setRecentAppointments(pendingAppts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="py-20 text-center text-gray-400 text-sm">Đang tải dữ liệu ca làm việc…</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark tracking-tight">Kênh tác vụ nhân viên (Staff Workspace)</h1>
        <p className="text-sm text-gray-500 mt-1">Nhiệm vụ ưu tiên trong ca làm: duyệt đơn hàng, chuẩn bị hàng và theo dõi lịch hẹn thú cưng.</p>
      </div>

      {/* KPI Cards: Flat, typographic, no colorful circular icon balls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/staff/orders?status=Chờ xác nhận"
          className="bg-white p-5 rounded-xl border border-gray-200 hover:border-amber-400 transition block"
        >
          <div className="text-xs uppercase font-semibold text-gray-500">Đơn chờ xác nhận</div>
          <div className="text-3xl font-extrabold text-amber-700 tracking-tight mt-1">{stats.pendingOrders}</div>
          <div className="text-xs text-gray-400 mt-2 font-medium">Cần duyệt ngay →</div>
        </Link>

        <Link
          to="/staff/orders?status=Đang đóng gói"
          className="bg-white p-5 rounded-xl border border-gray-200 hover:border-indigo-400 transition block"
        >
          <div className="text-xs uppercase font-semibold text-gray-500">Cần đóng gói</div>
          <div className="text-3xl font-extrabold text-indigo-700 tracking-tight mt-1">{stats.processingOrders}</div>
          <div className="text-xs text-gray-400 mt-2 font-medium">Chuẩn bị gửi shipper →</div>
        </Link>

        <Link
          to="/staff/appointments?status=today"
          className="bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-400 transition block"
        >
          <div className="text-xs uppercase font-semibold text-gray-500">Lịch hẹn trong ngày</div>
          <div className="text-3xl font-extrabold text-blue-700 tracking-tight mt-1">{stats.todayAppointments}</div>
          <div className="text-xs text-gray-400 mt-2 font-medium">{stats.pendingAppointments} lịch chưa xác nhận →</div>
        </Link>

        <Link
          to="/staff/inventory?filter=low"
          className="bg-white p-5 rounded-xl border border-gray-200 hover:border-red-400 transition block"
        >
          <div className="text-xs uppercase font-semibold text-gray-500">Cảnh báo tồn kho</div>
          <div className="text-3xl font-extrabold text-red-600 tracking-tight mt-1">{stats.lowStockProducts}</div>
          <div className="text-xs text-gray-400 mt-2 font-medium">Sản phẩm tồn ≤ 5 →</div>
        </Link>
      </div>

      {/* Action lists: Pending Orders & Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Orders */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-brand-dark">Đơn cần xử lý gấp</h2>
              <p className="text-xs text-gray-400">Các đơn hàng mới phát sinh cần chuẩn bị</p>
            </div>
            <Link to="/staff/orders" className="text-xs font-bold text-brand-orange hover:underline">
              Mở danh sách
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">Không có đơn hàng nào chờ xử lý.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <div key={order._id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-brand-dark">
                      #{order._id.slice(-6).toUpperCase()} • {order.user?.name || 'Khách vãng lai'}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      ${order.totalPrice?.toFixed(2)} • {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      {order.status}
                    </span>
                    <Link
                      to={`/staff/orders`}
                      className="text-xs bg-brand-dark hover:bg-black text-white px-2.5 py-1 rounded-md font-semibold transition"
                    >
                      Xử lý
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-brand-dark">Lịch hẹn sắp tới</h2>
              <p className="text-xs text-gray-400">Ca spa & khám thú cưng trong ngày</p>
            </div>
            <Link to="/staff/appointments" className="text-xs font-bold text-brand-orange hover:underline">
              Mở danh sách
            </Link>
          </div>

          {recentAppointments.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">Không có lịch hẹn nào sắp tới.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentAppointments.map((appt) => (
                <div key={appt._id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-brand-dark">
                      {appt.user?.name || 'Khách'} • Thú cưng: {appt.pet?.name || 'Bé cưng'}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      {appt.service?.name} • {new Date(appt.date).toLocaleString('vi-VN')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded font-medium border ${
                        appt.status === 'Confirmed'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {appt.status}
                    </span>
                    <Link
                      to={`/staff/appointments`}
                      className="text-xs bg-brand-dark hover:bg-black text-white px-2.5 py-1 rounded-md font-semibold transition"
                    >
                      Chi tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;

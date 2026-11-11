import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useServiceStore from '../store/useServiceStore';

const Services = () => {
  const { services, loading, error, fetchServices } = useServiceStore();

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <div className="bg-white min-h-screen py-16 px-4 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-16">
          <h1 className="text-4xl sm:text-5xl font-black text-brand-dark tracking-tight leading-tight mb-4">
            Dịch vụ Spa & Chăm sóc thú cưng
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            Đặt lịch chăm sóc chuyên sâu với đội ngũ kỹ thuật viên giàu kinh nghiệm. Mỗi ca dịch vụ được giới hạn sĩ số để chăm sóc chu đáo nhất.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-400 text-lg">Đang tải danh sách dịch vụ…</div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-base">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service._id} className="bg-gray-50 border border-gray-200 rounded-2xl p-8 flex flex-col justify-between hover:border-gray-300 transition shadow-2xs">
                <div>
                  <h2 className="text-2xl font-extrabold text-brand-dark mb-2.5">{service.name}</h2>
                  <p className="text-base text-gray-700 mb-6 leading-relaxed font-normal">{service.description}</p>
                </div>

                <div className="pt-6 border-t border-gray-200/80 flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-black text-brand-dark">${service.price}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{service.durationMinutes} phút thực hiện</div>
                  </div>
                  <Link
                    to="/book-appointment"
                    className="bg-brand-dark hover:bg-black text-white font-bold py-3 px-6 rounded-xl text-base transition focus-visible:ring-2 focus-visible:ring-brand-orange"
                  >
                    Đặt lịch
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;

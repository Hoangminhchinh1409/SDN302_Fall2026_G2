import React from 'react';
import { Link } from 'react-router-dom';
import useLanguageStore from '../store/useLanguageStore';

const About = () => {
  const { language } = useLanguageStore();

  const isVi = language === 'vi';

  const values = [
    {
      title: isVi ? 'Dinh dưỡng được kiểm duyệt' : 'Curated Nutrition',
      desc: isVi
        ? 'Chỉ nhập khẩu và phân phối các dòng hạt, pate và thức ăn đạt tiêu chuẩn thú y an toàn.'
        : 'Only stocking verified veterinary-grade food, treats, and balanced nutrition.',
      icon: 'fa-heartbeat',
    },
    {
      title: isVi ? 'Giới hạn số lượng phục vụ' : 'Capped Slot Booking',
      desc: isVi
        ? 'Mỗi ca spa chỉ nhận tối đa 3 bạn thú cưng để các chuyên viên dành trọn sự nâng niu và chú ý.'
        : 'Maximum 3 pets per service slot to ensure individual, unhurried care.',
      icon: 'fa-shield-dog',
    },
    {
      title: isVi ? 'Hồ sơ y tế minh bạch' : 'Transparent Care Passport',
      desc: isVi
        ? 'Lưu trữ lịch sử tiêm chủng online, cảnh báo lịch tiêm nhắc lại tự động cho từng bạn nhỏ.'
        : 'Digital pet health passport with automatic reminders for vaccine boosters.',
      icon: 'fa-notes-medical',
    },
  ];

  const team = [
    {
      name: 'Dr. Minh Trang',
      role: isVi ? 'Bác sĩ thú y trưởng' : 'Head Veterinarian',
      exp: isVi ? '8 năm kinh nghiệm y học thú cưng' : '8+ yrs veterinary medicine',
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Thanh Phong',
      role: isVi ? 'Chuyên gia tạo kiểu & Groomer' : 'Lead Grooming Stylist',
      exp: isVi ? 'Chứng chỉ Grooming quốc tế Level B' : 'Certified Master Groomer',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Bích Ngọc',
      role: isVi ? 'Tư vấn dinh dưỡng thú cưng' : 'Pet Nutrition Consultant',
      exp: isVi ? 'Chăm sóc hơn 3,000 ca thể trạng' : 'Specialist in sensitive digestion',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div className="bg-white text-brand-dark min-h-screen">
      {/* Hero Section: Clean, typography-first with authentic photography */}
      <section className="px-4 md:px-12 lg:px-24 py-16 md:py-24 border-b border-gray-100 bg-[#fbf9f6]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] mb-6">
              {isVi ? 'Tận tâm vì sức khỏe & niềm vui của thú cưng.' : 'Dedicated to every companion’s joy and health.'}
            </h1>
            <p className="text-lg text-gray-700 max-w-xl mb-8 leading-relaxed">
              {isVi
                ? 'Thành lập từ tình yêu thương động vật, Pet Shop hướng đến mô hình chăm sóc toàn diện: dinh dưỡng chuẩn khoa học, dịch vụ spa chu đáo và quản lý sức khỏe thông minh.'
                : 'Founded on genuine love for animals, Pet Shop unites scientific nutrition, boutique grooming and digital health tracking for modern pet parents.'}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="bg-brand-dark hover:bg-black text-white px-7 py-3.5 rounded-xl font-bold text-sm transition"
              >
                {isVi ? 'Khám phá sản phẩm' : 'Explore Shop'}
              </Link>
              <Link
                to="/services"
                className="bg-white hover:bg-gray-50 text-brand-dark border-2 border-gray-200 px-7 py-3.5 rounded-xl font-bold text-sm transition"
              >
                {isVi ? 'Dịch vụ chăm sóc' : 'Our Services'}
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 flex justify-center">
            <div className="w-full max-w-md aspect-4/3 rounded-3xl overflow-hidden shadow-md border-4 border-white bg-orange-100">
              <img
                src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80"
                alt="Chăm sóc thú cưng tại Pet Shop"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy & Values */}
      <section className="px-4 md:px-12 lg:px-24 py-20 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              {isVi ? 'Tiêu chuẩn chất lượng tại Pet Shop' : 'Our Commitments'}
            </h2>
            <p className="text-base text-gray-600">
              {isVi
                ? 'Chúng tôi không chạy theo số lượng mà ưu tiên sự an toàn, minh bạch và thoải mái tối đa cho thú cưng.'
                : 'Prioritizing safety, transparency and low stress over fast throughput.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-7 border border-gray-200 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 text-brand-orange flex items-center justify-center text-lg mb-5 shadow-2xs">
                    <i className={`fas ${v.icon}`}></i>
                  </div>
                  <h3 className="text-xl font-extrabold text-brand-dark mb-2.5">{v.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-normal">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Team */}
      <section className="px-4 md:px-12 lg:px-24 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              {isVi ? 'Đội ngũ chăm sóc tận tâm' : 'Our Care Team'}
            </h2>
            <p className="text-base text-gray-600">
              {isVi
                ? 'Các bác sĩ và chuyên viên tạo kiểu được đào tạo bài bản, luôn xem thú cưng như thành viên gia đình.'
                : 'Experienced veterinarians and certified stylists who treat every companion like their own.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:border-gray-300 transition">
                <div className="w-full h-64 bg-gray-100 overflow-hidden">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-extrabold text-lg text-brand-dark mb-1">{member.name}</h3>
                  <p className="text-xs font-bold text-brand-orange uppercase tracking-wide mb-2">{member.role}</p>
                  <p className="text-xs text-gray-500 font-medium">{member.exp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

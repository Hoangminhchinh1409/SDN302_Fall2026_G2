import React, { useState } from 'react';
import api from '../api/axios';
import useLanguageStore from '../store/useLanguageStore';

const Contact = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const { language } = useLanguageStore();

  const isVi = language === 'vi';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    setSubmitting(true);
    try {
      const { data } = await api.post('/contact', form);
      setFeedback({ type: 'success', text: data.message });
      setForm({ firstName: '', lastName: '', email: '', message: '' });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || (isVi ? 'Không thể gửi tin nhắn. Vui lòng thử lại sau.' : 'Failed to send message. Please try again.'),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white text-brand-dark min-h-screen">
      {/* Header */}
      <section className="px-4 md:px-12 lg:px-24 py-16 border-b border-gray-100 bg-[#fbf9f6]">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            {isVi ? 'Liên hệ & Hỗ trợ' : 'Get in Touch with Us'}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
            {isVi
              ? 'Đội ngũ chăm sóc khách hàng và chuyên viên Pet Shop luôn sẵn sàng giải đáp thắc mắc về đơn hàng, dịch vụ spa và lịch tiêm chủng.'
              : 'Our customer support and pet care team are always ready to assist with order inquiries, spa appointments, and care guidance.'}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-16 px-4 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-gray-50 border border-gray-200 p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-brand-dark mb-6">
              {isVi ? 'Gửi tin nhắn trực tiếp' : 'Send Us a Message'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-firstname" className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                    {isVi ? 'Họ đệm' : 'First Name'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-firstname"
                    name="firstName"
                    type="text"
                    required
                    autoComplete="given-name"
                    spellCheck="false"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-orange"
                    placeholder={isVi ? 'Nguyễn' : 'First name'}
                  />
                </div>
                <div>
                  <label htmlFor="contact-lastname" className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                    {isVi ? 'Tên' : 'Last Name'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-lastname"
                    name="lastName"
                    type="text"
                    required
                    autoComplete="family-name"
                    spellCheck="false"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-orange"
                    placeholder={isVi ? 'Văn An' : 'Last name'}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                  {isVi ? 'Địa chỉ Email' : 'Email Address'} <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  spellCheck="false"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-orange"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                  {isVi ? 'Nội dung tin nhắn' : 'Message'} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows="5"
                  required
                  minLength="10"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none resize-none focus:ring-2 focus:ring-brand-orange"
                  placeholder={isVi ? 'Nội dung cần hỗ trợ hoặc phản hồi của bạn…' : 'How can we help you and your pet?'}
                ></textarea>
              </div>

              {feedback && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`p-3.5 rounded-xl text-sm font-medium ${
                    feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {feedback.text}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="bg-brand-dark hover:bg-black text-white font-bold py-3 px-7 rounded-xl text-sm transition disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (isVi ? 'Đang gửi…' : 'Sending…') : (isVi ? 'Gửi tin nhắn' : 'Send Message')}
              </button>
            </form>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-brand-dark mb-4">
                {isVi ? 'Thông tin cửa hàng' : 'Store Information'}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-8">
                {isVi
                  ? 'Ghé thăm cửa hàng hoặc liên hệ trực tiếp với chúng tôi qua số điện thoại và email.'
                  : 'Visit our flagship care center or connect directly with our friendly support representatives.'}
              </p>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center shrink-0 border border-orange-100">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <div className="font-bold text-brand-dark">{isVi ? 'Địa chỉ' : 'Location'}</div>
                    <p className="text-gray-500 text-xs mt-0.5">Khu Công Nghệ Cao Hòa Lạc, CT03, Hòa Lạc, Hà Nội, Việt Nam</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center shrink-0 border border-orange-100">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <div className="font-bold text-brand-dark">Email</div>
                    <p className="text-gray-500 text-xs mt-0.5">chinhhmhe171181@fpt.edu.vn</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center shrink-0 border border-orange-100">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div>
                    <div className="font-bold text-brand-dark">{isVi ? 'Hotline hỗ trợ' : 'Phone'}</div>
                    <p className="text-gray-500 text-xs mt-0.5">+84 93-629-5902</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center shrink-0 border border-orange-100">
                    <i className="far fa-clock"></i>
                  </div>
                  <div>
                    <div className="font-bold text-brand-dark">{isVi ? 'Thời gian mở cửa' : 'Working Hours'}</div>
                    <p className="text-gray-500 text-xs mt-0.5">{isVi ? 'Thứ 2 - Chủ Nhật: 08:00 - 21:00' : 'Monday - Sunday: 8:00 AM - 9:00 PM'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-orange-50/50 border border-orange-100 rounded-xl text-xs text-brand-orange font-medium">
              🐾 {isVi ? 'Chăm sóc chu đáo, hỗ trợ tư vấn 24/7 cho các ca y tế khẩn cấp.' : '24/7 dedicated support for emergency veterinary inquiries.'}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="w-full h-80 rounded-2xl overflow-hidden border border-gray-200">
          <iframe
            src="https://maps.google.com/maps?q=21.0124167,105.5252892&z=16&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Pet Shop Location Map"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </main>
    </div>
  );
};

export default Contact;

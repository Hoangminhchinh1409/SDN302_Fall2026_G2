import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const emptyAddress = { label: 'Nhà riêng', recipient: '', phone: '', address: '', city: '', postalCode: '', country: 'Việt Nam', isDefault: false };

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyAddress);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try { const { data } = await api.get('/users/addresses'); setAddresses(data); }
    catch (err) { setError(err.response?.data?.message || 'Không tải được địa chỉ.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }));
  const submit = async (event) => {
    event.preventDefault(); setError('');
    try {
      const { data } = editingId ? await api.put(`/users/addresses/${editingId}`, form) : await api.post('/users/addresses', form);
      setAddresses(data); setForm(emptyAddress); setEditingId(null);
    } catch (err) { setError(err.response?.data?.message || 'Không lưu được địa chỉ.'); }
  };
  const edit = (item) => { setEditingId(item._id); setForm({ ...emptyAddress, ...item }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const remove = async (id) => {
    try { const { data } = await api.delete(`/users/addresses/${id}`); setAddresses(data); }
    catch (err) { setError(err.response?.data?.message || 'Không xóa được địa chỉ.'); }
  };

  return <main className="min-h-[70vh] bg-gray-50 px-4 py-10 md:px-8"><div className="mx-auto max-w-5xl">
    <div className="mb-7 flex items-center justify-between"><div><h1 className="text-3xl font-bold text-brand-dark">Địa chỉ giao hàng</h1><p className="mt-1 text-sm text-gray-500">Lưu địa chỉ để thanh toán nhanh hơn.</p></div><Link to="/profile" className="text-sm font-semibold text-brand-orange">Quay lại hồ sơ</Link></div>
    {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-brand-dark">{editingId ? 'Sửa địa chỉ' : 'Thêm địa chỉ'}</h2>
        {[['label','Tên gợi nhớ'],['recipient','Tên người nhận'],['phone','Số điện thoại'],['address','Địa chỉ'],['city','Tỉnh / thành phố'],['postalCode','Mã bưu chính'],['country','Quốc gia']].map(([name,label]) => <label key={name} className="block text-sm font-medium text-gray-700">{label}{['recipient','phone','address','city'].includes(name) && ' *'}<input name={name} required={['recipient','phone','address','city'].includes(name)} value={form[name] || ''} onChange={change} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-brand-orange" /></label>)}
        <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" name="isDefault" checked={Boolean(form.isDefault)} onChange={change} /> Đặt làm địa chỉ mặc định</label>
        <div className="flex gap-3"><button className="rounded-lg bg-brand-dark px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-orange">{editingId ? 'Cập nhật' : 'Lưu địa chỉ'}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyAddress); }} className="px-4 text-sm text-gray-500">Hủy sửa</button>}</div>
      </form>
      <section className="space-y-3">{loading ? <p className="p-6 text-gray-500">Đang tải địa chỉ…</p> : addresses.length ? addresses.map((item) => <article key={item._id} className="rounded-2xl bg-white p-5 shadow-sm"><div className="flex justify-between gap-4"><div><div className="flex items-center gap-2 font-bold text-brand-dark">{item.label}{item.isDefault && <span className="rounded-full bg-orange-50 px-2 py-1 text-xs text-brand-orange">Mặc định</span>}</div><p className="mt-2 text-sm">{item.recipient} · {item.phone}</p><p className="text-sm text-gray-600">{item.address}, {item.city}{item.postalCode ? `, ${item.postalCode}` : ''}, {item.country}</p></div><div className="flex shrink-0 gap-3 text-sm"><button onClick={() => edit(item)} className="font-semibold text-brand-orange">Sửa</button><button onClick={() => remove(item._id)} className="text-red-600">Xóa</button></div></div></article>) : <div className="rounded-2xl bg-white p-8 text-center text-gray-500">Bạn chưa lưu địa chỉ giao hàng nào.</div>}</section>
    </div>
  </div></main>;
}

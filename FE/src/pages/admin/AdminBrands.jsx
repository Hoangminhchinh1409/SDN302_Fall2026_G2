import React, { useEffect, useState } from 'react';
import useBrandStore from '../../store/useBrandStore';

const EMPTY_FORM = { name: '', description: '' };

const AdminBrands = () => {
  const { brands, fetchBrands, createBrand, updateBrand, deleteBrand, loading, error } =
    useBrandStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFeedback(null);
    setModalOpen(true);
  };

  const openEdit = (brand) => {
    setEditingId(brand._id);
    setForm({
      name: brand.name || '',
      description: brand.description || ''
    });
    setFeedback(null);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim()
    };

    const result = editingId ? await updateBrand(editingId, payload) : await createBrand(payload);

    setSaving(false);
    if (result.success) {
      setModalOpen(false);
      setFeedback({
        type: 'success',
        text: editingId ? 'Cập nhật thương hiệu thành công.' : 'Thêm thương hiệu thành công.'
      });
    } else {
      setFeedback({ type: 'error', text: result.message || 'Lưu thất bại.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa thương hiệu này?')) return;
    setFeedback(null);
    const result = await deleteBrand(id);
    if (!result.success) {
      setFeedback({ type: 'error', text: result.message || 'Xóa thất bại.' });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Brands Management</h2>
        <button
          onClick={openCreate}
          className="bg-brand-orange text-white px-4 py-2 rounded-md font-medium hover:bg-orange-600 cursor-pointer"
        >
          <i className="fas fa-plus mr-2"></i> Create Brand
        </button>
      </div>

      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className={`mb-4 p-3 rounded-lg text-sm font-medium ${
            feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {feedback.text}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">Loading brands...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-medium">STT</th>
                <th className="p-4 font-medium">NAME</th>
                <th className="p-4 font-medium">DESCRIPTION</th>
                <th className="p-4 font-medium text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {brands.map((brand, idx) => (
                <tr key={brand._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 text-gray-500">{idx + 1}</td>
                  <td className="p-4 font-medium text-brand-dark">{brand.name}</td>
                  <td className="p-4 text-gray-600">{brand.description || 'N/A'}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEdit(brand)}
                      className="text-brand-orange hover:text-orange-700 underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(brand._id)}
                      className="text-red-500 hover:text-red-700 underline text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {brands.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">No brands found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4"
          >
            <h3 className="text-lg font-bold text-gray-800">
              {editingId ? 'Edit Brand' : 'Create Brand'}
            </h3>

            <div>
              <label htmlFor="brand-name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="brand-name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>

            <div>
              <label htmlFor="brand-desc" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="brand-desc"
                rows="3"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-brand-orange text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-orange-600 disabled:opacity-50 cursor-pointer"
              >
                {saving ? 'Đang lưu…' : editingId ? 'Save Changes' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminBrands;

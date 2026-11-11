import React, { useEffect, useState } from 'react';
import usePetProfileStore from '../store/usePetProfileStore';
import useAuthStore from '../store/useAuthStore';
import useLanguageStore from '../store/useLanguageStore';

const PetProfiles = () => {
  const { pets, fetchPets, addPet, removePet, addVaccination, removeVaccination, loading } = usePetProfileStore();
  const { user } = useAuthStore();
  const { t, language } = useLanguageStore();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'Dog', breed: '', age: '', weight: '' });
  const [activeVaccinePetId, setActiveVaccinePetId] = useState(null);
  const [vaccineForm, setVaccineForm] = useState({ vaccineName: '', injectedDate: '', nextDueDate: '', notes: '' });

  useEffect(() => {
    if (user) fetchPets();
  }, [user, fetchPets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await addPet(formData);
    if (ok) {
      setShowForm(false);
      setFormData({ name: '', type: 'Dog', breed: '', age: '', weight: '' });
    }
  };

  const handleAddVaccine = async (e, petId) => {
    e.preventDefault();
    if (!vaccineForm.vaccineName) return;
    const ok = await addVaccination(petId, vaccineForm);
    if (ok) {
      setVaccineForm({ vaccineName: '', injectedDate: '', nextDueDate: '', notes: '' });
      setActiveVaccinePetId(null);
    }
  };

  const checkDueStatus = (dueDate) => {
    if (!dueDate) return null;
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { label: t('overdue_shot'), color: 'bg-red-100 text-red-700 border-red-200' };
    if (diffDays <= 7) return { label: `${t('due_soon_shot')} (${diffDays} ${language === 'vi' ? 'ngày' : 'days'})`, color: 'bg-amber-100 text-amber-800 border-amber-200' };
    return { label: `${t('scheduled_shot')}: ${due.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')}`, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  };

  if (!user) return <div className="text-center mt-20 text-xl">{language === 'vi' ? 'Vui lòng đăng nhập để xem hồ sơ thú cưng.' : 'Please sign in to view your pet profiles.'}</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{t('pets_page_title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('pets_page_sub')}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-brand-orange text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-orange-600 transition cursor-pointer"
        >
          {showForm ? t('cancel_btn') : t('add_pet_btn')}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mb-8 grid grid-cols-2 gap-4 border border-gray-100">
          <div>
            <label className="block text-sm font-medium mb-1">{t('pet_name')}</label>
            <input required type="text" className="w-full border p-2 rounded-lg focus-visible:ring-2 focus-visible:ring-brand-orange" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('pet_type')}</label>
            <select className="w-full border p-2 rounded-lg focus-visible:ring-2 focus-visible:ring-brand-orange" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
              <option value="Dog">{language === 'vi' ? 'Chó' : 'Dog'}</option>
              <option value="Cat">{language === 'vi' ? 'Mèo' : 'Cat'}</option>
              <option value="Bird">{language === 'vi' ? 'Chim' : 'Bird'}</option>
              <option value="Other">{language === 'vi' ? 'Khác' : 'Other'}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('pet_breed')}</label>
            <input type="text" className="w-full border p-2 rounded-lg focus-visible:ring-2 focus-visible:ring-brand-orange" value={formData.breed} onChange={e => setFormData({...formData, breed: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('pet_age')}</label>
            <input type="number" className="w-full border p-2 rounded-lg focus-visible:ring-2 focus-visible:ring-brand-orange" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
          </div>
          <div className="col-span-2">
            <button type="submit" disabled={loading} className="w-full bg-brand-dark text-white p-2.5 rounded-lg font-medium hover:bg-gray-800 transition cursor-pointer">
              {t('save_pet')}
            </button>
          </div>
        </form>
      )}

      {loading && !showForm ? <div>{language === 'vi' ? 'Đang tải…' : 'Loading…'}</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pets.map(pet => (
            <div key={pet._id} className="bg-white border border-gray-200 p-6 rounded-xl relative shadow-sm hover:shadow transition">
              <button
                onClick={() => removePet(pet._id)}
                aria-label="Delete pet profile"
                className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition cursor-pointer"
              >
                <i className="fas fa-trash"></i>
              </button>
              <h2 className="text-xl font-bold mb-2 flex items-center">
                <i className={`fas fa-${pet.type.toLowerCase() === 'cat' ? 'cat' : pet.type.toLowerCase() === 'dog' ? 'dog' : 'paw'} text-orange-500 mr-2`}></i>
                {pet.name}
              </h2>
              <div className="text-sm text-gray-600 space-y-1 mb-4">
                <p><strong>{t('pet_type')}:</strong> {pet.type} {pet.breed ? `• ${pet.breed}` : ''}</p>
                <p><strong>{t('pet_age')}:</strong> {pet.age ? `${pet.age} ${language === 'vi' ? 'tuổi' : 'yrs'}` : (language === 'vi' ? 'Chưa rõ' : 'Unknown')}</p>
              </div>

              {/* Sổ tiêm phòng */}
              <div className="border-t border-gray-100 pt-4 mt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <i className="fas fa-syringe mr-1 text-brand-orange"></i> {t('vaccine_passport')} ({pet.vaccinations?.length || 0})
                  </span>
                  <button
                    onClick={() => setActiveVaccinePetId(activeVaccinePetId === pet._id ? null : pet._id)}
                    className="text-xs text-brand-orange hover:underline font-medium cursor-pointer"
                  >
                    {activeVaccinePetId === pet._id ? t('close_btn') : t('add_shot_btn')}
                  </button>
                </div>

                {activeVaccinePetId === pet._id && (
                  <form onSubmit={(e) => handleAddVaccine(e, pet._id)} className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-3 text-xs space-y-2">
                    <input
                      type="text"
                      placeholder={t('shot_name_placeholder')}
                      className="w-full p-2 border rounded bg-white"
                      required
                      value={vaccineForm.vaccineName}
                      onChange={(e) => setVaccineForm({ ...vaccineForm, vaccineName: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-gray-500 block mb-0.5">{t('injected_date')}</span>
                        <input
                          type="date"
                          className="w-full p-1.5 border rounded bg-white"
                          value={vaccineForm.injectedDate}
                          onChange={(e) => setVaccineForm({ ...vaccineForm, injectedDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-0.5">{t('due_date')}</span>
                        <input
                          type="date"
                          className="w-full p-1.5 border rounded bg-white"
                          value={vaccineForm.nextDueDate}
                          onChange={(e) => setVaccineForm({ ...vaccineForm, nextDueDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-orange-500 text-white py-1.5 rounded font-medium hover:bg-orange-600 cursor-pointer">
                      {t('save_shot_btn')}
                    </button>
                  </form>
                )}

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {pet.vaccinations && pet.vaccinations.length > 0 ? (
                    pet.vaccinations.map((vac) => {
                      const dueStatus = checkDueStatus(vac.nextDueDate);
                      return (
                        <div key={vac._id} className="text-xs bg-gray-50 p-2 rounded border border-gray-100 flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-gray-800">{vac.vaccineName}</div>
                            <div className="text-gray-400 text-[11px]">
                              {t('injected_date')}: {new Date(vac.injectedDate).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')}
                            </div>
                            {dueStatus && (
                              <span className={`inline-block mt-1 px-1.5 py-0.5 rounded border text-[10px] font-medium ${dueStatus.color}`}>
                                {dueStatus.label}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => removeVaccination(pet._id, vac._id)}
                            aria-label="Delete vaccine record"
                            className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-gray-400 italic">{t('no_shots')}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          {pets.length === 0 && <p className="text-gray-500">{language === 'vi' ? 'Bạn chưa thêm hồ sơ thú cưng nào.' : "You haven't added any pets yet."}</p>}
        </div>
      )}
    </div>
  );
};

export default PetProfiles;

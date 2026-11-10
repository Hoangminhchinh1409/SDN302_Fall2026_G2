import React, { useEffect, useState } from 'react';
import usePetProfileStore from '../store/usePetProfileStore';
import useAuthStore from '../store/useAuthStore';

const PetProfiles = () => {
  const { pets, fetchPets, addPet, updatePet, removePet, loading, error } = usePetProfileStore();
  const { user } = useAuthStore();

  const [showForm, setShowForm] = useState(false);
  const [editingPetId, setEditingPetId] = useState(null);
  const [formData, setFormData] = useState({ name: '', type: 'Dog', breed: '', age: '', weight: '' });

  useEffect(() => {
    if (user) fetchPets();
  }, [user, fetchPets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = editingPetId
      ? await updatePet(editingPetId, formData)
      : await addPet(formData);
    if (ok) {
      setShowForm(false);
      setEditingPetId(null);
      setFormData({ name: '', type: 'Dog', breed: '', age: '', weight: '' });
    }
  };

  const startEditing = (pet) => {
    setEditingPetId(pet._id);
    setFormData({
      name: pet.name || '',
      type: pet.type || 'Dog',
      breed: pet.breed || '',
      age: pet.age ?? '',
      weight: pet.weight ?? '',
      notes: pet.notes || ''
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingPetId(null);
    setFormData({ name: '', type: 'Dog', breed: '', age: '', weight: '', notes: '' });
  };

  if (!user) return <div className="text-center mt-20 text-xl">Please login to view your pets.</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Pets</h1>
        <button
          onClick={() => {
            if (showForm) closeForm();
            else {
              setEditingPetId(null);
              setFormData({ name: '', type: 'Dog', breed: '', age: '', weight: '', notes: '' });
              setShowForm(true);
            }
          }}
          className="bg-brand-orange text-white px-4 py-2 rounded shadow hover:bg-orange-600"
        >
          {showForm ? 'Cancel' : '+ Add Pet'}
        </button>
      </div>

      {error && <div role="alert" className="bg-red-100 text-red-700 p-3 rounded mb-5">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mb-8 grid grid-cols-2 gap-4 border border-gray-100">
          <h2 className="col-span-2 text-lg font-semibold text-brand-dark">{editingPetId ? 'Edit pet profile' : 'Add a pet'}</h2>
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input required type="text" className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm mb-1">Type</label>
            <select className="w-full border p-2 rounded" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Breed</label>
            <input type="text" className="w-full border p-2 rounded" value={formData.breed} onChange={e => setFormData({ ...formData, breed: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm mb-1">Age (Years)</label>
            <input min="0" type="number" className="w-full border p-2 rounded" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm mb-1">Weight (kg)</label>
            <input min="0" step="0.1" type="number" className="w-full border p-2 rounded" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm mb-1">Notes</label>
            <textarea rows="2" className="w-full border p-2 rounded" value={formData.notes || ''} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
          </div>
          <div className="col-span-2">
            <button type="submit" disabled={loading} className="w-full bg-brand-dark text-white p-2 rounded hover:bg-gray-800 disabled:opacity-60">
              {loading ? 'Saving...' : editingPetId ? 'Save Changes' : 'Save Pet'}
            </button>
          </div>
        </form>
      )}

      {loading && !showForm ? <div>Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pets.map(pet => (
            <div key={pet._id} className="bg-gray-50 border border-gray-200 p-6 rounded-xl relative">
              <button
                type="button"
                aria-label={`Edit ${pet.name}`}
                title="Edit pet"
                onClick={() => startEditing(pet)}
                className="absolute top-4 right-12 text-gray-500 hover:text-brand-orange"
              >
                <i className="fas fa-pen"></i>
              </button>
              <button
                type="button"
                aria-label={`Delete ${pet.name}`}
                title="Delete pet"
                onClick={() => removePet(pet._id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <i className="fas fa-trash"></i>
              </button>
              <h2 className="text-xl font-bold mb-2"><i className={`fas fa-${pet.type.toLowerCase() === 'cat' ? 'cat' : pet.type.toLowerCase() === 'dog' ? 'dog' : 'paw'} text-orange-500 mr-2`}></i> {pet.name}</h2>
              <p className="text-gray-600"><strong>Type:</strong> {pet.type}</p>
              {pet.breed && <p className="text-gray-600"><strong>Breed:</strong> {pet.breed}</p>}
              {pet.age !== undefined && pet.age !== null && <p className="text-gray-600"><strong>Age:</strong> {pet.age} years</p>}
              {pet.weight !== undefined && pet.weight !== null && <p className="text-gray-600"><strong>Weight:</strong> {pet.weight} kg</p>}
              {pet.notes && <p className="text-gray-600 mt-2"><strong>Notes:</strong> {pet.notes}</p>}
            </div>
          ))}
          {pets.length === 0 && <p className="text-gray-500">You haven't added any pets yet.</p>}
        </div>
      )}
    </div>
  );
};

export default PetProfiles;

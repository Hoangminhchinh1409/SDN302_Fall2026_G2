import React, { useEffect, useState } from 'react';
import usePetProfileStore from '../store/usePetProfileStore';
import useAuthStore from '../store/useAuthStore';

const PetProfiles = () => {
  const { pets, fetchPets, addPet, removePet, loading } = usePetProfileStore();
  const { user } = useAuthStore();
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'Dog', breed: '', age: '', weight: '' });

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

  if (!user) return <div className="text-center mt-20 text-xl">Please login to view your pets.</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Pets</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-brand-orange text-white px-4 py-2 rounded shadow hover:bg-orange-600"
        >
          {showForm ? 'Cancel' : '+ Add Pet'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mb-8 grid grid-cols-2 gap-4 border border-gray-100">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input required type="text" className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm mb-1">Type</label>
            <select className="w-full border p-2 rounded" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Breed</label>
            <input type="text" className="w-full border p-2 rounded" value={formData.breed} onChange={e => setFormData({...formData, breed: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm mb-1">Age (Years)</label>
            <input type="number" className="w-full border p-2 rounded" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
          </div>
          <div className="col-span-2">
            <button type="submit" disabled={loading} className="w-full bg-brand-dark text-white p-2 rounded hover:bg-gray-800">
              Save Pet
            </button>
          </div>
        </form>
      )}

      {loading && !showForm ? <div>Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pets.map(pet => (
            <div key={pet._id} className="bg-gray-50 border border-gray-200 p-6 rounded-xl relative">
              <button 
                onClick={() => removePet(pet._id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <i className="fas fa-trash"></i>
              </button>
              <h2 className="text-xl font-bold mb-2"><i className={`fas fa-${pet.type.toLowerCase() === 'cat' ? 'cat' : pet.type.toLowerCase() === 'dog' ? 'dog' : 'paw'} text-orange-500 mr-2`}></i> {pet.name}</h2>
              <p className="text-gray-600"><strong>Type:</strong> {pet.type}</p>
              <p className="text-gray-600"><strong>Breed:</strong> {pet.breed}</p>
              <p className="text-gray-600"><strong>Age:</strong> {pet.age} years</p>
            </div>
          ))}
          {pets.length === 0 && <p className="text-gray-500">You haven't added any pets yet.</p>}
        </div>
      )}
    </div>
  );
};

export default PetProfiles;

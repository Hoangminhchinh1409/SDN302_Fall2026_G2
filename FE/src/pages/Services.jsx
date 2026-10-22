import { useEffect } from 'react';
import useServiceStore from '../store/useServiceStore';

const Services = () => {
  const { services, loading, error, fetchServices } = useServiceStore();

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Pet Spa & <span className="text-orange-500">Grooming</span>
          </h1>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
            Book professional grooming and care services for your beloved pets. We provide top-notch facilities and experienced staff.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center my-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service._id} className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition duration-500 hover:scale-105">
                <div className="p-8">
                  <div className="uppercase tracking-wide text-sm text-orange-500 font-semibold">Service</div>
                  <h2 className="block mt-1 text-2xl leading-tight font-bold text-black">{service.name}</h2>
                  <p className="mt-2 text-gray-500">{service.description}</p>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">${service.price}</p>
                      <p className="text-sm text-gray-500">{service.durationMinutes} mins</p>
                    </div>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 shadow-md">
                      Book Now
                    </button>
                  </div>
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

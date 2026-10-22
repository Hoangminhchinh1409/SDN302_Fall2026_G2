import { useEffect } from 'react';
import useWishlistStore from '../store/useWishlistStore';
import useAuthStore from '../store/useAuthStore';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { wishlist, fetchWishlist, removeFromWishlist, loading } = useWishlistStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user, fetchWishlist]);

  if (!user) return <div className="text-center mt-20 text-xl font-bold">Please login to view your wishlist.</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Wishlist</h1>
      {loading ? (
        <div>Loading...</div>
      ) : wishlist.length === 0 ? (
        <div className="text-gray-500">Your wishlist is empty.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item._id} className="border rounded-lg p-4 shadow-sm relative">
              <button 
                onClick={() => removeFromWishlist(item._id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                X
              </button>
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-md mb-4"/>
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-orange-500 font-bold">${item.price}</p>
              <Link to={`/product/${item._id}`} className="mt-4 block w-full text-center bg-gray-900 text-white py-2 rounded">
                View Product
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

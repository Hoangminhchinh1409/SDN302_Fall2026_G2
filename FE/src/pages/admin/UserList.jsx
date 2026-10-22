import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setDeleteLoading(true);
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting user');
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const updateRoleHandler = async (id, role) => {
    try {
      await api.put(`/users/${id}/role`, { role });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating user role');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Users</h2>
      </div>

      {isLoading || deleteLoading ? (
        <div className="text-center py-10">Loading users...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
                  <th className="p-4 font-medium">STT</th>
                  <th className="p-4 font-medium">NAME</th>
                  <th className="p-4 font-medium">EMAIL</th>
                  <th className="p-4 font-medium">ROLE</th>
                  <th className="p-4 font-medium text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {users.map((user, index) => (
                  <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-500">{index + 1}</td>
                    <td className="p-4 font-medium text-brand-dark">{user.name}</td>
                    <td className="p-4">
                      <a href={`mailto:${user.email}`} className="text-brand-orange hover:underline">{user.email}</a>
                    </td>
                    <td className="p-4">
                      {user.role === 'admin' ? (
                        <span className="bg-red-50 text-red-700 border border-red-200 rounded px-2 py-1 text-xs font-medium">Admin</span>
                      ) : (
                        <select 
                          className={`border rounded px-2 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange ${
                            user.role === 'staff' ? 'bg-blue-50 text-blue-700 border-blue-200' 
                            : 'bg-green-50 text-green-700 border-green-200'
                          }`}
                          value={user.role}
                          onChange={(e) => updateRoleHandler(user._id, e.target.value)}
                        >
                          <option value="customer">Customer</option>
                          <option value="staff">Staff</option>
                        </select>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => deleteHandler(user._id)}
                        className="bg-red-50 text-red-500 px-3 py-1.5 rounded hover:bg-red-100 transition-colors"
                        disabled={user.role === 'admin'}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;

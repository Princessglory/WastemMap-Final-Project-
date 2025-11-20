import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
  });
  const [recentPickups, setRecentPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { apiClient, currentUser } = useAuth();

  useEffect(() => {
    fetchPickups();
  }, []);

  const fetchPickups = async () => {
    try {
      console.log('Fetching pickups for user:', currentUser?.id);
      const response = await apiClient.get('/api/pickups/my-pickups');
      const pickups = response.data;

      console.log('Received pickups:', pickups);

      setStats({
        total: pickups.length,
        pending: pickups.filter(p => p.status === 'pending').length,
        completed: pickups.filter(p => p.status === 'completed').length,
      });

      setRecentPickups(pickups.slice(0, 5));
      setError('');
    } catch (error) {
      console.error('Error fetching pickups:', error);
      setError('Failed to load pickup history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Link to="/request-pickup" className="btn-primary">
            Request New Pickup
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Requests</h3>
            <div className="text-3xl font-bold text-green-600">{stats.total}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending</h3>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Completed</h3>
            <div className="text-3xl font-bold text-blue-600">{stats.completed}</div>
          </div>
        </div>

        {/* Recent Pickups */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Recent Pickup Requests</h2>
          </div>
          
          {recentPickups.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">No pickup requests yet.</p>
              <Link to="/request-pickup" className="btn-primary">
                Make Your First Request
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {recentPickups.map(pickup => (
                <div key={pickup._id} className="p-6 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-900 capitalize">
                      {pickup.wasteType} - {pickup.quantity}
                    </h4>
                    <p className="text-gray-600 mt-1">
                      {pickup.address.street}, {pickup.address.city}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Scheduled: {new Date(pickup.scheduledDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    {getStatusBadge(pickup.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

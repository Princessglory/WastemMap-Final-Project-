import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCollectors: 0,
    totalPickups: 0,
    completedPickups: 0,
    pendingPickups: 0,
  });
  const [allPickups, setAllPickups] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { apiClient } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [pickupsResponse, usersResponse] = await Promise.all([
        apiClient.get('/api/pickups?limit=100'),
        apiClient.get('/api/admin/users'),
      ]);

      const pickups = pickupsResponse.data.pickups || pickupsResponse.data;
      const users = usersResponse.data;

      // Calculate statistics
      const totalUsers = users.length;
      const totalCollectors = users.filter(user => user.role === 'collector').length;
      const totalPickups = pickups.length;
      const completedPickups = pickups.filter(p => p.status === 'completed').length;
      const pendingPickups = pickups.filter(p => p.status === 'pending' || p.status === 'assigned').length;

      setStats({
        totalUsers,
        totalCollectors,
        totalPickups,
        completedPickups,
        pendingPickups,
      });

      setAllPickups(pickups);
      setAllUsers(users);
      
      // Generate recent activity (last 10 pickups)
      setRecentActivity(pickups.slice(0, 10));

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await apiClient.put(`/api/admin/users/${userId}/role`, { role: newRole });
      alert('User role updated successfully!');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role.');
    }
  };

  const handleUpdatePickupStatus = async (pickupId, newStatus) => {
    try {
      await apiClient.patch(`/api/pickups/${pickupId}/status`, { status: newStatus });
      alert('Pickup status updated successfully!');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating pickup status:', error);
      alert('Failed to update pickup status.');
    }
  };

  const handleAssignCollector = async (pickupId, collectorId) => {
    try {
      await apiClient.patch(`/api/pickups/${pickupId}/assign`, { collectorId });
      alert('Collector assigned successfully!');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error assigning collector:', error);
      alert('Failed to assign collector.');
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
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('-', ' ')}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleClasses = {
      admin: 'bg-red-100 text-red-800',
      collector: 'bg-blue-100 text-blue-800',
      user: 'bg-green-100 text-green-800',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleClasses[role] || 'bg-gray-100 text-gray-800'}`}>
        {role}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage users, collectors, and monitor all waste pickup activities
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
            <div className="text-gray-600">Total Users</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-green-600">{stats.totalCollectors}</div>
            <div className="text-gray-600">Collectors</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-purple-600">{stats.totalPickups}</div>
            <div className="text-gray-600">Total Pickups</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingPickups}</div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-gray-600">{stats.completedPickups}</div>
            <div className="text-gray-600">Completed</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="border-b">
            <nav className="flex -mb-px">
              {[
                { id: 'overview', name: 'Overview' },
                { id: 'pickups', name: 'All Pickups' },
                { id: 'users', name: 'User Management' },
                { id: 'collectors', name: 'Collectors' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivity.map((pickup) => (
                    <div key={pickup._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-sm">♻️</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {pickup.user?.name} requested {pickup.wasteType} pickup
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(pickup.createdAt)} • {pickup.address.city}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(pickup.status)}
                        {pickup.assignedCollector && (
                          <span className="text-sm text-gray-500">
                            → {pickup.assignedCollector.name}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Pickups Tab */}
            {activeTab === 'pickups' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">All Pickup Requests</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Waste Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Collector
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allPickups.map((pickup) => (
                        <tr key={pickup._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{pickup.user?.name}</div>
                            <div className="text-sm text-gray-500">{pickup.user?.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 capitalize">{pickup.wasteType}</div>
                            <div className="text-sm text-gray-500">{pickup.quantity}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{pickup.address.city}</div>
                            <div className="text-sm text-gray-500">{pickup.address.street}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(pickup.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {pickup.assignedCollector?.name || 'Unassigned'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <select
                                onChange={(e) => handleUpdatePickupStatus(pickup._id, e.target.value)}
                                value={pickup.status}
                                className="text-sm border rounded px-2 py-1"
                              >
                                <option value="pending">Pending</option>
                                <option value="assigned">Assigned</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* User Management Tab */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">User Management</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allUsers.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.phone || 'No phone'}</div>
                            <div className="text-sm text-gray-500">
                              {user.address ? `${user.address.city}, ${user.address.state}` : 'No address'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getRoleBadge(user.role)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <select
                              onChange={(e) => handleUpdateUserRole(user._id, e.target.value)}
                              value={user.role}
                              className="text-sm border rounded px-2 py-1"
                            >
                              <option value="user">User</option>
                              <option value="collector">Collector</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Collectors Tab */}
            {activeTab === 'collectors' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Collector Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allUsers
                    .filter(user => user.role === 'collector')
                    .map((collector) => {
                      const collectorPickups = allPickups.filter(
                        pickup => pickup.assignedCollector?._id === collector._id
                      );
                      const completedCount = collectorPickups.filter(p => p.status === 'completed').length;
                      const inProgressCount = collectorPickups.filter(p => p.status === 'in-progress').length;

                      return (
                        <div key={collector._id} className="bg-white p-6 rounded-lg shadow-sm border">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold">
                                {collector.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{collector.name}</h3>
                              <p className="text-sm text-gray-500">{collector.email}</p>
                              <p className="text-sm text-gray-500">{collector.phone}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div className="text-center">
                              <div className="font-semibold text-green-600">{completedCount}</div>
                              <div className="text-gray-500">Completed</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-blue-600">{inProgressCount}</div>
                              <div className="text-gray-500">In Progress</div>
                            </div>
                          </div>

                          <div className="text-center">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {collectorPickups.length} total assignments
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

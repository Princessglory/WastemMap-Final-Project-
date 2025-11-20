import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const CollectorDashboard = () => {
  const [assignedPickups, setAssignedPickups] = useState([]);
  const [availablePickups, setAvailablePickups] = useState([]);
  const [completedPickups, setCompletedPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assigned');
  const { apiClient, currentUser } = useAuth();

  useEffect(() => {
    fetchPickups();
  }, []);

  const fetchPickups = async () => {
    try {
      setLoading(true);
      
      // Fetch all pickups (collectors can see all pending/assigned pickups)
      const response = await apiClient.get('/api/pickups');
      const allPickups = response.data.pickups || response.data;

      console.log('All pickups:', allPickups);

      // Filter pickups based on status and assignment
      const assigned = allPickups.filter(pickup => 
        pickup.assignedCollector?._id === currentUser.id && pickup.status !== 'completed'
      );
      
      const available = allPickups.filter(pickup => 
        (!pickup.assignedCollector || pickup.assignedCollector._id !== currentUser.id) && 
        pickup.status === 'pending'
      );
      
      const completed = allPickups.filter(pickup => 
        pickup.assignedCollector?._id === currentUser.id && pickup.status === 'completed'
      );

      setAssignedPickups(assigned);
      setAvailablePickups(available);
      setCompletedPickups(completed);
      
    } catch (error) {
      console.error('Error fetching pickups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToMe = async (pickupId) => {
    try {
      await apiClient.patch(`/api/pickups/${pickupId}/assign`, {
        collectorId: currentUser.id
      });
      
      // Refresh the pickups list
      fetchPickups();
      alert('Pickup assigned to you successfully!');
    } catch (error) {
      console.error('Error assigning pickup:', error);
      alert('Failed to assign pickup. Please try again.');
    }
  };

  const handleUpdateStatus = async (pickupId, newStatus) => {
    try {
      const updateData = { status: newStatus };
      
      // If completing, add actual duration
      if (newStatus === 'completed') {
        const actualDuration = prompt('Enter actual duration in minutes:');
        if (actualDuration) {
          updateData.actualDuration = parseInt(actualDuration);
        }
      }

      await apiClient.patch(`/api/pickups/${pickupId}/status`, updateData);
      
      // Refresh the pickups list
      fetchPickups();
      alert(`Status updated to ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
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
        {status.replace('-', ' ')}
      </span>
    );
  };

  const getActionButtons = (pickup, tab) => {
    if (tab === 'available') {
      return (
        <button
          onClick={() => handleAssignToMe(pickup._id)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Assign to Me
        </button>
      );
    }

    if (tab === 'assigned') {
      return (
        <div className="flex space-x-2">
          {pickup.status === 'assigned' && (
            <button
              onClick={() => handleUpdateStatus(pickup._id, 'in-progress')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Start Pickup
            </button>
          )}
          {pickup.status === 'in-progress' && (
            <button
              onClick={() => handleUpdateStatus(pickup._id, 'completed')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Complete
            </button>
          )}
          <button
            onClick={() => handleUpdateStatus(pickup._id, 'cancelled')}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      );
    }

    return null;
  };

  const renderPickupCard = (pickup, tab) => (
    <div key={pickup._id} className="bg-white rounded-lg shadow-sm border p-6 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-3">
            <h3 className="text-lg font-semibold text-gray-900 capitalize">
              {pickup.wasteType} - {pickup.quantity}
            </h3>
            {getStatusBadge(pickup.status)}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <strong>Location:</strong> 
              <p>{pickup.address.street}, {pickup.address.city}</p>
              <p>{pickup.address.state} {pickup.address.zipCode}</p>
            </div>
            
            <div>
              <strong>Customer:</strong>
              <p>{pickup.user?.name || 'N/A'}</p>
              <p>{pickup.user?.phone || 'No phone'}</p>
            </div>
            
            <div>
              <strong>Scheduled:</strong>
              <p>{new Date(pickup.scheduledDate).toLocaleString()}</p>
            </div>
            
            <div>
              <strong>Description:</strong>
              <p className="truncate">{pickup.description || 'No description'}</p>
            </div>
          </div>
        </div>
        
        <div className="ml-4">
          {getActionButtons(pickup, tab)}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading collector dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Collector Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage waste pickup assignments and track your progress
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-blue-600">{assignedPickups.length}</div>
            <div className="text-gray-600">Assigned</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-green-600">{availablePickups.length}</div>
            <div className="text-gray-600">Available</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-purple-600">
              {assignedPickups.filter(p => p.status === 'in-progress').length}
            </div>
            <div className="text-gray-600">In Progress</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-gray-600">{completedPickups.length}</div>
            <div className="text-gray-600">Completed</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b">
            <nav className="flex -mb-px">
              {[
                { id: 'assigned', name: `Assigned to Me (${assignedPickups.length})` },
                { id: 'available', name: `Available Pickups (${availablePickups.length})` },
                { id: 'completed', name: `Completed (${completedPickups.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Assigned Pickups */}
            {activeTab === 'assigned' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Pickups Assigned to You</h2>
                {assignedPickups.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No pickups assigned to you yet.</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Check the "Available Pickups" tab to assign yourself some work.
                    </p>
                  </div>
                ) : (
                  assignedPickups.map(pickup => renderPickupCard(pickup, 'assigned'))
                )}
              </div>
            )}

            {/* Available Pickups */}
            {activeTab === 'available' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Pickups</h2>
                {availablePickups.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No available pickups at the moment.</p>
                    <p className="text-gray-400 text-sm mt-2">
                      New pickup requests will appear here as users create them.
                    </p>
                  </div>
                ) : (
                  availablePickups.map(pickup => renderPickupCard(pickup, 'available'))
                )}
              </div>
            )}

            {/* Completed Pickups */}
            {activeTab === 'completed' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Completed Pickups</h2>
                {completedPickups.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No completed pickups yet.</p>
                  </div>
                ) : (
                  completedPickups.map(pickup => renderPickupCard(pickup, 'completed'))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectorDashboard;

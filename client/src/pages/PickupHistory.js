import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const PickupHistory = () => {
  const [pickups, setPickups] = useState([]);
  const [filteredPickups, setFilteredPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { apiClient } = useAuth();

  useEffect(() => {
    fetchPickupHistory();
  }, []);

  useEffect(() => {
    filterPickups();
  }, [pickups, filter, searchTerm]);

  const fetchPickupHistory = async () => {
    try {
      const response = await apiClient.get('/api/pickups/my-pickups');
      const pickupData = response.data;
      
      setPickups(pickupData);
    } catch (error) {
      console.error('Error fetching pickup history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPickups = () => {
    let filtered = [...pickups];

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(pickup => pickup.status === filter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(pickup =>
        pickup.wasteType.toLowerCase().includes(term) ||
        pickup.address.street.toLowerCase().includes(term) ||
        pickup.address.city.toLowerCase().includes(term) ||
        (pickup.description && pickup.description.toLowerCase().includes(term))
      );
    }

    setFilteredPickups(filtered);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-amber-50 text-amber-800 border border-amber-200',
      assigned: 'bg-blue-50 text-blue-800 border border-blue-200',
      'in-progress': 'bg-purple-50 text-purple-800 border border-purple-200',
      completed: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
      cancelled: 'bg-red-50 text-red-800 border border-red-200',
    };
    
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusClasses[status] || 'bg-gray-50 text-gray-800 border border-gray-200'}`}>
        {status.replace('-', ' ')}
      </span>
    );
  };

  const getWasteTypeIcon = (wasteType) => {
    const icons = {
      plastic: '🥤',
      paper: '📄',
      glass: '🍶',
      metal: '🥫',
      organic: '🍎',
      electronic: '🔌',
      other: '🗑️'
    };
    return icons[wasteType] || '🗑️';
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

  const calculateDuration = (scheduledDate, completedDate) => {
    if (!completedDate) return 'N/A';
    
    const scheduled = new Date(scheduledDate);
    const completed = new Date(completedDate);
    const diffMs = completed - scheduled;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading pickup history...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Enhanced Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Pickup History
          </h1>
          <p className="text-gray-600 mt-3 text-lg">
            Track your environmental impact and manage waste pickup requests
          </p>
        </div>

        {/* Enhanced Filters and Search */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-lg border border-green-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'assigned', 'in-progress', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    filter === status
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-green-300 hover:text-green-700 hover:shadow-md'
                  }`}
                >
                  {status === 'all' ? 'All Pickups' : status.replace('-', ' ')}
                </button>
              ))}
            </div>
            
            <div className="flex-1 md:max-w-sm">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by waste type, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { count: pickups.length, label: 'Total Pickups', color: 'bg-gradient-to-r from-blue-500 to-blue-600', icon: '📊' },
            { count: pickups.filter(p => p.status === 'completed').length, label: 'Completed', color: 'bg-gradient-to-r from-emerald-500 to-emerald-600', icon: '✅' },
            { count: pickups.filter(p => p.status === 'pending' || p.status === 'assigned').length, label: 'Active', color: 'bg-gradient-to-r from-amber-500 to-amber-600', icon: '🔄' },
            { count: pickups.filter(p => p.status === 'cancelled').length, label: 'Cancelled', color: 'bg-gradient-to-r from-red-500 to-red-600', icon: '❌' },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className={`${stat.color} p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{stat.count}</div>
                  <div className="text-2xl">{stat.icon}</div>
                </div>
              </div>
              <div className="p-4">
                <div className="text-sm font-semibold text-gray-700">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Pickups List */}
        <div className="space-y-6">
          {filteredPickups.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🗑️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {pickups.length === 0 ? 'No Pickup History Yet' : 'No Matching Pickups Found'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
                {pickups.length === 0 
                  ? "Start your sustainable journey by requesting your first waste pickup. Track your environmental impact here!"
                  : "Try adjusting your search terms or filters. Every pickup request helps create cleaner communities."
                }
              </p>
              {pickups.length === 0 && (
                <a
                  href="/request-pickup"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg shadow-green-200 hover:shadow-xl transition-all duration-200"
                >
                  <span>♻️</span>
                  Request First Pickup
                </a>
              )}
            </div>
          ) : (
            filteredPickups.map((pickup) => (
              <div key={pickup._id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Left Section - Basic Info */}
                  <div className="flex-1">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-green-100">
                        {getWasteTypeIcon(pickup.wasteType)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-bold text-gray-900 capitalize">
                            {pickup.wasteType} Waste - {pickup.quantity}
                          </h3>
                          {getStatusBadge(pickup.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <strong className="text-gray-700 block mb-1">📍 Location:</strong>
                            <p>{pickup.address.street}, {pickup.address.city}</p>
                            <p>{pickup.address.state} {pickup.address.zipCode}</p>
                          </div>
                          
                          <div>
                            <strong className="text-gray-700 block mb-1">📅 Schedule:</strong>
                            <p>Scheduled: {formatDate(pickup.scheduledDate)}</p>
                            {pickup.completedDate && (
                              <p>Completed: {formatDate(pickup.completedDate)}</p>
                            )}
                          </div>

                          {pickup.assignedCollector && (
                            <div>
                              <strong className="text-gray-700 block mb-1">👤 Collector:</strong>
                              <p>{pickup.assignedCollector.name}</p>
                              <p>{pickup.assignedCollector.phone}</p>
                            </div>
                          )}

                          {pickup.actualDuration && (
                            <div>
                              <strong className="text-gray-700 block mb-1">⏱️ Duration:</strong>
                              <p>{pickup.actualDuration} minutes</p>
                            </div>
                          )}
                        </div>

                        {pickup.description && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <strong className="text-gray-700 block mb-1">📝 Description:</strong>
                            <p className="text-gray-600">{pickup.description}</p>
                          </div>
                        )}

                        {pickup.rating && (
                          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                            <strong className="text-gray-700 block mb-1">⭐ Your Rating:</strong>
                            <div className="flex items-center space-x-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-lg ${
                                    i < pickup.rating.score ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                              <span className="text-sm text-gray-600 ml-2">
                                ({pickup.rating.score}/5)
                              </span>
                            </div>
                            {pickup.rating.comment && (
                              <p className="text-gray-600 mt-2">"{pickup.rating.comment}"</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Actions and Timeline */}
                  <div className="lg:w-48 flex flex-col space-y-4">
                    <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                      <strong>Created:</strong><br/>
                      {formatDate(pickup.createdAt)}
                    </div>
                    
                    {pickup.status === 'completed' && !pickup.rating && (
                      <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-yellow-200">
                        ⭐ Rate Service
                      </button>
                    )}
                    
                    {pickup.status === 'pending' && (
                      <button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-red-200">
                        🗑️ Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PickupHistory;

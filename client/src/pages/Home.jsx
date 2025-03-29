import React from 'react';

const Home = () => {
  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Today's Orders */}
        <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-lg font-medium text-gray-600 mb-3">Today's Orders</h2>
          <div className="text-4xl font-bold text-swiggy">0</div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-lg font-medium text-gray-600 mb-3">Total Revenue</h2>
          <div className="text-4xl font-bold text-swiggy">₹0.00</div>
        </div>

        {/* Active Tables */}
        <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-lg font-medium text-gray-600 mb-3">Active Tables</h2>
          <div className="text-4xl font-bold text-swiggy">0</div>
        </div>
      </div>
    </div>
  );
};

export default Home; 
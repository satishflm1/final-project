import React from 'react';

const Dashboard = () => {
    return (
        <div className="content-container">
            <h1 className="text-3xl font-bold mb-8 text-[#3d4152]">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Today's Orders */}
                <div className="dashboard-card hover:shadow-lg transition-shadow">
                    <h2 className="text-lg font-medium text-[#686b78] mb-3">Today's Orders</h2>
                    <div className="dashboard-number">0</div>
                    <div className="dashboard-label">Total Orders</div>
                </div>

                {/* Total Revenue */}
                <div className="dashboard-card hover:shadow-lg transition-shadow">
                    <h2 className="text-lg font-medium text-[#686b78] mb-3">Total Revenue</h2>
                    <div className="dashboard-number">₹0.00</div>
                    <div className="dashboard-label">Today's Revenue</div>
                </div>

                {/* Active Tables */}
                <div className="dashboard-card hover:shadow-lg transition-shadow">
                    <h2 className="text-lg font-medium text-[#686b78] mb-3">Active Tables</h2>
                    <div className="dashboard-number">0</div>
                    <div className="dashboard-label">Tables in Use</div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 
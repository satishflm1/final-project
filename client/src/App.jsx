import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Tables from './pages/Tables';
import Dishes from './pages/Dishes';
import Categories from './pages/Categories';
import TakeAway from './pages/TakeAway';
import DineIn from './pages/DineIn';
import TableOrder from './pages/TableOrder';
import BillDetails from './pages/BillDetails';
import Payment from './pages/Payment';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-[#f1f1f6]">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/tables" element={<Tables />} />
                        <Route path="/dishes" element={<Dishes />} />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/takeaway" element={<TakeAway />} />
                        <Route path="/dinein" element={<DineIn />} />
                        <Route path="/table/:tableId" element={<TableOrder />} />
                        <Route path="/bill/:orderId" element={<BillDetails />} />
                        <Route path="/payment/:orderId" element={<Payment />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App; 
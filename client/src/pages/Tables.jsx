
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '../components/Modal';

const API_BASE_URL = 'http://3.110.210.194';
const FRONTEND_BASE_URL = 'http://3.109.143.125:8080';

const TableManagementPage = () => {
  const [tables, setTables] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTable, setNewTable] = useState({ number: '', capacity: '' });
  const [error, setError] = useState(null);
  const [showQRCode, setShowQRCode] = useState(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tables`);
      setTables(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching tables:', error);
      setError('Failed to fetch tables');
    }
  };

  const handleAddTable = async () => {
    try {
      if (!newTable.number || !newTable.capacity) {
        toast.error('Table number and capacity are required');
        return;
      }
      
      if (parseInt(newTable.capacity) <= 0) {
        toast.error('Capacity must be greater than 0');
        return;
      }

      await axios.post(`${API_BASE_URL}/api/tables`, {
        table_number: newTable.number,
        capacity: parseInt(newTable.capacity)
      });
      
      setShowAddModal(false);
      setNewTable({ number: '', capacity: '' });
      await fetchTables();
      toast.success('Table added successfully');
    } catch (error) {
      console.error('Error adding table:', error);
      toast.error(error.response?.data?.message || 'Failed to add table');
    }
  };

  const handleDeleteTable = async (tableId) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/tables/${tableId}`);
        fetchTables();
      } catch (error) {
        console.error('Error deleting table:', error);
        alert('Failed to delete table');
      }
    }
  };

  const handleStatusChange = async (tableId, newStatus) => {
    try {
      const table = tables.find(t => t.id === tableId);
      if (!table) return;

      await axios.put(`${API_BASE_URL}/api/tables/${tableId}`, {
        number: table.number,
        capacity: table.capacity,
        status: newStatus
      });
      fetchTables();
    } catch (error) {
      console.error('Error updating table status:', error);
      toast.error('Failed to update table status');
    }
  };

  const handleResetAllTables = async () => {
    if (window.confirm('Are you sure you want to reset all tables to available status?')) {
      try {
        await axios.post(`${API_BASE_URL}/api/tables/reset`);
        fetchTables();
      } catch (error) {
        console.error('Error resetting tables:', error);
        setError('Failed to reset tables');
      }
    }
  };

  return (
    <div className="p-6 bg-[#f1f1f6]">
      <ToastContainer position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#3d4152]">Tables</h1>
        <div className="flex gap-4">
          <button
            onClick={handleResetAllTables}
            className="px-4 py-2 text-[#FC8019] bg-white border border-[#FC8019] rounded-lg hover:bg-[#fff8f3] transition-colors"
          >
            Reset All Tables
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#FC8019] text-white px-4 py-2 rounded-lg hover:bg-[#FE9A3E] transition-colors"
          >
            Add New Table
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <div
            key={table.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#3d4152]">Table {table.number}</h3>
                  <p className="text-[#686b78] mt-1">Capacity: {table.capacity} seats</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTable(table.id);
                  }}
                  className="text-red-500 hover:text-red-600 text-sm font-medium"
                >
                  Delete
                </button>
              </div>

              <div className="flex space-x-2 mb-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(table.id, 'available');
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    table.status === 'available'
                      ? 'bg-[#e9f7ef] text-[#2ecc71]'
                      : 'bg-gray-50 text-[#686b78] hover:bg-gray-100'
                  }`}
                >
                  Available
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(table.id, 'occupied');
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    table.status === 'occupied'
                      ? 'bg-[#ffeaea] text-[#ff4646]'
                      : 'bg-gray-50 text-[#686b78] hover:bg-gray-100'
                  }`}
                >
                  Occupied
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(table.id, 'reserved');
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    table.status === 'reserved'
                      ? 'bg-[#fff4e5] text-[#ffa700]'
                      : 'bg-gray-50 text-[#686b78] hover:bg-gray-100'
                  }`}
                >
                  Reserved
                </button>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQRCode(table.id);
                }}
                className="w-full py-2 text-[#FC8019] bg-white border border-[#FC8019] rounded-lg hover:bg-[#fff8f3] transition-colors text-sm font-medium"
              >
                View QR Code
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Table Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Table"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#3d4152] mb-1">Table Number</label>
            <input
              type="text"
              value={newTable.number}
              onChange={(e) => setNewTable({ ...newTable, number: e.target.value })}
              className="block w-full rounded-lg border-gray-200 shadow-sm focus:ring-[#FC8019] focus:border-[#FC8019] text-[#3d4152]"
              placeholder="e.g., T1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3d4152] mb-1">Capacity</label>
            <input
              type="number"
              value={newTable.capacity}
              onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })}
              className="block w-full rounded-lg border-gray-200 shadow-sm focus:ring-[#FC8019] focus:border-[#FC8019] text-[#3d4152]"
              min="1"
              placeholder="Number of seats"
            />
          </div>
          <button
            onClick={handleAddTable}
            className="w-full bg-[#FC8019] text-white py-2 px-4 rounded-lg hover:bg-[#FE9A3E] transition-colors font-medium"
          >
            Add Table
          </button>
        </div>
      </Modal>

      {/* QR Code Modal */}
      <Modal
        isOpen={showQRCode !== null}
        onClose={() => setShowQRCode(null)}
        title="Table QR Code"
      >
        <div className="text-center p-4">
          <QRCodeSVG
            value={`${FRONTEND_BASE_URL}/table/${showQRCode}`}
            size={200}
            className="mx-auto mb-4"
            level="H"
            includeMargin={true}
            imageSettings={{
              src: "/logo.png",
              height: 24,
              width: 24,
              excavate: true,
            }}
          />
          <p className="text-[#686b78] mb-4">Scan this QR code to access the table menu</p>
          <div className="text-left bg-[#fff8f3] p-4 rounded-lg border border-[#FC8019] text-sm">
            <p className="font-medium text-[#3d4152] mb-2">Payment Instructions:</p>
            <ol className="list-decimal list-inside text-[#686b78] space-y-1">
              <li>Scan QR code above</li>
              <li>Open any UPI app</li>
              <li>Enter UPI ID: RaViS_Restaurant_PoS@ybl</li>
              <li>Enter amount and pay</li>
            </ol>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TableManagementPage; 

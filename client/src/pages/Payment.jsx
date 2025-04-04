import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://15.207.252.191';

const Payment = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upiId] = useState('8484843035@ybl');

  const fetchOrderDetails = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-500 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Order not found!</strong>
          <span className="block sm:inline"> Please check your order ID and try again.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-center mb-8">Payment Details</h2>
          
          {/* Order Summary */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-medium">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-medium">₹{Number(order.total_amount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Pay using UPI</h3>
            <div className="border rounded-lg p-4 text-center">
              <p className="text-gray-600 mb-2">Scan using any UPI app</p>
              <div className="font-medium mb-4">{upiId}</div>
              <div className="space-x-4">
                <img src="/phonepe-logo.png" alt="PhonePe" className="h-8 inline-block" />
                <img src="/gpay-logo.png" alt="Google Pay" className="h-8 inline-block" />
                <img src="/paytm-logo.png" alt="Paytm" className="h-8 inline-block" />
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">How to pay:</h4>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
              <li>Open your UPI payment app</li>
              <li>Select "Pay by UPI ID/VPA"</li>
              <li>Enter UPI ID: {upiId}</li>
              <li>Enter amount: ₹{Number(order.total_amount).toFixed(2)}</li>
              <li>Verify merchant name and complete payment</li>
            </ol>
          </div>

          {/* Support */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Having trouble? Contact support:</p>
            <p className="font-medium">+91 1234567890</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment; 


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const API_BASE_URL = 'http://15.207.252.191';
const FRONTEND_BASE_URL = 'http://15.207.252.191:3000';

const DineIn = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tablesRes, categoriesRes, dishesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/tables`),
        axios.get(`${API_BASE_URL}/api/categories`),
        axios.get(`${API_BASE_URL}/api/dishes`)
      ]);

      setTables(tablesRes.data);
      setCategories(categoriesRes.data);
      setDishes(dishesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
      setLoading(false);
    }
  };

  const handleTableSelect = (table) => {
    if (table.status === 'reserved') {
      toast.warning('This table is reserved');
      return;
    }
    if (table.status === 'occupied') {
      toast.warning('This table is already occupied');
      return;
    }
    setSelectedTable(table);
    setCart([]);
  };

  const addToCart = (dish) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === dish.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...dish, quantity: 1 }];
    });
  };

  const updateQuantity = (dishId, quantity) => {
    if (quantity < 1) {
      removeFromCart(dishId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === dishId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (dishId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== dishId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    if (!selectedTable) {
      alert('Please select a table first');
      return;
    }

    if (cart.length === 0) {
      alert('Please add items to your order');
      return;
    }

    try {
      const orderData = {
        table_id: selectedTable.id,
        customer_name: 'Guest',
        order_type: 'dine_in',
        items: cart.map(item => ({
          dish_id: item.id,
          quantity: item.quantity,
          price: item.price,
          notes: ''
        })),
        total_amount: calculateTotal()
      };

      const response = await axios.post(`${API_BASE_URL}/api/orders`, orderData);
      setOrderId(response.data.id);
      alert('Order placed successfully!');
      setCart([]);
      setSelectedTable(null);
      fetchData(); // Refresh table status
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  const handleDownloadBill = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/orders/${orderId}/bill`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bill-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating bill:', error);
      alert('Failed to generate bill');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  if (orderId) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-6">Scan the QR code below to view your bill details</p>
          <div className="flex justify-center mb-6">
            <QRCodeSVG
              value={`${FRONTEND_BASE_URL}/payment/${orderId}`}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="text-gray-600 mb-4">Scan to pay for your order</p>
          <div className="flex space-x-4">
            <button
              onClick={handleDownloadBill}
              className="flex-1 bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
            >
              Download Bill
            </button>
            <button
              onClick={() => {
                setOrderId(null);
                setSelectedTable(null);
                fetchData();
              }}
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              New Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ToastContainer position="top-right" />
      <h1 className="text-2xl font-bold mb-6">Dine-In Orders</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-500 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {!selectedTable && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Table</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tables.map((table) => (
              <div
                key={table.id}
                onClick={() => handleTableSelect(table)}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  table.status === 'available'
                    ? 'bg-white hover:bg-gray-50 border-2 border-green-500'
                    : table.status === 'reserved'
                    ? 'bg-white hover:bg-gray-50 border-2 border-yellow-500'
                    : 'bg-white hover:bg-gray-50 border-2 border-red-500'
                }`}
              >
                <h3 className="text-lg font-semibold">Table {table.number}</h3>
                <p className="text-gray-600">Capacity: {table.capacity}</p>
                <span
                  className={`inline-block px-2 py-1 mt-2 text-xs font-medium rounded-full ${
                    table.status === 'available'
                      ? 'bg-green-100 text-green-800'
                      : table.status === 'reserved'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTable && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              Selected: Table {selectedTable.number} (Capacity: {selectedTable.capacity})
            </h2>
            <button
              onClick={() => setSelectedTable(null)}
              className="text-gray-600 hover:text-gray-800"
            >
              Change Table
            </button>
          </div>

          {/* Categories and Menu Items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              {categories.map(category => (
                <div key={category.id} className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">{category.name}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {dishes
                      .filter(dish => dish.category_id === category.id)
                      .map(dish => (
                        <div
                          key={dish.id}
                          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                        >
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium">{dish.name}</h4>
                              <p className="text-gray-600 text-sm">{dish.description}</p>
                              <p className="text-primary-600 font-medium mt-2">₹{dish.price}</p>
                            </div>
                            <button
                              onClick={() => addToCart(dish)}
                              className="bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Cart */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-fit sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              {cart.length === 0 ? (
                <p className="text-gray-600">No items in cart</p>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-gray-600">₹{item.price} x {item.quantity}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-800 ml-2"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>₹{calculateTotal()}</span>
                    </div>
                    <button
                      onClick={handlePlaceOrder}
                      className="w-full bg-primary-600 text-white py-2 rounded mt-4 hover:bg-primary-700"
                    >
                      Place Order
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DineIn; 

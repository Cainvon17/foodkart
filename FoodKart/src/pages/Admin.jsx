import { useState, useEffect } from "react";
import axios from "axios";
import toast, {Toaster} from 'react-hot-toast';
import { FaBoxOpen, FaSync } from 'react-icons/fa';

export default function Admin(){
    const [orders,setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchOrders = async () => {
        try {
            const result = await axios.get('http://localhost:5000/orders');
            setOrders(result.data);
            setLoading(false);
        } catch (err) {
            toast.error("Failed to load orders");
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    },[]);

    const handleStatus = async (id,newStatus) => {
        try {
            const updateOrders = orders.map(order =>
                order.id === id ? {...order, status: newStatus} : order
            );
            setOrders(updateOrders);

            await axios.put(`http://localhost:5000/orders/${id}`,{status: newStatus});
            toast.success(`Order #${id} updated to ${newStatus}`);  
        } catch (err) {
            toast.error("Status Update failiure");
            fetchOrders()//revert back if failed.
        }

    }
    // Helper: Status Colors
    const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'badge-ghost';
      case 'Cooking': return 'badge-warning';
      case 'Completed': return 'badge-success';
      case 'Delivered': return 'badge-primary';
      default: return 'badge-ghost';
    }
  };

    return(
        <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FaBoxOpen className="text-primary" /> Admin Dashboard
        </h1>
        <button className="btn btn-sm btn-outline gap-2" onClick={fetchOrders}>
          <FaSync /> Refresh
        </button>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-lg shadow-xl">
        <table className="table w-full">
          {/* Table Head */}
          <thead className="bg-base-300">
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover">
                <th className="font-mono text-sm">#{order.id}</th>
                <td className="font-bold">{order.cname}</td>
                
                {/* Items List */}
                <td className="text-sm">
                  {order.items && order.items.map((item, i) => (
                    <div key={i}>
                      {item.name} <span className="text-gray-400">x1</span>
                    </div>
                  ))}
                </td>
                
                <td className="font-bold">₹{order.tamt}</td>
                
                {/* Status Badge */}
                <td>
                  <div className={`badge ${getStatusColor(order.status)} badge-outline font-bold`}>
                    {order.status}
                  </div>
                </td>

                {/* Status Dropdown */}
                <td>
                  <select 
                    className="select select-bordered select-xs w-full max-w-xs"
                    value={order.status}
                    onChange={(e) => handleStatus(order.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Cooking">Cooking</option>
                    <option value="Completed">Completed</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && !loading && (
          <div className="text-center py-10 text-gray-500">
            No active orders. Wait for customers! 🕒
          </div>
        )}
      </div>
    </div>
    );

    
};


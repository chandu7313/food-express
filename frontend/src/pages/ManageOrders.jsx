import { useState, useEffect } from 'react';
import api from '../services/api';
import { Clock, CheckCircle, Truck, Package, XCircle, ChevronDown, ListFilter, Search, MapPin, User, ExternalLink } from 'lucide-react';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/admin');
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/orders/${id}/status`, { status });
            fetchOrders();
        } catch (error) {
            console.error(error);
        }
    };

    const statuses = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

    const filteredOrders = filterStatus === 'All'
        ? orders
        : orders.filter(o => o.status === filterStatus);

    if (loading) return <div className="p-10 text-center font-bold text-gray-400">Loading Orders...</div>;

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-[32px] font-black text-secondary">Live Order Manager</h2>
                    <p className="text-gray-400 font-medium mt-1">Manage incoming requests and delivery pipelines.</p>
                </div>
                <div className="flex gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto no-scrollbar max-w-full">
                    {['All', ...statuses].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterStatus === s ? 'bg-secondary text-white shadow-lg shadow-gray-200' : 'text-gray-400 hover:bg-gray-50'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-2 md:px-0">
                {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                    <div key={order._id} className="bg-white rounded-[32px] shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden hover:border-primary/20 transition-all duration-300">
                        {/* Status Label */}
                        <div className={`px-8 py-2 text-[10px] font-black uppercase tracking-[3px] text-center ${getStatusColor(order.status)}`}>
                            {order.status}
                        </div>

                        <div className="p-8">
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                                        <User className="text-gray-300" size={24} />
                                    </div>
                                    <div>
                                        <p className="font-black text-secondary text-lg">{order.userId?.name || 'Customer'}</p>
                                        <p className="text-xs font-bold text-gray-400 italic">#{order._id.slice(-6).toUpperCase()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-primary">₹{order.totalAmount + 57}</p>
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-start gap-4">
                                    <MapPin className="text-gray-300 flex-shrink-0 mt-1" size={18} />
                                    <p className="text-sm font-bold text-gray-500 line-clamp-2">{order.deliveryAddress}</p>
                                </div>
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                                    <Package className="text-gray-400 flex-shrink-0" size={18} />
                                    <div className="space-y-1">
                                        {order.items.map((item, i) => (
                                            <p key={i} className="text-[13px] font-black text-secondary/80">
                                                <span className="text-primary">{item.quantity}x</span> {item.name}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="relative flex-grow group">
                                    <select
                                        onChange={(e) => updateStatus(order._id, e.target.value)}
                                        value={order.status}
                                        className="w-full appearance-none bg-secondary text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-[2px] outline-none cursor-pointer hover:bg-black transition-all"
                                    >
                                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" size={18} />
                                </div>
                                <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 hover:text-secondary transition">
                                    <ExternalLink size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                        <p className="text-xl font-bold text-gray-300">No orders found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const getStatusColor = (status) => {
    switch (status) {
        case 'Pending': return 'bg-yellow-50 text-yellow-600';
        case 'Preparing': return 'bg-blue-50 text-blue-600';
        case 'Out for Delivery': return 'bg-purple-50 text-purple-600';
        case 'Delivered': return 'bg-emerald-50 text-emerald-600';
        case 'Cancelled': return 'bg-red-50 text-red-600';
        default: return 'bg-gray-50 text-gray-400';
    }
};

export default ManageOrders;

import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { Package, Clock, CheckCircle, Truck, XCircle, ChevronRight, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/user');
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleReorder = async (items) => {
        try {
            for (const item of items) {
                await addToCart(item.foodId?._id || item.foodId, item.quantity);
            }
            navigate('/cart');
        } catch (error) {
            console.error('Error reordering:', error);
        }
    };

    const getStatusStep = (status) => {
        const steps = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];
        return steps.indexOf(status);
    };

    if (loading) return (
        <div className="max-w-4xl mx-auto py-20 px-4 space-y-8">
            {[1, 2].map(n => <div key={n} className="h-64 bg-gray-50 rounded-3xl animate-pulse"></div>)}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 space-y-10 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black text-secondary">Past Orders</h2>
                    <p className="text-gray-400 font-bold mt-2">Track and manage your delicious memories</p>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[32px] shadow-sm border border-gray-100">
                    <div className="w-48 h-48 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package size={64} className="text-gray-200" />
                    </div>
                    <p className="text-gray-500 font-bold text-lg">No orders yet. Let's change that!</p>
                    <button onClick={() => navigate('/')} className="mt-6 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition">Browse Restaurants</button>
                </div>
            ) : (
                <div className="space-y-10">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-[32px] shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden group">
                            {/* Order Header */}
                            <div className="p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-gray-50/50 border-b border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                                        <img src="https://cdn-icons-png.flaticon.com/512/1532/1532688.png" className="w-10 h-10 opacity-80" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Order #{order._id.slice(-6).toUpperCase()}</p>
                                        <p className="font-black text-secondary text-lg uppercase tabular-nums">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
                                    <p className="text-2xl font-black text-primary">₹{order.totalAmount + 57}</p>
                                </div>
                            </div>

                            {/* Status Stepper */}
                            <div className="px-8 py-10 bg-white">
                                <div className="relative flex justify-between">
                                    {/* Line background */}
                                    <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 z-0"></div>
                                    <div
                                        className="absolute top-5 left-0 h-1 bg-primary z-0 transition-all duration-1000"
                                        style={{ width: `${(getStatusStep(order.status) / 3) * 100}%` }}
                                    ></div>

                                    {['Pending', 'Preparing', 'Out for Delivery', 'Delivered'].map((step, idx) => {
                                        const currentStep = getStatusStep(order.status);
                                        const isCompleted = idx <= currentStep;
                                        const isCurrent = idx === currentStep;

                                        return (
                                            <div key={step} className="relative z-10 flex flex-col items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isCompleted ? 'bg-primary border-emerald-50 text-white' : 'bg-white border-gray-100 text-gray-300'}`}>
                                                    {isCompleted ? <CheckCircle size={18} fill="currentColor" stroke="none" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                                                </div>
                                                <span className={`text-[11px] font-black uppercase tracking-tight text-center max-w-[80px] ${isCurrent ? 'text-secondary' : 'text-gray-400'}`}>
                                                    {step}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Items & Actions */}
                            <div className="p-8 border-t border-gray-50 flex flex-col md:flex-row justify-between gap-10">
                                <div className="flex-1 space-y-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 group/item">
                                            <span className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded text-[10px] font-black text-secondary">{item.quantity}</span>
                                            <span className="text-sm font-bold text-gray-600 group-hover/item:text-secondary transition">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 items-center">
                                    <button
                                        onClick={() => navigate(`/restaurant/${order.restaurantId}`)}
                                        className="w-full sm:w-auto px-6 py-3 border border-gray-200 rounded-xl font-bold text-sm text-secondary hover:bg-gray-50 transition flex items-center justify-center gap-2"
                                    >
                                        View Details <ChevronRight size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleReorder(order.items)}
                                        className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-xl font-black text-sm hover:shadow-lg transition flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw size={16} /> REORDER
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;

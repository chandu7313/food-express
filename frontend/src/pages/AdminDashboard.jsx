import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { ShoppingBag, Users, Utensils, DollarSign, Activity, Settings, BarChart3, ChevronRight } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRestaurants: 0,
        totalRevenue: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [ordersRes, restRes] = await Promise.all([
                    api.get('/orders/admin'),
                    api.get('/restaurants')
                ]);

                const totalRevenue = ordersRes.data.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
                setStats({
                    totalOrders: ordersRes.data.length,
                    totalRestaurants: restRes.data.length,
                    totalRevenue,
                    recentOrders: ordersRes.data.slice(0, 5)
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const metrics = [
        { title: 'Gross Revenue', value: `₹${stats.totalRevenue.toFixed(0)}`, icon: <DollarSign size={20} />, color: 'bg-emerald-500' },
        { title: 'Platform Orders', value: stats.totalOrders, icon: <ShoppingBag size={20} />, color: 'bg-blue-500' },
        { title: 'Brand Partners', value: stats.totalRestaurants, icon: <Utensils size={20} />, color: 'bg-primary' },
        { title: 'Customer Base', value: '1,240', icon: <Users size={20} />, color: 'bg-indigo-500' },
    ];

    if (loading) return <div className="p-10 text-center font-black text-gray-300 uppercase tracking-widest animate-pulse">Initializing Management Console...</div>;

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex justify-between items-center p-10 bg-secondary rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-4xl font-black mb-2 tracking-tight">Management Control</h1>
                    <p className="text-white/50 font-medium italic">Oversee, analyze, and expand your food delivery empire.</p>
                </div>
                <div className="relative z-10 flex gap-4">
                    <Link to="/admin/restaurants" className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition shadow-lg">Manage Brands</Link>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full -mr-20 -mt-20"></div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {metrics.map((metric, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/20 group hover:border-primary/30 transition-all cursor-default">
                        <div className={`${metric.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                            {metric.icon}
                        </div>
                        <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-1">{metric.title}</p>
                        <p className="text-3xl font-black text-secondary tabular-nums">{metric.value}</p>
                    </div>
                ))}
            </div>

            {/* Management Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-2xl font-black text-secondary flex items-center gap-3">
                                <Activity size={24} className="text-primary" /> Live Performance
                            </h3>
                            <button className="text-gray-400 font-bold text-sm hover:text-primary transition">Detailed Reports</button>
                        </div>
                        <div className="h-[250px] flex items-end justify-between gap-4">
                            {[60, 40, 70, 45, 90, 65, 80, 50, 95, 60, 85, 40].map((h, i) => (
                                <div key={i} className="flex-1 bg-primary rounded-t-lg transition-all duration-500 hover:brightness-110 group cursor-pointer relative" style={{ height: `${h}%` }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">₹{(h * 1.5).toFixed(0)}k</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100">
                        <h4 className="text-xl font-black text-secondary mb-6 tracking-tight">Quick Actions</h4>
                        <div className="space-y-4">
                            {[
                                { name: 'Audit Restaurants', path: '/admin/restaurants', icon: <Utensils size={18} />, color: 'text-primary bg-primary/10' },
                                { name: 'Monitor Orders', path: '/admin/orders', icon: <ShoppingBag size={18} />, color: 'text-blue-500 bg-blue-50' },
                                { name: 'System Settings', path: '#', icon: <Settings size={18} />, color: 'text-slate-500 bg-slate-50' },
                            ].map(action => (
                                <Link key={action.name} to={action.path} className="flex items-center justify-between p-5 rounded-2xl border border-gray-50 hover:border-gray-200 hover:bg-gray-50 transition group">
                                    <div className="flex items-center gap-4">
                                        <div className={`${action.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
                                            {action.icon}
                                        </div>
                                        <span className="font-bold text-secondary group-hover:text-primary transition">{action.name}</span>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="bg-primary/5 p-8 rounded-[40px] border border-primary/10">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="text-primary" size={20} />
                            <h4 className="font-black text-secondary uppercase tracking-widest text-xs">Security Audit</h4>
                        </div>
                        <p className="text-secondary/60 text-sm font-medium leading-relaxed">
                            Your administrative sessions are monitored and encrypted. Always logout after sensitive updates.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

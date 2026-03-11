import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Star, Clock, MapPin, ChevronDown, ChevronUp, Share2, Info, Edit, ArrowLeft, CheckCircle } from 'lucide-react';

const RestaurantDetails = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedCategories, setExpandedCategories] = useState({});
    const { addToCart } = useContext(CartContext);
    const { userInfo } = useContext(AuthContext);
    const navigate = useNavigate();
    const [toastMessage, setToastMessage] = useState('');

    const isAdmin = userInfo?.role === 'admin';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [restRes, foodRes] = await Promise.all([
                    api.get(`/restaurants/${id}`),
                    api.get(`/foods/${id}`)
                ]);
                setRestaurant(restRes.data);
                setFoods(foodRes.data);

                
                const cats = [...new Set(foodRes.data.map(f => f.category))];
                const initialExpanded = {};
                cats.forEach(c => initialExpanded[c] = true);
                setExpandedCategories(initialExpanded);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const toggleCategory = (cat) => {
        setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
    };


    const groupedFoods = foods.reduce((acc, food) => {
        const cat = food.category || 'Recommended';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(food);
        return acc;
    }, {});

    if (loading) return (
        <div className="max-w-[800px] mx-auto mt-10 space-y-8 px-4">
            <div className="h-40 bg-gray-100 rounded-3xl animate-pulse"></div>
            <div className="space-y-4">
                {[1, 2, 3].map(n => <div key={n} className="h-32 bg-gray-50 rounded-2xl animate-pulse"></div>)}
            </div>
        </div>
    );

    return (
        <div className="max-w-[800px] mx-auto pb-20 px-4 sm:px-0">
            {/* Header Utilities */}
            <div className="py-6 flex justify-between items-center text-[11px] font-black text-gray-400 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <Link to="/" className="hover:text-secondary transition underline-offset-4 hover:underline">Home</Link>
                    <span>/</span>
                    <span className="text-secondary">{restaurant?.name}</span>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-1 hover:text-secondary"><Share2 size={14} /> Share</button>
                    <button className="flex items-center gap-1 hover:text-secondary"><Info size={14} /> Info</button>
                </div>
            </div>

            {/* Restaurant Info Header */}
            <div className="mb-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-[28px] font-black text-secondary leading-tight mb-2">{restaurant?.name}</h1>
                        <p className="text-[14px] font-bold text-gray-400">{restaurant?.category || "North Indian, Chinese, Beverages"}</p>
                        <p className="text-[14px] font-bold text-gray-400">{restaurant?.address?.split(',')[0]}</p>
                    </div>
                    <div className="p-2 border border-gray-100 rounded-2xl shadow-sm bg-white text-center min-w-[70px]">
                        <div className="flex items-center justify-center gap-1 text-green-700 font-black text-lg border-b border-gray-100 pb-1 mb-1">
                            <Star size={18} fill="currentColor" />
                            <span>4.2</span>
                        </div>
                        <p className="text-[9px] font-black text-gray-400 uppercase">100+ ratings</p>
                    </div>
                </div>

                <div className="flex gap-6 py-6 border-y border-dashed border-gray-200">
                    <div className="flex items-center gap-2">
                        <Clock size={18} className="text-secondary" />
                        <span className="font-black text-secondary text-[14px]">25-35 MINS</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-black text-[14px]">₹</span>
                        <span className="font-black text-secondary text-[14px]">₹400 FOR TWO</span>
                    </div>
                </div>
            </div>

            {/* Menu Categories */}
            <div className="space-y-4">
                {Object.keys(groupedFoods).map(cat => (
                    <div key={cat} className="border-b-8 border-gray-50 last:border-0 pb-6">
                        <button
                            onClick={() => toggleCategory(cat)}
                            className="w-full flex justify-between items-center py-6 text-[18px] font-black text-secondary group"
                        >
                            <span>{cat} ({groupedFoods[cat].length})</span>
                            {expandedCategories[cat] ? <ChevronUp size={20} className="text-secondary group-hover:scale-110 transition" /> : <ChevronDown size={20} className="text-gray-400 group-hover:scale-110 transition" />}
                        </button>

                        {expandedCategories[cat] && (
                            <div className="divide-y divide-gray-100">
                                {groupedFoods[cat].map((item) => (
                                    <div key={item._id} className="flex justify-between gap-10 py-10 group">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={`w-3.5 h-3.5 border-2 p-0.5 flex items-center justify-center ${item.name.toLowerCase().includes('chicken') || item.name.toLowerCase().includes('mutton') || item.name.toLowerCase().includes('egg') ? 'border-red-600' : 'border-green-600'}`}>
                                                    <div className={`w-full h-full rounded-full ${item.name.toLowerCase().includes('chicken') || item.name.toLowerCase().includes('mutton') || item.name.toLowerCase().includes('egg') ? 'bg-red-600' : 'bg-green-600'}`}></div>
                                                </div>
                                                {item.name.toLowerCase().includes('best') && <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded">BESTSELLER</span>}
                                            </div>
                                            <h3 className="text-[18px] font-black text-secondary/90 group-hover:text-primary transition">{item.name}</h3>
                                            <p className="font-bold text-secondary mt-1">₹{item.price}</p>
                                            <p className="text-[14px] text-gray-400 mt-4 font-medium leading-relaxed max-w-sm line-clamp-2">
                                                Freshly prepared with authentic ingredients. A perfect balance of taste and health.
                                            </p>
                                        </div>

                                        <div className="relative w-36 h-36">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover rounded-2xl shadow-sm border border-gray-50 group-hover:scale-[1.02] transition duration-500"
                                            />
                                            {isAdmin ? (
                                                <Link
                                                    to={`/admin/restaurants/${id}/foods`}
                                                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-secondary text-white px-4 py-2.5 rounded-xl font-black text-[11px] shadow-xl hover:bg-black transition flex items-center gap-2 whitespace-nowrap"
                                                >
                                                    <Edit size={12} /> MANAGE
                                                </Link>
                                            ) : (
                                                <button
                                                    onClick={async () => {
                                                        if (!userInfo) {
                                                            navigate('/login');
                                                            return;
                                                        }
                                                        try {
                                                            await addToCart(item._id, 1);
                                                            setToastMessage(`${item.name} added to cart!`);
                                                            setTimeout(() => setToastMessage(''), 3000);
                                                        } catch (err) {
                                                            setToastMessage('Failed to add item. Please try again.');
                                                            setTimeout(() => setToastMessage(''), 3000);
                                                        }
                                                    }}
                                                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white text-primary px-8 py-2.5 rounded-xl font-black text-[13px] shadow-xl border border-gray-100 hover:bg-gray-50 transition active:scale-95 ring-1 ring-gray-100 whitespace-nowrap"
                                                >
                                                    ADD
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Floating Menu Toggle (Mock Swiggy feature) */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-secondary text-white px-6 py-3 rounded-full font-black text-[12px] uppercase tracking-widest shadow-2xl z-40 flex items-center gap-2 cursor-pointer hover:scale-105 transition">
                <Utensils size={14} /> MENU
            </div>

            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-secondary text-white px-6 py-4 rounded-full font-black text-sm shadow-2xl z-50 flex items-center gap-3 animate-bounce">
                    <CheckCircle size={18} className="text-primary" />
                    {toastMessage}
                </div>
            )}
        </div>
    );
};

const Utensils = ({ size, className }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path></svg>;

export default RestaurantDetails;

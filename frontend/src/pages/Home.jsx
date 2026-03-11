import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, SlidersHorizontal, ChevronDown, Flame, Sparkles, CheckCircle } from 'lucide-react';

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('Relevance');

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const { data } = await api.get('/restaurants');
                setRestaurants(data);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurants();
    }, []);

    const categories = [
        { name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400' },
        { name: 'Burger', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=400' },
        { name: 'Biryani', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=400' },
        { name: 'Dosa', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=400' },
        { name: 'Chinese', image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=400' },
        { name: 'Desserts', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=400' },
        { name: 'Salad', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400' },
    ];

    const filteredRestaurants = restaurants
        .filter(r => {
            const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' ||
                (r.category && r.category.toLowerCase().includes(selectedCategory.toLowerCase()));
            return matchesSearch && matchesCategory;
        });

    return (
        <div className="max-w-[1240px] mx-auto pt-6 pb-20 px-4">
            {/* Premium Hero Section */}
            <div className="mb-16 relative overflow-hidden rounded-[40px] bg-secondary p-10 md:p-16 text-white shadow-2xl shadow-primary/20 group border border-white/5">
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-widest mb-6 text-primary border border-primary/20">
                        <Sparkles size={14} className="animate-pulse" /> Limited Time Offers
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tighter">
                        Deliciousness <br /> <span className="text-primary italic group-hover:underline">Delivered Fast.</span>
                    </h1>
                    <p className="text-white/80 font-bold mb-10 text-lg md:text-xl max-w-lg">
                        Experience the finest cuisines from top-rated restaurants, delivered fresh to your doorstep.
                    </p>
                    <div className="relative w-full max-w-md shadow-2xl">
                        <input
                            type="text"
                            placeholder="Find your favorite meal..."
                            className="w-full pl-6 pr-14 py-5 rounded-2xl bg-white border-0 font-bold text-secondary outline-none focus:ring-4 focus:ring-primary/40 transition-all text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white cursor-pointer hover:bg-emerald-600 transition shadow-lg shadow-primary/30">
                            <Search size={22} strokeWidth={3} />
                        </div>
                    </div>
                </div>
                {/* Abstract background elements */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[80px]"></div>
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-primary/20 rounded-full blur-[60px]"></div>
            </div>

            {/* Categories Scroll */}
            <div className="mb-16">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-[24px] font-black text-secondary flex items-center gap-2">
                        <Flame size={24} className="text-primary" /> What's on your mind?
                    </h2>
                </div>
                <div className="flex gap-10 overflow-x-auto pb-6 no-scrollbar items-center">
                    <div
                        onClick={() => setSelectedCategory('All')}
                        className="flex-shrink-0 flex flex-col items-center gap-4 cursor-pointer group"
                    >
                        <div className={`w-32 h-32 rounded-full flex items-center justify-center p-5 transition-all duration-500 shadow-xl ${selectedCategory === 'All' ? 'bg-primary ring-8 ring-primary/10' : 'bg-white hover:bg-gray-50 border border-gray-100'}`}>
                            <Sparkles size={40} className={selectedCategory === 'All' ? 'text-white' : 'text-primary'} />
                        </div>
                        <span className={`font-black text-[15px] transition-all tracking-tight ${selectedCategory === 'All' ? 'text-primary scale-110' : 'text-gray-500'}`}>All</span>
                    </div>

                    {categories.map(cat => (
                        <div
                            key={cat.name}
                            onClick={() => setSelectedCategory(cat.name)}
                            className="flex-shrink-0 flex flex-col items-center gap-4 cursor-pointer group"
                        >
                            <div className={`w-36 h-36 rounded-full overflow-hidden transition-all duration-500 shadow-xl relative ${selectedCategory === cat.name ? 'ring-8 ring-primary/20 scale-105' : 'hover:scale-105'}`}>
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className={`w-full h-full object-cover transition duration-700 ${selectedCategory === cat.name ? 'scale-110 brightness-75' : 'group-hover:scale-110'}`}
                                />
                                {selectedCategory === cat.name && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-primary text-white p-2 rounded-full shadow-lg">
                                            <CheckCircle size={20} />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <span className={`font-black text-[15px] transition-all tracking-tight ${selectedCategory === cat.name ? 'text-primary scale-110' : 'text-gray-500'}`}>{cat.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filter & Sort Bar */}
            <div className="sticky top-[80px] bg-gray-50/80 backdrop-blur-md z-30 py-6 border-b border-gray-200 flex items-center justify-between mb-12 overflow-x-auto no-scrollbar gap-6">
                <div className="flex items-center gap-4">
                    <button
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl font-black text-sm text-secondary hover:shadow-lg transition-all"
                    >
                        <SlidersHorizontal size={18} /> Filter
                    </button>
                    {['Rating 4.0+', 'Pure Veg', 'Offers', 'Under ₹300'].map(f => (
                        <button key={f} className="px-6 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-sm text-secondary hover:bg-gray-50 transition shadow-sm whitespace-nowrap">
                            {f}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-gray-400 font-black text-[11px] uppercase tracking-[2px] hidden sm:block">Sort</span>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl font-black text-sm text-secondary hover:shadow-lg transition">
                        {sortBy} <ChevronDown size={16} />
                    </button>
                </div>
            </div>

            {/* Restaurant List */}
            <div>
                <h2 className="text-[28px] font-black text-secondary mb-10 tracking-tighter">
                    {selectedCategory === 'All' ? 'Must Try Restaurants' : `${selectedCategory} Specialities`}
                </h2>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="space-y-4">
                                <div className="bg-gray-200 rounded-[32px] aspect-[4/5] animate-pulse"></div>
                                <div className="h-4 w-3/4 bg-gray-200 rounded-full animate-pulse"></div>
                                <div className="h-4 w-1/2 bg-gray-200 rounded-full animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16">
                        {filteredRestaurants.length > 0 ? filteredRestaurants.map((restaurant) => (
                            <Link
                                key={restaurant._id}
                                to={`/restaurant/${restaurant._id}`}
                                className="group transition-transform active:scale-95 flex flex-col"
                            >
                                <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] shadow-2xl mb-6 bg-gray-100 ring-1 ring-gray-100">
                                    <img
                                        src={restaurant.image}
                                        alt={restaurant.name}
                                        className="w-full h-full object-cover transition duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity"></div>

                                    {/* Rating Badge */}
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 font-black text-[12px] shadow-xl">
                                        <Star size={14} className="text-green-600 fill-green-600" />
                                        <span className="text-secondary">4.2</span>
                                    </div>

                                    <div className="absolute bottom-6 left-6 right-6">
                                        <p className="text-white text-3xl font-black tracking-tighter uppercase leading-none mb-1">
                                            ₹150 OFF
                                        </p>
                                        <p className="text-white/60 text-[10px] font-black uppercase tracking-[2px]">On orders above ₹499</p>
                                    </div>
                                </div>

                                <div className="px-2">
                                    <h3 className="text-[20px] font-black text-secondary leading-tight mb-2 group-hover:text-primary transition-all duration-300">{restaurant.name}</h3>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="flex items-center gap-1 font-black text-emerald-600 text-sm">
                                            <Star size={16} fill="currentColor" /> 4.2
                                        </span>
                                        <span className="text-gray-300">•</span>
                                        <span className="font-black text-secondary text-sm">25-35 MINS</span>
                                    </div>
                                    <p className="text-[15px] font-bold text-gray-400 line-clamp-1 mb-3">
                                        {restaurant.category || "North Indian, Chinese"}
                                    </p>
                                    <div className="flex items-center gap-2 text-[13px] font-bold text-gray-400">
                                        <MapPin size={16} className="text-gray-300" />
                                        <span className="truncate">{restaurant.address}</span>
                                    </div>
                                </div>
                            </Link>
                        )) : (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-3xl font-black text-gray-200 uppercase tracking-tighter">No Culinary Treasures Found</p>
                                <button onClick={() => setSelectedCategory('All')} className="mt-6 bg-secondary text-white px-10 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition">Explore All</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;

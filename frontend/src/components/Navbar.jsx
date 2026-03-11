import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, LogOut, User, LayoutDashboard, Search } from 'lucide-react';

const Navbar = () => {
    const { userInfo, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();

    const cartCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isAdmin = userInfo?.role === 'admin';

    return (
        <nav className={`bg-white border-b border-gray-100 sticky top-0 z-50 py-1 ${isAdmin ? 'border-primary/20' : ''}`}>
            <div className="container mx-auto px-4 lg:px-20 h-20 flex justify-between items-center">
                <div className="flex items-center gap-10">
                    <Link to={isAdmin ? "/admin/dashboard" : "/"} className="flex items-center transition hover:scale-105">
                        <span className="text-4xl mr-2">🍔</span>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-primary tracking-tighter uppercase leading-none">FoodExpress</span>
                            {isAdmin && <span className="text-[10px] font-black text-secondary tracking-[2px] uppercase opacity-60">Management</span>}
                        </div>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-[15px] font-bold text-secondary">
                        {isAdmin ? (
                            <>
                                <Link to="/admin/dashboard" className="hover:text-primary transition">Dashboard</Link>
                                <Link to="/admin/restaurants" className="hover:text-primary transition">Manage Brands</Link>
                                <Link to="/admin/orders" className="hover:text-primary transition">Order Console</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/" className="hover:text-primary transition">Restaurants</Link>
                                <Link to="/orders" className="hover:text-primary transition">My Orders</Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    {!isAdmin && (
                        <div className="hidden sm:flex items-center gap-2 text-gray-400 group cursor-pointer hover:text-primary transition">
                            <Search size={18} />
                            <span className="text-sm font-bold">Search</span>
                        </div>
                    )}

                    {userInfo ? (
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 group cursor-pointer">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <User size={18} />
                                </div>
                                <span className="font-bold text-[15px] group-hover:text-primary transition">{userInfo.name.split(' ')[0]}</span>
                            </div>

                            {!isAdmin && (
                                <Link to="/cart" className="relative flex items-center gap-2 group">
                                    <div className="relative">
                                        <ShoppingCart size={22} className="group-hover:text-primary transition" />
                                        {cartCount > 0 && (
                                            <span className="absolute -top-3 -right-3 bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black animate-bounce">
                                                {cartCount}
                                            </span>
                                        )}
                                    </div>
                                    <span className="font-bold text-[15px] group-hover:text-primary transition">Cart</span>
                                </Link>
                            )}

                            <button
                                onClick={handleLogout}
                                className="text-gray-400 hover:text-red-500 transition"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="font-bold text-[15px] hover:text-primary transition">Login</Link>
                            <Link
                                to="/register"
                                className="bg-primary text-white px-8 py-3 rounded-xl font-black text-[14px] hover:shadow-lg hover:shadow-primary/30 transition-all uppercase tracking-tight"
                            >
                                Join Now
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

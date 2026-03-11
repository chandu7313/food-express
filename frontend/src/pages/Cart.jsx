import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Trash2, Plus, Minus, Truck } from 'lucide-react';

const Cart = () => {
    const { cart, removeFromCart, addToCart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const cartCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

    if (cart.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
                <div className="w-80 h-80 bg-gray-50 rounded-full flex items-center justify-center p-12 mb-8">
                    <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-2130356-1800917.png" alt="Empty Cart" className="w-full h-full object-contain opacity-60" />
                </div>
                <h2 className="text-[22px] font-black text-secondary mb-2">Your cart is empty</h2>
                <p className="text-gray-400 font-medium mb-8">You can go to home page to view more restaurants</p>
                <Link to="/" className="bg-primary text-white px-10 py-4 rounded-xl font-black uppercase text-[14px] hover:shadow-xl transition-all active:scale-95">
                    See Restaurants Near You
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#f1f1f6] min-h-[calc(100vh-80px)] py-10">
            <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Cart Items Section */}
                <div className="lg:col-span-8 bg-white p-8 rounded-[32px] shadow-sm">
                    <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                        <h1 className="text-[24px] font-black text-secondary">Order Summary</h1>
                        <button
                            onClick={clearCart}
                            className="text-gray-400 hover:text-red-500 font-bold text-xs uppercase tracking-widest transition"
                        >
                            Clear All
                        </button>
                    </div>

                    <div className="space-y-10">
                        {cart.items.map((item) => (
                            <div key={item.foodId?._id} className="flex flex-col sm:flex-row items-center gap-8 group">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex-shrink-0">
                                    <img src={item.foodId?.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-[17px] font-black text-secondary">{item.foodId?.name}</h3>
                                    <p className="text-gray-400 text-sm font-bold mt-1 italic">{item.foodId?.category || 'Classic Selection'}</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-4 bg-white border border-gray-200 p-1.5 rounded-xl">
                                        <button
                                            onClick={() => removeFromCart(item.foodId?._id)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-secondary transition"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="font-black text-secondary w-4 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => addToCart(item.foodId?._id, 1)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-primary hover:bg-primary/10 transition"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <p className="font-black text-secondary text-lg w-24 text-right">₹{item.foodId?.price * item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Total & Checkout Section */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white p-8 rounded-[32px] shadow-sm">
                        <h2 className="text-[18px] font-black text-secondary mb-6">Bill Details</h2>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-[14px] font-bold text-gray-400">
                                <span>Item Total</span>
                                <span>₹{cart.totalAmount}</span>
                            </div>
                            <div className="flex justify-between text-[14px] font-bold text-gray-400">
                                <span>Delivery Partner Fee</span>
                                <span>₹35</span>
                            </div>
                            <div className="flex justify-between text-[14px] font-bold text-gray-400">
                                <span>Govt Taxes & Charges</span>
                                <span>₹22</span>
                            </div>
                            <div className="h-[1px] bg-gray-100 my-4"></div>
                            <div className="flex justify-between text-[17px] font-black text-secondary uppercase tracking-tight">
                                <span>To Pay</span>
                                <span className="text-primary font-black">₹{cart.totalAmount + 57}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full bg-primary text-white py-5 rounded-2xl font-black text-[15px] shadow-xl shadow-primary/30 hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95"
                        >
                            PROCEED TO CHECKOUT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../services/api';
import { MapPin, CreditCard, ChevronLeft, ShieldCheck, Truck } from 'lucide-react';

const Checkout = () => {
    const { cart, clearCart } = useContext(CartContext);
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const totalToPay = cart.totalAmount + 57;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!address) return alert('Please enter delivery address');

        setLoading(true);
        try {
            const orderData = {
                items: cart.items.map(item => ({
                    foodId: item.foodId._id,
                    name: item.foodId.name,
                    price: item.foodId.price,
                    quantity: item.quantity
                })),
                totalAmount: cart.totalAmount,
                deliveryAddress: address,
                paymentMethod: 'COD',
                restaurantId: cart.items[0]?.foodId?.restaurantId || cart.items[0]?.restaurantId 
            };

            await api.post('/orders', orderData);
            clearCart();
            alert('Order placed successfully!');
            navigate('/orders');
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (cart.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-2xl font-black text-secondary mb-4">Your cart is empty</h2>
                <button onClick={() => navigate('/')} className="bg-primary text-white px-8 py-3 rounded-xl font-bold">Return Home</button>
            </div>
        );
    }

    return (
        <div className="bg-[#f4f4f7] min-h-[calc(100vh-80px)] py-10 px-4">
            <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Left: Input Sections */}
                <div className="lg:col-span-8 space-y-8">
                    <button
                        onClick={() => navigate('/cart')}
                        className="flex items-center gap-2 text-gray-400 font-bold text-sm uppercase tracking-widest hover:text-secondary transition"
                    >
                        <ChevronLeft size={18} /> Back to Cart
                    </button>

                    {/* Delivery Address */}
                    <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="text-[20px] font-black text-secondary">Delivery Address</h3>
                                <p className="text-gray-400 font-medium italic text-sm">Where should we deliver your food?</p>
                            </div>
                        </div>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Type your complete house address here..."
                            className="w-full h-40 p-6 bg-gray-50 border-0 rounded-3xl outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all text-secondary font-medium resize-none"
                        ></textarea>
                    </div>

                    {/* Payment Method (Mock) */}
                    <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100 opacity-60 grayscale-[0.5]">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                <CreditCard size={24} />
                            </div>
                            <div>
                                <h3 className="text-[20px] font-black text-secondary">Payment Method</h3>
                                <p className="text-gray-400 font-medium italic text-sm">Select how you'd like to pay.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                            {['Google Pay', 'PhonePe', 'Card', 'COD'].map(p => (
                                <div key={p} className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 cursor-not-allowed ${p === 'COD' ? 'border-primary bg-primary/5' : 'border-gray-50'}`}>
                                    <span className="font-bold text-xs uppercase tracking-widest">{p}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Summary Box */}
                <div className="lg:col-span-4">
                    <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-gray-200 border border-gray-100 sticky top-10">
                        <h4 className="text-[18px] font-black text-secondary mb-8 pb-4 border-b border-gray-50">Order Summary</h4>

                        <div className="space-y-4 mb-10 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                            {cart.items.map((item, i) => (
                                <div key={i} className="flex justify-between items-center text-sm">
                                    <div className="flex gap-3">
                                        <span className="text-gray-400 font-black">{item.quantity}x</span>
                                        <span className="font-bold text-gray-700 line-clamp-1">{item.foodId.name}</span>
                                    </div>
                                    <span className="font-black text-secondary">₹{item.foodId.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 pt-6 border-t border-dashed border-gray-200">
                            <div className="flex justify-between text-[13px] font-bold text-gray-400">
                                <span>Item Total</span>
                                <span>₹{cart.totalAmount}</span>
                            </div>
                            <div className="flex justify-between text-[13px] font-bold text-gray-400">
                                <span className="flex items-center gap-1">Delivery Fee <Truck size={12} /></span>
                                <span>₹35</span>
                            </div>
                            <div className="flex justify-between text-[13px] font-bold text-gray-400">
                                <span>Taxes & Charges</span>
                                <span>₹22</span>
                            </div>
                            <div className="flex justify-between pt-4 text-[17px] font-black text-secondary uppercase">
                                <span>To Pay</span>
                                <span className="text-primary tracking-tighter text-2xl">₹{totalToPay}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className="w-full mt-10 bg-secondary text-white py-5 rounded-2xl font-black text-[14px] uppercase tracking-widest shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                        >
                            {loading ? 'PLACING ORDER...' : 'PLACE ORDER'}
                        </button>

                        <div className="mt-8 flex items-center justify-center gap-2 text-green-600">
                            <ShieldCheck size={16} />
                            <span className="text-[10px] font-black uppercase tracking-wider">100% Secure Checkout</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

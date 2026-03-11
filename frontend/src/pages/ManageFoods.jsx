import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, Edit2, Trash2, X, ChevronLeft, DollarSign } from 'lucide-react';

const ManageFoods = () => {
    const { id } = useParams();
    const [foods, setFoods] = useState([]);
    const [restaurant, setRestaurant] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        image: '',
        isAvailable: true
    });

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [restRes, foodRes] = await Promise.all([
                api.get(`/restaurants/${id}`),
                api.get(`/foods/admin/${id}`)  
            ]);
            setRestaurant(restRes.data);
            setFoods(foodRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (food) => {
        setEditItem(food);
        setFormData({
            name: food.name,
            price: food.price.toString(),
            category: food.category,
            image: food.image,
            isAvailable: food.isAvailable
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditItem(null);
        setFormData({ name: '', price: '', category: '', image: '', isAvailable: true });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = {
                ...formData,
                price: Number(formData.price),
                image: formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'
            };

            if (editItem) {
                await api.put(`/foods/${editItem._id}`, dataToSubmit);
                alert('Item updated successfully!');
            } else {
                await api.post(`/foods/admin/${id}`, dataToSubmit); // Admin POST route
                alert('Item added successfully!');
            }

            closeModal();
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to save item. ' + (error.response?.data?.message || 'Please check console.'));
        }
    };

    const deleteFood = async (foodId) => {
        if (window.confirm('Delete this item?')) {
            try {
                await api.delete(`/foods/${foodId}`);
                fetchData();
            } catch (error) {
                console.error(error);
            }
        }
    };

    if (loading) return <div>Loading menu...</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link to="/admin/restaurants" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition"><ChevronLeft /></Link>
                <div>
                    <h2 className="text-3xl font-black text-secondary">Menu: {restaurant?.name}</h2>
                    <p className="text-gray-500">Manage food items and pricing</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl flex justify-between items-center border border-gray-100">
                <div className="flex items-center gap-6">
                    <img src={restaurant?.image} className="w-16 h-16 rounded-2xl object-cover shadow-md" />
                    <div>
                        <p className="font-black text-xl text-secondary">{restaurant?.name}</p>
                        <p className="text-sm text-gray-500">{foods.length} items on menu</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-600 transition shadow-lg shadow-emerald-100"
                >
                    <Plus size={20} />
                    <span>Add New Item</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {foods.map((food) => (
                    <div key={food._id} className="bg-white rounded-3xl overflow-hidden shadow-md group hover:shadow-xl transition border border-gray-50">
                        <div className="h-40 overflow-hidden relative">
                            <img src={food.image} className="w-full h-full object-cover" />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full font-black text-primary flex items-center text-sm">
                                ₹{food.price}
                            </div>
                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest ${food.isAvailable ? 'bg-emerald-500 text-white' : 'bg-red-100 text-red-500'}`}>
                                {food.isAvailable ? '● Visible' : '○ Hidden'}
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-lg text-secondary leading-tight">{food.name}</h4>
                                    <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest">{food.category}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-4 border-t border-gray-50">
                                <button
                                    onClick={() => handleEdit(food)}
                                    className="flex-grow bg-gray-50 text-gray-600 py-2 rounded-xl text-sm font-bold hover:bg-gray-100 transition"
                                >
                                    Edit
                                </button>
                                <button onClick={() => deleteFood(food._id)} className="px-4 bg-red-50 text-red-500 py-2 rounded-xl text-sm font-bold hover:bg-red-100 transition">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-2xl font-black text-secondary">{editItem ? 'Edit Food Item' : 'New Food Item'}</h3>
                            <button onClick={closeModal}><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Item Name</label>
                                    <input required className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl outline-none focus:ring-2 focus:ring-primary" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Price ($)</label>
                                        <input type="number" step="0.01" required className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl outline-none focus:ring-2 focus:ring-primary" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Category</label>
                                        <input required className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl outline-none focus:ring-2 focus:ring-primary" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Image URL</label>
                                    <input className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl outline-none focus:ring-2 focus:ring-primary" placeholder="Paste Unsplash URL" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                                </div>
                            </div>
                            <div className="pt-4 flex gap-4">
                                <button type="submit" className="flex-grow bg-primary text-white py-4 rounded-xl font-bold hover:bg-emerald-600 transition">
                                    {editItem ? 'Update Item' : 'Add Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageFoods;

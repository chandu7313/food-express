import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, Check, X, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        image: '',
        isActive: true
    });

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/restaurants');
            setRestaurants(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (restaurant) => {
        setEditItem(restaurant);
        setFormData({
            name: restaurant.name,
            description: restaurant.description,
            address: restaurant.address,
            image: restaurant.image,
            isActive: restaurant.isActive
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditItem(null);
        setFormData({ name: '', description: '', address: '', image: '', isActive: true });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = {
                ...formData,
                image: formData.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'
            };

            if (editItem) {
                await api.put(`/restaurants/${editItem._id}`, dataToSubmit);
                alert('Restaurant updated successfully!');
            } else {
                await api.post('/restaurants', dataToSubmit);
                alert('Restaurant created successfully!');
            }

            closeModal();
            fetchRestaurants();
        } catch (error) {
            console.error(error);
            alert('Failed to save restaurant. ' + (error.response?.data?.message || 'Please check console.'));
        }
    };

    const deleteRestaurant = async (id) => {
        if (window.confirm('Are you sure you want to delete this restaurant?')) {
            try {
                await api.delete(`/restaurants/${id}`);
                fetchRestaurants();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-secondary">Manage Restaurants</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-600 transition"
                >
                    <Plus size={20} />
                    <span>Add Restaurant</span>
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-8 py-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Restaurant</th>
                            <th className="px-8 py-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Address</th>
                            <th className="px-8 py-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Status</th>
                            <th className="px-8 py-4 font-bold text-gray-500 uppercase text-xs tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {restaurants.map((r) => (
                            <tr key={r._id} className="hover:bg-gray-50/50 transition">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <img src={r.image} className="w-12 h-12 rounded-lg object-cover" />
                                        <div>
                                            <p className="font-bold text-secondary">{r.name}</p>
                                            <p className="text-xs text-gray-400">Added on {new Date(r.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-gray-600 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{r.address}</td>
                                <td className="px-8 py-6">
                                    {r.isActive ? (
                                        <span className="flex items-center gap-1 text-green-600 font-bold text-xs uppercase bg-green-50 px-3 py-1 rounded-full w-fit border border-green-100">
                                            <Check size={12} /> Active
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-red-600 font-bold text-xs uppercase bg-red-50 px-3 py-1 rounded-full w-fit border border-red-100">
                                            <X size={12} /> Inactive
                                        </span>
                                    )}
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-3">
                                        <Link to={`/admin/restaurants/${r._id}/foods`} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition" title="Manage Menu">
                                            <Utensils size={18} />
                                        </Link>
                                        <button
                                            onClick={() => handleEdit(r)}
                                            className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => deleteRestaurant(r._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in duration-200">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-2xl font-black text-secondary">{editItem ? 'Edit Restaurant' : 'New Restaurant'}</h3>
                            <button onClick={closeModal}><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Name</label>
                                    <input required className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl outline-none focus:ring-2 focus:ring-primary" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Image URL</label>
                                    <input className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl outline-none focus:ring-2 focus:ring-primary" placeholder="Paste Unsplash or Cloudinary URL" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Address</label>
                                <input required className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl outline-none focus:ring-2 focus:ring-primary" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Description</label>
                                <textarea required className="w-full h-32 px-4 py-3 bg-gray-50 border-0 rounded-xl outline-none focus:ring-2 focus:ring-primary resize-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>
                            <div className="pt-4 flex gap-4">
                                <button type="submit" className="flex-grow bg-primary text-white py-4 rounded-xl font-bold hover:bg-emerald-600 transition">
                                    {editItem ? 'Update Restaurant' : 'Create Restaurant'}
                                </button>
                                <button type="button" onClick={closeModal} className="px-8 bg-gray-100 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-200 transition">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const Utensils = ({ size, className }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path></svg>;

export default ManageRestaurants;

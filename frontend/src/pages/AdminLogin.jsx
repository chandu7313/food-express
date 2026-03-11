import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl mt-10 border-t-4 border-primary">
            <h2 className="text-3xl font-bold text-center mb-2 text-secondary">Admin Portal</h2>
            <p className="text-gray-500 text-center mb-8">Access management dashboard</p>
            {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg border border-red-200 mb-6">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Admin Email</label>
                    <input
                        type="email"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Password</label>
                    <input
                        type="password"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-secondary text-white py-3 rounded-xl font-bold hover:bg-black transition shadow-lg disabled:opacity-50"
                >
                    {loading ? 'Authenticating...' : 'Access Dashboard'}
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;

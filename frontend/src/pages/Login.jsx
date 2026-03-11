import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
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
            const data = await login(email, password);
            if (data?.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-white px-4">
            <div className="w-full max-w-[450px]">
                <div className="mb-10 flex justify-between items-start">
                    <div>
                        <h1 className="text-[32px] font-black tracking-tight text-secondary">Login</h1>
                        <p className="mt-2 flex items-center gap-2 text-[14px] font-medium text-gray-500">
                            or <Link to="/register" className="text-primary font-bold hover:underline">create an account</Link>
                            <div className="w-8 h-[1px] bg-secondary mt-1"></div>
                        </p>
                    </div>
                    <span className="text-7xl opacity-80">🥘</span>
                </div>

                {error && <div className="mb-6 rounded-lg bg-red-50 p-4 font-bold text-red-500 border-l-4 border-red-500 text-sm animate-shake">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative border-b-2 border-gray-100 focus-within:border-primary transition-all pb-1 group">
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest pl-4 group-focus-within:text-primary transition">Email Address</label>
                        <input
                            type="email"
                            className="w-full bg-transparent px-4 py-3 outline-none font-bold text-lg text-secondary placeholder:text-gray-200"
                            placeholder="example@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="relative border-b-2 border-gray-100 focus-within:border-primary transition-all pb-1 group">
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest pl-4 group-focus-within:text-primary transition">Password</label>
                        <input
                            type="password"
                            className="w-full bg-transparent px-4 py-3 outline-none font-bold text-lg text-secondary placeholder:text-gray-200"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-10 w-full bg-primary py-4 text-[15px] font-black uppercase tracking-tight text-white shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/40 disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Login'}
                    </button>
                </form>

                <p className="mt-8 text-center text-[12px] font-bold text-gray-400">
                    By clicking on Login, I accept the <span className="text-secondary hover:underline cursor-pointer">Terms & Conditions</span> & <span className="text-secondary hover:underline cursor-pointer">Privacy Policy</span>
                </p>
            </div>
        </div>
    );
};

export default Login;

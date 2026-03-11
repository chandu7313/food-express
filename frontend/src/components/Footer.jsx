import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram, Send, ShieldCheck } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-secondary text-white pt-20 pb-10">
            <div className="max-w-[1240px] mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center mb-6">
                            <span className="text-4xl mr-2">🍔</span>
                            <span className="text-3xl font-black text-primary tracking-tighter uppercase">FoodExpress</span>
                        </Link>
                        <p className="text-gray-400 font-medium max-w-sm mb-8">
                            Delivering the best culinary experiences right to your doorstep. Fast, fresh, and fantastic.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Instagram, Github].map((Icon, i) => (
                                <div key={i} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary transition text-white/50 hover:text-white">
                                    <Icon size={18} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8">Company</h4>
                        <ul className="space-y-4 text-gray-400 font-bold">
                            <li><Link to="/" className="hover:text-primary transition">About Us</Link></li>
                            <li><Link to="/" className="hover:text-primary transition">Careers</Link></li>
                            <li><Link to="/" className="hover:text-primary transition">Our Team</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8">Support</h4>
                        <ul className="space-y-4 text-gray-400 font-bold">
                            <li><Link to="/" className="hover:text-primary transition">Help Center</Link></li>
                            <li><Link to="/" className="hover:text-primary transition">Privacy Policy</Link></li>
                            <li><Link to="/admin/login" className="flex items-center gap-2 text-primary hover:underline group">
                                <ShieldCheck size={16} /> Admin Portal
                            </Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 font-bold text-sm">© 2026 FoodExpress. Built with ❤️ for your submission.</p>
                    <div className="flex items-center gap-8 text-gray-500 font-bold text-sm">
                        <span>Powered by MERN</span>
                        <span className="flex items-center gap-2">
                            <Send size={14} /> Hyderabad, India
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
